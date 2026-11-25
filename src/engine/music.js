/* ============================================================
   MUSIK LATAR (Web Audio, orisinal) — tanpa file audio.
   Empat tema: 'title' (layar awal & beranda), 'stars' (observatorium),
   'sea' (kubah bawah laut), 'forest' (Kubah Rimba).

   music.play(nama)  → ganti tema dengan crossfade (aman dipanggil berulang)
   music.unlock()    → dipanggil pada interaksi pertama (aturan autoplay browser)
   music.toggle()    → nyalakan/matikan; pilihan disimpan di perangkat
   music.duck(detik) → kecilkan sementara (mis. saat fanfare kemenangan)
   ============================================================ */
import { sfx, audioPrefs, savePrefs, getOut } from './audio.js';

const VOL = 0.32; // volume dasar (100%); pemain bisa mengubah 0–200% lewat menu ⚙️
const level = () => (audioPrefs.music ? VOL * audioPrefs.musicVol : 0);
const SEMI = { C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5, 'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11 };
const hz = (n) => {
  const m = /^([A-G][#b]?)(-?\d)$/.exec(n);
  return 440 * 2 ** (((+m[2] + 1) * 12 + SEMI[m[1]] - 69) / 12);
};
const chord = (s) => s.split(' ').map(hz);
const rnd = Math.random;

let ctx = null, bus = null, verb = null, noiseBuf = null;
let current = null, wanted = null, unlocked = false;

/* ---------------- infrastruktur ---------------- */
function setup() {
  ctx = sfx.init();
  if (!ctx || bus) return !!ctx;
  bus = ctx.createGain();
  bus.gain.value = level();
  bus.connect(getOut());

  // reverb sederhana: impuls derau yang meluruh
  verb = ctx.createConvolver();
  const len = Math.floor(ctx.sampleRate * 3);
  const ir = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = ir.getChannelData(c);
    for (let i = 0; i < len; i++) d[i] = (rnd() * 2 - 1) * (1 - i / len) ** 2.6;
  }
  verb.buffer = ir;
  verb.connect(bus);

  noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const nd = noiseBuf.getChannelData(0);
  for (let i = 0; i < nd.length; i++) nd[i] = rnd() * 2 - 1;

  setInterval(schedule, 50);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) ctx.suspend(); else if (unlocked) ctx.resume();
  });
  return true;
}

function env(g, t, peak, attack, hold, release) {
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(peak, t + attack);
  g.gain.setValueAtTime(peak, t + attack + hold);
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + hold + release);
  return t + attack + hold + release + 0.05;
}

/* ---------------- instrumen ---------------- */
function pad(T, freqs, t, dur, { type = 'triangle', cutoff = 1400, vol = 0.045, sweep = 0 } = {}) {
  const f = ctx.createBiquadFilter();
  f.type = 'lowpass'; f.frequency.setValueAtTime(cutoff, t); f.Q.value = 0.6;
  if (sweep) { f.frequency.linearRampToValueAtTime(cutoff + sweep, t + dur * 0.5); f.frequency.linearRampToValueAtTime(cutoff, t + dur); }
  const g = ctx.createGain();
  const end = env(g, t, vol, Math.min(0.9, dur * 0.3), dur * 0.5, 1.4);
  f.connect(g).connect(T.mix);
  freqs.forEach((fr) => [-7, 7].forEach((cents) => {
    const o = ctx.createOscillator();
    o.type = type; o.frequency.value = fr; o.detune.value = cents;
    o.connect(f); o.start(t); o.stop(end);
  }));
}

function bell(T, f, t, vol = 0.05, decay = 2.2) {
  [[1, 1], [2.76, 0.3], [5.4, 0.08]].forEach(([mul, amp]) => {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine'; o.frequency.value = f * mul;
    const end = env(g, t, vol * amp, 0.005, 0, decay / mul ** 0.5);
    o.connect(g).connect(T.mix); o.start(t); o.stop(end);
  });
}

function pluck(T, f, t, vol = 0.07, decay = 0.55) {   // bunyi seperti marimba kayu
  [[1, 'triangle', 1], [4, 'sine', 0.18]].forEach(([mul, type, amp]) => {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.value = f * mul;
    const end = env(g, t, vol * amp, 0.004, 0, mul > 1 ? decay * 0.25 : decay);
    o.connect(g).connect(T.mix); o.start(t); o.stop(end);
  });
}

function bass(T, f, t, dur, vol = 0.08) {
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = 'sine'; o.frequency.value = f;
  const end = env(g, t, vol, 0.03, dur * 0.6, dur * 0.5);
  o.connect(g).connect(T.mix); o.start(t); o.stop(end);
}

function noise(T, t, dur, { type = 'bandpass', freq = 500, q = 0.8, vol = 0.03, attack = dur * 0.45 } = {}) {
  const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
  s.buffer = noiseBuf; s.loop = true;
  f.type = type; f.frequency.value = freq; f.Q.value = q;
  const end = env(g, t, vol, attack, 0, Math.max(0.03, dur - attack));
  s.connect(f).connect(g).connect(T.mix); s.start(t); s.stop(end);
}

/* ---------------- TEMA ----------------
   tick(T, step, t, s): dipanggil tiap 1/8 ketukan; step = 0.. ; s = durasi satu langkah (detik). */
const bars8 = (step) => ({ bar: Math.floor(step / 8), pos: step % 8 });

const THEMES = {
  /* "Senja" — hangat & mengundang; D mayor */
  title: {
    bpm: 72, wet: 0.45,
    chords: ['D3 F#3 A3 C#4', 'B2 D3 F#3 A3', 'G2 B2 D3 F#3', 'A2 C#3 E3 G3'].map(chord),
    melody: [
      [[0, 'F#5'], [3, 'E5'], [6, 'D5']],
      [[0, 'D5'], [2, 'F#5'], [5, 'A5']],
      [[0, 'B4'], [3, 'D5'], [6, 'E5']],
      [[0, 'C#5'], [4, 'E5'], [6, 'A4']]
    ],
    tick(T, step, t, s) {
      const { bar, pos } = bars8(step), i = bar % 4, c = this.chords[i];
      if (pos === 0) { pad(T, c, t, s * 8); bass(T, c[0] / 2, t, s * 4); }
      if (pos === 4) bass(T, c[0] / 2, t, s * 4, 0.06);
      if (bar >= 4) {   // 4 birama pertama: hanya pad & bas sebagai intro
        for (const [p, n] of this.melody[i]) if (p === pos) bell(T, hz(n), t, 0.045);
      }
      if (pos % 2 === 1 && rnd() < 0.35) pluck(T, c[(pos >> 1) % c.length] * 2, t, 0.025, 0.4);
    }
  },

  /* "Peta Rasi" — melayang & berkilau; E minor */
  stars: {
    bpm: 66, wet: 0.6,
    chords: ['E3 G3 B3 F#4', 'C3 E3 G3 B3', 'G2 B2 D3 F#3', 'D3 F#3 A3 E4'].map(chord),
    arp: [0, 1, 2, 3, 2, 1, 2, 3],
    tick(T, step, t, s) {
      const { bar, pos } = bars8(step), c = this.chords[bar % 4];
      if (pos === 0) { pad(T, c, t, s * 8, { cutoff: 900, vol: 0.04 }); bass(T, c[0] / 2, t, s * 8, 0.07); }
      bell(T, c[this.arp[pos]] * 2, t, pos === 0 ? 0.03 : 0.018, 1.6);
      if (pos === 5 && rnd() < 0.4) bell(T, c[Math.floor(rnd() * 4)] * 4, t, 0.012, 3);  // kilau bintang
    }
  },

  /* "Arus Dalam" — tenang & dalam; D minor, ombak + ping sonar */
  sea: {
    bpm: 58, wet: 0.55,
    chords: ['D3 F3 A3 E4', 'Bb2 D3 F3 A3', 'F2 A2 C3 E3', 'C3 E3 G3 D4'].map(chord),
    tick(T, step, t, s) {
      const { bar, pos } = bars8(step), c = this.chords[bar % 4];
      if (pos === 0) {
        pad(T, c, t, s * 8, { type: 'sawtooth', cutoff: 420, sweep: 380, vol: 0.026 });
        bass(T, c[0] / 2, t, s * 8, 0.085);
        if (bar % 2 === 0) noise(T, t, s * 10, { freq: 380, q: 0.6, vol: 0.05 });   // ombak
      }
      if (pos === 4 && bar % 2 === 1) {                                              // ping sonar + gema
        bell(T, hz('A6'), t, 0.02, 2.6);
        bell(T, hz('A6'), t + s * 1.5, 0.008, 2.6);
      }
      if ((pos === 2 || pos === 6) && rnd() < 0.3) pluck(T, c[1 + (pos >> 2)] * 2, t, 0.018, 1.2);
    }
  },

  /* "Kebun Kaca" — ceria & ringan; G mayor pentatonik, marimba + shaker */
  forest: {
    bpm: 96, wet: 0.35,
    chords: ['G2 B2 D3', 'E2 G2 B2', 'C3 E3 G3', 'D3 F#3 A3'].map(chord),
    melody: [
      [[0, 'D5'], [2, 'B4'], [3, 'D5'], [5, 'E5'], [6, 'D5']],
      [[0, 'B4'], [2, 'G4'], [3, 'B4'], [5, 'D5'], [6, 'E5']],
      [[0, 'G5'], [2, 'E5'], [3, 'D5'], [5, 'E5'], [6, 'G5']],
      [[0, 'A5'], [2, 'D5'], [3, 'E5'], [5, 'A4'], [6, 'D5']]
    ],
    tick(T, step, t, s) {
      const { bar, pos } = bars8(step), i = bar % 4, c = this.chords[i];
      if (pos === 0) pad(T, c.map((f) => f * 2), t, s * 8, { cutoff: 1800, vol: 0.022 });
      if (pos === 0 || pos === 4) bass(T, c[0], t, s * 2.5, 0.075);
      if (pos === 6) bass(T, c[2], t, s * 1.5, 0.05);
      const phrase = bar % 8 < 4 ? this.melody[i] : this.melody[(i + 2) % 4];   // variasi tiap 4 birama
      for (const [p, n] of phrase) if (p === pos) pluck(T, hz(n), t, 0.06);
      if (pos % 2 === 1) noise(T, t, 0.06, { type: 'highpass', freq: 6500, q: 0.4, vol: 0.012, attack: 0.005 });
    }
  }
};

/* ---------------- penjadwal & kontrol ---------------- */
function schedule() {
  if (!current || !ctx || ctx.state !== 'running') return;
  if (!audioPrefs.music) { current.next = ctx.currentTime + 0.1; return; }
  if (current.next < ctx.currentTime - 0.5) current.next = ctx.currentTime + 0.05;   // setelah tab kembali aktif
  const s = 60 / current.def.bpm / 2;
  while (current.next < ctx.currentTime + 0.25) {
    current.def.tick(current, current.step, current.next, s);
    current.next += s;
    current.step++;
  }
}

function switchTo(name) {
  const now = ctx.currentTime;
  if (current) {
    const old = current;
    old.fade.gain.cancelScheduledValues(now);
    old.fade.gain.setValueAtTime(old.fade.gain.value, now);
    old.fade.gain.linearRampToValueAtTime(0.0001, now + 1.2);
    setTimeout(() => old.fade.disconnect(), 3500);
  }
  const def = THEMES[name];
  const T = { name, def, step: 0, next: now + 0.15, mix: ctx.createGain(), fade: ctx.createGain(), send: ctx.createGain() };
  T.fade.gain.setValueAtTime(0.0001, now);
  T.fade.gain.linearRampToValueAtTime(1, now + 1.6);
  T.send.gain.value = def.wet;
  T.mix.connect(T.fade);
  T.fade.connect(bus);
  T.fade.connect(T.send).connect(verb);
  current = T;
}

function ramp(sec) {
  if (!bus) return;
  const now = ctx.currentTime;
  bus.gain.cancelScheduledValues(now);
  bus.gain.setValueAtTime(bus.gain.value, now);
  bus.gain.linearRampToValueAtTime(level(), now + sec);
}

export const music = {
  play(name) {
    if (!THEMES[name]) return;
    wanted = name;
    if (!unlocked || (current && current.name === name)) return;
    switchTo(name);
  },
  unlock() {
    if (unlocked) return;
    if (!setup()) return;
    unlocked = true;
    if (wanted) switchTo(wanted);
  },
  toggle() {
    audioPrefs.music = !audioPrefs.music;
    savePrefs();
    ramp(0.6);
    return audioPrefs.music;
  },
  isOn: () => audioPrefs.music,
  /** v: 0–2 (1 = 100%) */
  setVolume(v) {
    audioPrefs.musicVol = v;
    savePrefs();
    ramp(0.15);
  },
  duck(sec = 3) {
    if (!bus || !audioPrefs.music) return;
    const now = ctx.currentTime, L = level();
    bus.gain.cancelScheduledValues(now);
    bus.gain.setValueAtTime(bus.gain.value, now);
    bus.gain.linearRampToValueAtTime(L * 0.25, now + 0.3);
    bus.gain.setValueAtTime(L * 0.25, now + sec);
    bus.gain.linearRampToValueAtTime(L, now + sec + 1.5);
  },
  get theme() { return current?.name || null; },
  THEMES: Object.keys(THEMES)
};
