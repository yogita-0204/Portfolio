// Post-build prerender: snapshot the real rendered page into dist/index.html so
// crawlers and no-JS visitors get content instead of an empty #root div.
// Driven over CDP by puppeteer-core (small, downloads no browser): system Chrome
// locally, @sparticuz/chromium's build-container binary on Vercel. A raw
// --dump-dom spawn returned empty output on Vercel's Amazon Linux 2023 build
// image with no useful error; CDP capture throws real errors instead.
import puppeteer from 'puppeteer-core';
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const distIndex = join(root, 'dist', 'index.html');
const PORT = 4319;
const TARGET = `http://localhost:${PORT}/`;
const onVercel = Boolean(process.env.VERCEL);

// System browsers for local/generic CI runs; Vercel's Linux build image has none
// of these, so it falls through to the bundled binary below.
const BROWSERS = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean);

let browser = BROWSERS.find((path) => existsSync(path));
let useBundled = false;
let bundledArgs = [];
if (!browser) {
  // CI rebuilds (Vercel etc.) have no system Chrome; @sparticuz/chromium ships
  // its own chromium binary plus the AL2023 shared libraries it needs. Needs
  // Node >= 20 for the env bootstrap, hence the "engines" field in package.json.
  try {
    const { default: chromium } = await import('@sparticuz/chromium');
    const extracted = await chromium.executablePath(); // also unpacks AL2023 libs into /tmp
    if (existsSync(extracted)) {
      browser = extracted;
      useBundled = true;
      bundledArgs = chromium.args ?? [];
    }
  } catch (error) {
    console.warn(`[prerender] @sparticuz/chromium unavailable: ${error?.message ?? error}`);
  }
}
if (!browser) {
  if (onVercel) {
    // Loud on CI: shipping an unprerendered SPA is the exact bug prerender exists for.
    console.error('[prerender] no browser on Vercel and @sparticuz/chromium unavailable — failing the build.');
    process.exit(1);
  }
  // ponytail: soft-skip locally; make this a hard failure if deploys ever require prerender.
  console.warn('[prerender] no headless browser found — dist stays unprerendered.');
  process.exit(0);
}

if (onVercel) {
  console.log(
    `[prerender] node ${process.version}, browser=${browser}, LD_LIBRARY_PATH=${process.env.LD_LIBRARY_PATH ?? '(unset)'}`
  );
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let preview = null;

const stopPreview = () => {
  if (!preview) return;
  if (process.platform === 'win32') {
    spawnSync('taskkill', ['/pid', String(preview.pid), '/T', '/F'], { stdio: 'ignore' });
  } else {
    preview.kill();
  }
  preview = null;
};
process.on('exit', stopPreview);

// 1) Serve the build output.
preview = spawn('npm', ['run', 'preview', '--', '--port', String(PORT), '--strictPort'], {
  cwd: root,
  // npm is npm.cmd on Windows (needs the shell); on Linux the real binary needs
  // no shell, which also avoids DEP0190 and shell-quoting ambiguity.
  shell: process.platform === 'win32',
  stdio: 'ignore',
});

let up = false;
for (let attempt = 0; attempt < 40 && !up; attempt += 1) {
  try {
    const response = await fetch(TARGET);
    up = response.ok;
  } catch {
    await sleep(250);
  }
}
if (!up) {
  console.warn('[prerender] preview server did not come up — dist stays unprerendered.');
  process.exit(onVercel ? 1 : 0);
}

// 2) Drive the browser over CDP and serialize the settled DOM.
const captureHtml = async () => {
  const launched = await puppeteer.launch({
    executablePath: browser,
    // chrome-headless-shell (the bundled binary) needs 'shell'; desktop Chrome
    // on local machines wants the modern headless mode.
    headless: useBundled ? 'shell' : true,
    // @sparticuz's flags cover --no-sandbox/--single-process needed in containers.
    args: useBundled ? bundledArgs : [],
    protocolTimeout: 180000,
  });
  try {
    const page = await launched.newPage();
    await page.setViewport({ width: 1280, height: 900 });
    // Force the light theme so the snapshot matches ThemeProvider's day-first
    // hydration render even on machines/CI running dark mode.
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);
    await page.goto(TARGET, { waitUntil: 'networkidle0', timeout: 60000 });
    await sleep(1200); // let entrance animations and font swaps settle before serializing
    return await page.content();
  } finally {
    await launched.close().catch(() => {});
  }
};

let html;
try {
  html = await captureHtml();
} catch (error) {
  console.error(`[prerender] browser render failed: ${error?.message ?? error}`);
  process.exit(1);
}
stopPreview();

const checks = ['id="root"', '<section', 'FIELD WORK'];
const missing = checks.filter((needle) => !html.includes(needle));
if (missing.length > 0) {
  console.error(`[prerender] captured HTML looks wrong (missing: ${missing.join(', ')}) — dist stays unprerendered.`);
  process.exit(1);
}

writeFileSync(distIndex, html, 'utf8');
console.log(`[prerender] wrote ${(Buffer.byteLength(html) / 1024).toFixed(0)} kB of prerendered HTML to dist/index.html`);
