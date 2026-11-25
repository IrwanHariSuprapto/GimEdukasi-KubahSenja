/* Efek suara sintetis (Web Audio) — tanpa file audio.
   AudioContext dibagi dengan mesin musik (engine/music.js). */
const PREF_KEY = 'kubah-senja-audio';
// sfxVol/musicVol: 1 = 100%, maksimum 2 = 200%
const DEF = { sfx: true, music: true, sfxVol: 1, musicVol: 1 };
export const audioPrefs = (() => {
  try { return { ...DEF, ...JSON.parse(localStorage.getItem(PREF_KEY)) }; } catch { return { ...DEF }; }
})();
export function savePrefs() { try { localStorage.setItem(PREF_KEY, JSON.stringify(audioPrefs)); } catch {} }

let ctx = null, out = null;
let on = audioPrefs.sfx;

function init() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    // pembatas di ujung rantai: volume di atas 100% tetap tidak pecah (clipping)
    out = ctx.createDynamicsCompressor();
    out.threshold.value = -8; out.knee.value = 6; out.ratio.value = 12;
    out.attack.value = 0.003; out.release.value = 0.2;
    out.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}
export const getCtx = () => ctx;
export const getOut = () => out;

function tone(freq, dur, type = 'sine', vol = 0.15, when = 0) {
  if (!on || !ctx || audioPrefs.sfxVol <= 0) return;
  vol *= audioPrefs.sfxVol;
  const t = ctx.currentTime + when;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(out);
  o.start(t);
  o.stop(t + dur + 0.02);
}

export const sfx = {
  init,
  toggle() { on = !on; audioPrefs.sfx = on; savePrefs(); return on; },
  isOn: () => on,
  setVolume(v) { audioPrefs.sfxVol = v; savePrefs(); },
  tap: () => tone(500, 0.06, 'triangle', 0.1),
  flip: () => tone(700, 0.07, 'sine', 0.1),
  correct: () => { tone(587, 0.12); tone(880, 0.18, 'sine', 0.15, 0.09); },
  wrong: () => { tone(196, 0.2, 'square', 0.08); tone(147, 0.25, 'square', 0.08, 0.08); },
  hint: () => tone(1046, 0.1, 'sine', 0.08),
  unlock: () => [392, 523, 659].forEach((f, i) => tone(f, 0.16, 'triangle', 0.13, i * 0.08)),
  win: () => [523, 659, 784, 1046, 1318].forEach((f, i) => tone(f, 0.35, 'triangle', 0.13, i * 0.11))
};
