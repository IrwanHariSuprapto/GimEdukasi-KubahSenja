import { CHAPTERS } from '../data/chapters.js';

const KEY = 'kubah-senja-v1';

/** Seluruh data yang disimpan di perangkat. */
export const S = {
  name: '',
  completed: {}, // chapterId -> { score, max, badge, time, wrong:[], date, reflect }
  runs: {}       // chapterId -> run yang sedang berjalan
};

export function load() {
  try {
    const d = JSON.parse(localStorage.getItem(KEY));
    if (d) Object.assign(S, d);
  } catch { /* abaikan data rusak */ }
}

export function persist() {
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { /* storage penuh/diblokir */ }
}

export function resetAll() {
  try { localStorage.removeItem(KEY); } catch {}
  S.name = ''; S.completed = {}; S.runs = {};
}

function newRun(chapterId) {
  const n = CHAPTERS[chapterId].rooms.length;
  return {
    seed: (Math.random() * 2 ** 32) >>> 0,
    // kode brankas diacak per run (bukan kode tetap yang bisa dibagikan antarsiswa)
    code: Array.from({ length: n }, () => Math.floor(Math.random() * 10)),
    done: Array(n).fill(false),
    stars: Array(n).fill(0),
    wrong: Array(n).fill(0),
    time: 0,
    vault: null,
    startedAt: Date.now()
  };
}

export function getRun(chapterId) {
  if (!S.runs[chapterId]) { S.runs[chapterId] = newRun(chapterId); persist(); }
  return S.runs[chapterId];
}

export function clearRun(chapterId) {
  delete S.runs[chapterId];
  persist();
}
