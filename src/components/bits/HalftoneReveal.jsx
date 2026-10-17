// HalftoneReveal — adapted from React Bits (reactbits.dev), MIT.
//
// Prints an image as a halftone screen; the cursor swells the real photo
// through the print, with a mask pass keeping the revealed trail alive.
// GLSL lives in ./halftoneShaders.js; container/canvas carry Tailwind
// utilities directly (no sibling CSS file).

import { useEffect, useRef } from 'react';

import { MASK, VERTEX, VIEW } from './halftoneShaders';

const DEFAULT_SRC = 'https://images.unsplash.com/photo-1693250707557-a846a014b321?q=80&w=1400&auto=format&fit=crop';

const MODES = { mono: 0, duotone: 1, color: 2 };
const SHAPES = { dot: 0, ellipse: 1, square: 2, diamond: 3, line: 4, cross: 5 };
const MAX_BURSTS = 4;
const BURST_SECONDS = 1.3;
const INTRO_SECONDS = 1.4;
const MASK_SCALE = 0.5;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const compile = (gl, type, source) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  gl.deleteShader(shader);
  return null;
};

const link = (gl, fragmentSource) => {
  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.bindAttribLocation(program, 0, 'aPosition');
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (gl.getProgramParameter(program, gl.LINK_STATUS)) return program;
  gl.deleteProgram(program);
  return null;
};

const locate = (gl, program, names) => {
  const result = {};
  for (const name of names) result[name] = gl.getUniformLocation(program, name);
  return result;
};

const wanderAt = (t, w, h) => [
  w * (0.5 + 0.32 * Math.sin(t * 0.53) + 0.08 * Math.sin(t * 1.31 + 0.6)),
  h * (0.5 + 0.27 * Math.sin(t * 0.71 + 1.1) + 0.07 * Math.cos(t * 1.57))
];

const measureEdge = (context, image) => {
  const size = 32;
  context.canvas.width = size;
  context.canvas.height = size;
  context.clearRect(0, 0, size, size);
  context.drawImage(image, 0, 0, size, size);
  const data = context.getImageData(0, 0, size, size).data;
  const sum = [0, 0, 0];
  const squares = [0, 0, 0];
  let count = 0;
  let clear = 0;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (x > 0 && y > 0 && x < size - 1 && y < size - 1) continue;
      const i = (y * size + x) * 4;
      if (data[i + 3] < 250) clear++;
      for (let c = 0; c < 3; c++) {
        const v = data[i + c] / 255;
        sum[c] += v;
        squares[c] += v * v;
      }
      count++;
    }
  }
  const matte = [sum[0] / count, sum[1] / count, sum[2] / count];
  const spread =
    matte.reduce((total, mean, c) => total + Math.sqrt(Math.max(0, squares[c] / count - mean * mean)), 0) / 3;
  return { matte, plain: clear < count * 0.5 && spread < 0.06 };
};

const HalftoneReveal = ({
  src = DEFAULT_SRC,
  fit = 'cover',
  mode = 'mono',
  shape = 'dot',
  cellSize = 6,
  angle = 45,
  dotScale = 1,
  inkColor = '#120f17',
  accentColor = '#ff4f2a',
  paperColor = '#ffffff',
  contrast = 1.1,
  brightness = 0,
  invert = false,
  roughness = 0,
  misregistration = 0,
  revealRadius = 160,
  softness = 0.6,
  linger = 1.2,
  reverse = false,
  wander = false,
  clickBurst = true,
  intro = true,
  className = '',
  style
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const wakeRef = useRef(null);
  const settings = {
    fit,
    mode: MODES[mode] ?? 0,
    shape: SHAPES[shape] ?? 0,
    cellSize: clamp(cellSize, 2, 80),
    angle,
    dotScale: clamp(dotScale, 0.2, 2),
    inkColor: String(inkColor),
    accentColor: String(accentColor),
    paperColor: String(paperColor),
    contrast,
    brightness,
    invert,
    roughness: clamp(roughness, 0, 1),
    misregistration: clamp(misregistration, 0, 1),
    revealRadius: Math.max(0, revealRadius),
    softness: clamp(softness, 0, 1),
    linger: Math.max(0, linger),
    reverse,
    wander,
    clickBurst,
    intro
  };
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const gl = canvas?.getContext('webgl2', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false
    });
    if (!container || !canvas || !gl) return undefined;

    const maskProgram = link(gl, MASK);
    const viewProgram = link(gl, VIEW);
    if (!maskProgram || !viewProgram) return undefined;
    const maskUniforms = locate(gl, maskProgram, [
      'uPrevious',
      'uTexture',
      'uView',
      'uFrom',
      'uTo',
      'uRadius',
      'uSoftness',
      'uStrength',
      'uFade'
    ]);
    const viewUniforms = locate(gl, viewProgram, [
      'uImage',
      'uMask',
      'uResolution',
      'uView',
      'uDpr',
      'uFrame',
      'uTexels',
      'uMode',
      'uShape',
      'uCell',
      'uAngle',
      'uScale',
      'uInk',
      'uAccent',
      'uPaper',
      'uContrast',
      'uBrightness',
      'uInvert',
      'uRough',
      'uShift',
      'uMatte',
      'uKey',
      'uReverse',
      'uIntro',
      'uBursts',
      'uBurstWidth'
    ]);

    const vao = gl.createVertexArray();
    const buffer = gl.createBuffer();
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);

    const floatMask = !!gl.getExtension('EXT_color_buffer_float');
    const imageTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, imageTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(4));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    const createMask = (width, height) => {
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      if (floatMask) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, width, height, 0, gl.RGBA, gl.HALF_FLOAT, null);
      else gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      const framebuffer = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      return { texture, framebuffer, width, height };
    };
    const destroyMask = target => {
      gl.deleteFramebuffer(target.framebuffer);
      gl.deleteTexture(target.texture);
    };
    let masks = [createMask(2, 2), createMask(2, 2)];

    const probe = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const colorCache = new Map();
    const bursts = [];
    const burstData = new Float32Array(MAX_BURSTS * 4);
    const pointer = { x: 0, y: 0, inside: false, fresh: true, placed: false };
    const brush = { x: 0, y: 0, px: 0, py: 0 };
    const state = {
      width: 1,
      height: 1,
      dpr: 1,
      image: null,
      matte: [0, 0, 0],
      key: 0,
      introStart: 0,
      presence: 0,
      drift: 0,
      trailUntil: 0
    };
    let raf = 0;
    let last = 0;
    let visible = true;
    let alive = true;

    const toRgb = value => {
      if (colorCache.has(value)) return colorCache.get(value);
      let rgb = [0, 0, 0];
      if (probe && value) {
        probe.clearRect(0, 0, 1, 1);
        probe.fillStyle = '#000000';
        probe.fillStyle = /^[0-9a-f]{3,8}$/i.test(value) ? `#${value}` : value;
        probe.fillRect(0, 0, 1, 1);
        const [r, g, b] = probe.getImageData(0, 0, 1, 1).data;
        rgb = [r / 255, g / 255, b / 255];
      }
      colorCache.set(value, rgb);
      return rgb;
    };

    const frameRect = s => {
      const { image, width, height } = state;
      if (!image) return [0, 0, width, height];
      const scale = (s.fit === 'cover' ? Math.max : Math.min)(width / image.naturalWidth, height / image.naturalHeight);
      const w = image.naturalWidth * scale;
      const h = image.naturalHeight * scale;
      return [(width - w) / 2, (height - h) / 2, w, h];
    };

    const resize = () => {
      const width = Math.max(1, container.clientWidth);
      const height = Math.max(1, container.clientHeight);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      state.width = width;
      state.height = height;
      state.dpr = dpr;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      const mw = Math.max(2, Math.round(width * MASK_SCALE));
      const mh = Math.max(2, Math.round(height * MASK_SCALE));
      if (mw !== masks[0].width || mh !== masks[0].height) {
        masks.forEach(destroyMask);
        masks = [createMask(mw, mh), createMask(mw, mh)];
      }
      if (!pointer.placed) {
        pointer.x = width / 2;
        pointer.y = height / 2;
      }
      wake();
    };

    const drawMask = (s, dt) => {
      const minimum = floatMask ? 0 : 1.5 / 255;
      gl.bindFramebuffer(gl.FRAMEBUFFER, masks[1].framebuffer);
      gl.viewport(0, 0, masks[1].width, masks[1].height);
      gl.useProgram(maskProgram);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, masks[0].texture);
      gl.uniform1i(maskUniforms.uPrevious, 0);
      gl.uniform2f(maskUniforms.uTexture, masks[1].width, masks[1].height);
      gl.uniform2f(maskUniforms.uView, state.width, state.height);
      gl.uniform2f(maskUniforms.uFrom, brush.px, brush.py);
      gl.uniform2f(maskUniforms.uTo, brush.x, brush.y);
      gl.uniform1f(maskUniforms.uRadius, s.revealRadius * (0.45 + 0.55 * state.presence));
      gl.uniform1f(maskUniforms.uSoftness, s.softness);
      gl.uniform1f(maskUniforms.uStrength, state.presence);
      gl.uniform1f(maskUniforms.uFade, Math.max(s.linger > 0 ? dt / s.linger : 1, minimum));
      gl.bindVertexArray(vao);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      masks.reverse();
    };

    const drawView = (s, now) => {
      const [fx, fy, fw, fh] = frameRect(s);
      const image = state.image;
      const intro = !image ? 0 : !s.intro || reduce ? 1 : Math.min(1, (now - state.introStart) / 1000 / INTRO_SECONDS);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(viewProgram);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, imageTexture);
      gl.uniform1i(viewUniforms.uImage, 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, masks[0].texture);
      gl.uniform1i(viewUniforms.uMask, 1);
      gl.uniform2f(viewUniforms.uResolution, canvas.width, canvas.height);
      gl.uniform2f(viewUniforms.uView, state.width, state.height);
      gl.uniform1f(viewUniforms.uDpr, canvas.width / state.width);
      gl.uniform4f(viewUniforms.uFrame, fx, fy, fw, fh);
      gl.uniform1f(viewUniforms.uTexels, image ? image.naturalWidth / fw : 1);
      gl.uniform1f(viewUniforms.uMode, s.mode);
      gl.uniform1f(viewUniforms.uShape, s.shape);
      gl.uniform1f(viewUniforms.uCell, s.cellSize);
      gl.uniform1f(viewUniforms.uAngle, (s.angle * Math.PI) / 180);
      gl.uniform1f(viewUniforms.uScale, s.dotScale);
      gl.uniform3fv(viewUniforms.uInk, toRgb(s.inkColor));
      gl.uniform3fv(viewUniforms.uAccent, toRgb(s.accentColor));
      gl.uniform3fv(viewUniforms.uPaper, toRgb(s.paperColor));
      gl.uniform1f(viewUniforms.uContrast, s.contrast);
      gl.uniform1f(viewUniforms.uBrightness, s.brightness);
      gl.uniform1f(viewUniforms.uInvert, s.invert ? 1 : 0);
      gl.uniform1f(viewUniforms.uRough, s.roughness);
      gl.uniform1f(viewUniforms.uShift, s.misregistration * s.cellSize * 0.35);
      gl.uniform3fv(viewUniforms.uMatte, state.matte);
      gl.uniform1f(viewUniforms.uKey, state.key);
      gl.uniform1f(viewUniforms.uReverse, s.reverse ? 1 : 0);
      gl.uniform1f(viewUniforms.uIntro, 1 - (1 - intro) * (1 - intro));
      gl.uniform4fv(viewUniforms.uBursts, burstData);
      gl.uniform1f(viewUniforms.uBurstWidth, Math.max(60, s.revealRadius * 0.9));
      gl.bindVertexArray(vao);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.bindVertexArray(null);
      return intro;
    };

    const frame = now => {
      raf = 0;
      if (!alive || !visible || document.hidden) return;
      const s = settingsRef.current;
      const dt = last ? Math.min(0.05, Math.max(0, (now - last) / 1000)) : 1 / 60;
      last = now;

      const wandering = s.wander && !reduce;
      let targetX = pointer.x;
      let targetY = pointer.y;
      if (!pointer.inside && wandering) {
        state.drift = Math.min(1, state.drift + dt / 1.2);
        const [wx, wy] = wanderAt(now / 1000, state.width, state.height);
        const k = state.drift * state.drift * (3 - 2 * state.drift);
        targetX += (wx - targetX) * k;
        targetY += (wy - targetY) * k;
      } else {
        state.drift = 0;
      }
      const engaged = pointer.inside || wandering;
      state.presence += ((engaged ? 1 : 0) - state.presence) * (1 - Math.exp(-dt / 0.16));
      if (pointer.fresh) {
        brush.x = brush.px = targetX;
        brush.y = brush.py = targetY;
        pointer.fresh = false;
      } else {
        const follow = 1 - Math.exp(-dt / 0.035);
        brush.x += (targetX - brush.x) * follow;
        brush.y += (targetY - brush.y) * follow;
      }

      burstData.fill(0);
      for (let i = bursts.length - 1; i >= 0; i--) {
        if ((now - bursts[i].start) / 1000 >= BURST_SECONDS) bursts.splice(i, 1);
      }
      bursts.forEach((b, i) => {
        const k = Math.max(0, (now - b.start) / 1000 / BURST_SECONDS);
        const reach = Math.hypot(Math.max(b.x, state.width - b.x), Math.max(b.y, state.height - b.y)) + 80;
        burstData[i * 4] = b.x;
        burstData[i * 4 + 1] = b.y;
        burstData[i * 4 + 2] = reach * Math.sin((k * Math.PI) / 2);
        burstData[i * 4 + 3] = 1 - k * k * k;
      });

      if (state.presence > 0.002) state.trailUntil = now + s.linger * 1000 + 200;
      drawMask(s, dt);
      brush.px = brush.x;
      brush.py = brush.y;
      const intro = drawView(s, now);

      const busy =
        engaged || state.presence > 0.002 || bursts.length > 0 || now < state.trailUntil || (state.image && intro < 1);
      if (busy) raf = requestAnimationFrame(frame);
      else last = 0;
    };

    const wake = () => {
      if (!raf && alive && visible && !document.hidden) raf = requestAnimationFrame(frame);
    };

    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.decoding = 'async';
    image.onload = () => {
      if (!alive) return;
      gl.bindTexture(gl.TEXTURE_2D, imageTexture);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      const sampler = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
      if (sampler) {
        try {
          const edge = measureEdge(sampler, image);
          state.matte = edge.matte;
          state.key = edge.plain ? 1 : 0;
        } catch {
          state.key = 0;
        }
      }
      state.image = image;
      state.introStart = performance.now();
      wake();
    };
    image.src = src;

    const locatePointer = event => {
      const rect = container.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.placed = true;
    };
    const onMove = event => {
      locatePointer(event);
      if (!pointer.inside) {
        pointer.inside = true;
        pointer.fresh = true;
      }
      wake();
    };
    const onLeave = () => {
      pointer.inside = false;
      wake();
    };
    const onDown = event => {
      onMove(event);
      if (!settingsRef.current.clickBurst || (event.pointerType === 'mouse' && event.button !== 0)) return;
      bursts.push({ x: pointer.x, y: pointer.y, start: performance.now() });
      if (bursts.length > MAX_BURSTS) bursts.shift();
    };
    const onVisibility = () => {
      last = 0;
      wake();
    };

    container.addEventListener('pointermove', onMove, { passive: true });
    container.addEventListener('pointerenter', onMove, { passive: true });
    container.addEventListener('pointerdown', onDown, { passive: true });
    container.addEventListener('pointerleave', onLeave, { passive: true });
    container.addEventListener('pointercancel', onLeave, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    const intersection = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      if (visible) {
        last = 0;
        wake();
      }
    });
    intersection.observe(container);
    resize();

    wakeRef.current = () => {
      if (!raf && alive && visible) {
        drawView(settingsRef.current, performance.now());
        wake();
      }
    };

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      wakeRef.current = null;
      image.onload = null;
      resizeObserver.disconnect();
      intersection.disconnect();
      container.removeEventListener('pointermove', onMove);
      container.removeEventListener('pointerenter', onMove);
      container.removeEventListener('pointerdown', onDown);
      container.removeEventListener('pointerleave', onLeave);
      container.removeEventListener('pointercancel', onLeave);
      document.removeEventListener('visibilitychange', onVisibility);
      masks.forEach(destroyMask);
      gl.deleteTexture(imageTexture);
      gl.deleteBuffer(buffer);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(maskProgram);
      gl.deleteProgram(viewProgram);
    };
  }, [src]);

  useEffect(() => {
    wakeRef.current?.();
  });

  return (
    <div ref={containerRef} className={`relative h-full w-full overflow-hidden${className ? ` ${className}` : ''}`} style={style}>
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" aria-hidden="true" />
    </div>
  );
};

export default HalftoneReveal;
