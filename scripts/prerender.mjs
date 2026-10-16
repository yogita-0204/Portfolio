// Post-build prerender: snapshot the real rendered page into dist/index.html so
// crawlers and no-JS visitors get content instead of an empty #root div.
// Hand-rolled on purpose: headless Edge/Chrome --dump-dom, zero new dependencies.
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const distIndex = join(root, 'dist', 'index.html');
const PORT = 4319;
const TARGET = `http://localhost:${PORT}/`;

// Chrome first: Edge 155's --dump-dom returns empty output on Windows (verified
// empirically), so Edge stays only as a fallback.
const BROWSERS = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean);

const browser = BROWSERS.find((path) => existsSync(path));
if (!browser) {
  // ponytail: soft-skip; make this a hard failure if deploys ever require prerender.
  console.warn('[prerender] no headless browser found — dist stays unprerendered.');
  process.exit(0);
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
  shell: true,
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
  process.exit(0);
}

// 2) Let the app render (virtual time fast-forwards timers), then serialize the DOM.
const profile = mkdtempSync(join(tmpdir(), 'prerender-profile-'));
const dump = spawnSync(
  browser,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    // Force the light theme so the snapshot matches ThemeProvider's day-first
    // hydration render even on machines/CI running dark mode.
    '--blink-settings=preferredColorScheme=1',
    `--user-data-dir=${profile}`,
    '--window-size=1280,900',
    '--virtual-time-budget=1500',
    '--dump-dom',
    TARGET,
  ],
  { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, timeout: 120000 }
);

stopPreview();
try {
  rmSync(profile, { recursive: true, force: true });
} catch {
  // Leftover profile dirs in %TEMP% are harmless.
}

const html = dump.stdout ?? '';
const checks = ['id="root"', '<section', 'FIELD WORK'];
const missing = checks.filter((needle) => !html.includes(needle));
if (missing.length > 0) {
  console.error(`[prerender] dump looks wrong (missing: ${missing.join(', ')}) — dist stays unprerendered.`);
  process.exit(1);
}

writeFileSync(distIndex, html, 'utf8');
console.log(`[prerender] wrote ${(Buffer.byteLength(html) / 1024).toFixed(0)} kB of prerendered HTML to dist/index.html`);
