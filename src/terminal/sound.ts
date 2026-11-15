/** Synthesised CRT / keyboard sounds (Web Audio, no audio files). Off by default; `sound on` enables. */
const KEY = 'enesaks.sound';

let enabled = (() => { try { return localStorage.getItem(KEY) === '1'; } catch { return false; } })();
let ctx: AudioContext | null = null;
let hum: { stop: () => void } | null = null;

const audio = (): AudioContext | null => {
  if (!enabled) return null;
  try {
    if (!ctx) {
      const Ctor = window.AudioContext || (window as any).webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch { return null; }
};

const noise = (ac: AudioContext, seconds: number) => {
  const buf = ac.createBuffer(1, Math.max(1, Math.floor(ac.sampleRate * seconds)), ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length) ** 2;
  const src = ac.createBufferSource();
  src.buffer = buf;
  return src;
};

const tone = (freq: number, seconds: number, type: OscillatorType, gain: number, endFreq?: number) => {
  const ac = audio();
  if (!ac) return;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ac.currentTime);
  if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, ac.currentTime + seconds);
  g.gain.setValueAtTime(gain, ac.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + seconds);
  osc.connect(g).connect(ac.destination);
  osc.start();
  osc.stop(ac.currentTime + seconds);
};

const startHum = () => {
  const ac = audio();
  if (!ac || hum) return;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = 'sine';
  osc.frequency.value = 100;
  g.gain.setValueAtTime(0.0001, ac.currentTime);
  g.gain.linearRampToValueAtTime(0.012, ac.currentTime + 0.8);
  osc.connect(g).connect(ac.destination);
  osc.start();
  hum = { stop: () => { try { g.gain.linearRampToValueAtTime(0.0001, ac.currentTime + 0.15); osc.stop(ac.currentTime + 0.2); } catch { /* already stopped */ } } };
};
const stopHum = () => { hum?.stop(); hum = null; };

export const soundEnabled = () => enabled;

export const setSound = (on: boolean) => {
  enabled = on;
  try { localStorage.setItem(KEY, on ? '1' : '0'); } catch { /* storage unavailable */ }
  if (on) { startHum(); beep(); } else stopHum();
};

/** Mechanical key click. */
export const click = () => {
  const ac = audio();
  if (!ac) return;
  startHum();
  const src = noise(ac, 0.035);
  const filter = ac.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 1800 + Math.random() * 1800;
  const g = ac.createGain();
  g.gain.value = 0.16;
  src.connect(filter).connect(g).connect(ac.destination);
  src.start();
};

/** Terminal bell. */
export const beep = (freq = 880) => tone(freq, 0.09, 'square', 0.035);

/** Degauss thunk and rising whine when the tube powers on. */
export const powerOn = () => {
  tone(70, 0.35, 'sine', 0.22, 38);
  tone(180, 0.7, 'sawtooth', 0.02, 900);
  startHum();
};

/** Low thunk of the degauss coil. */
export const degauss = () => {
  tone(60, 0.7, 'sine', 0.25, 28);
  tone(120, 0.5, 'triangle', 0.03, 50);
};

export const powerOff = () => {
  tone(600, 0.4, 'sawtooth', 0.025, 60);
  stopHum();
};
