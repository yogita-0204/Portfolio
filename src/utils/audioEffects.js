// Procedural Web Audio API sound synthesizer
let audioCtx = null;
let ambientOsc = null;
let ambientGain = null;
let isAudioEnabled = false;

function getAudioContext() {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function setAudioEnabled(enabled) {
  isAudioEnabled = enabled;
  if (enabled) {
    getAudioContext();
  } else {
    stopAmbientDrone();
  }
  return isAudioEnabled;
}

export function getAudioState() {
  return isAudioEnabled;
}

export function playHoverSound() {
  if (!isAudioEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(620, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.015, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch {
    // Graceful fallback
  }
}

export function playClickSound() {
  if (!isAudioEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch {
    // Graceful fallback
  }
}

export function playSuccessSound() {
  if (!isAudioEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);

      gain.gain.setValueAtTime(0.03, ctx.currentTime + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.06 + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.06);
      osc.stop(ctx.currentTime + idx * 0.06 + 0.25);
    });
  } catch {
    // Graceful fallback
  }
}

export function playGlitchSound() {
  if (!isAudioEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.setValueAtTime(320, ctx.currentTime + 0.02);
    osc.frequency.setValueAtTime(90, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.02, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.07);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.07);
  } catch {
    // Graceful fallback
  }
}

export function toggleAmbientDrone() {
  const ctx = getAudioContext();
  if (!ctx) return false;

  if (ambientOsc) {
    stopAmbientDrone();
    return false;
  } else {
    try {
      ambientOsc = ctx.createOscillator();
      ambientGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      ambientOsc.type = 'sine';
      ambientOsc.frequency.setValueAtTime(55, ctx.currentTime); // Low A

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(180, ctx.currentTime);

      ambientGain.gain.setValueAtTime(0.001, ctx.currentTime);
      ambientGain.gain.exponentialRampToValueAtTime(0.015, ctx.currentTime + 2.0);

      ambientOsc.connect(filter);
      filter.connect(ambientGain);
      ambientGain.connect(ctx.destination);

      ambientOsc.start();
      return true;
    } catch {
      return false;
    }
  }
}

export function stopAmbientDrone() {
  if (ambientOsc && audioCtx) {
    try {
      ambientGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
      setTimeout(() => {
        if (ambientOsc) {
          ambientOsc.stop();
          ambientOsc.disconnect();
          ambientOsc = null;
        }
      }, 500);
    } catch {
      ambientOsc = null;
    }
  }
}
