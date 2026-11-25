import { makeRng } from './rng.js';

export const VAULT_STARS = 3;

export function maxStars(chapter) {
  return chapter.rooms.reduce((a, r) => a + r.layers.length, 0) + VAULT_STARS;
}

export function badgeFor(score, max) {
  const p = score / max;
  if (p >= 0.88) return { id: 'emas', label: 'Emas', icon: '🥇', sub: 'Penguasaan luar biasa!' };
  if (p >= 0.65) return { id: 'perak', label: 'Perak', icon: '🥈', sub: 'Kerja bagus!' };
  return { id: 'perunggu', label: 'Perunggu', icon: '🥉', sub: 'Berhasil keluar!' };
}

/** Bangun lapis soal sebuah ruang. Lapis bisa berupa objek tetap atau fungsi (rng) => objek. */
export function buildLayers(chapter, roomIdx, seed) {
  const rng = makeRng(seed + roomIdx * 7919);
  return chapter.rooms[roomIdx].layers.map((l) => {
    const L = typeof l === 'function' ? l(rng) : structuredClone(l);
    // acak urutan opsi pilihan ganda agar jawaban tidak selalu di posisi yang sama
    if (L.type === 'mc' && !L.keepOrder) {
      const idx = rng.shuffle(L.opts.map((_, i) => i));
      L.opts = idx.map((i) => L.opts[i]);
      L.ans = idx.indexOf(L.ans);
    }
    return L;
  });
}

/** Kode hasil (FNV-1a). Hanya penanda ringkas — BUKAN pengaman; data tetap di sisi klien. */
export function resultCode(payload) {
  const s = JSON.stringify(payload);
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return 'KS-' + (h >>> 0).toString(36).toUpperCase().padStart(7, '0');
}
