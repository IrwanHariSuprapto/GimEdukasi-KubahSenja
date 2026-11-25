/* RNG ber-seed: soal berparameter tetap sama saat pemain melanjutkan run yang sama,
   tetapi berbeda antar-run. */
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function makeRng(seed) {
  const r = mulberry32(seed >>> 0);
  const rng = {
    next: r,
    int: (a, b) => a + Math.floor(r() * (b - a + 1)),
    pick: (arr) => arr[Math.floor(r() * arr.length)],
    shuffle: (arr) => {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(r() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }
  };
  return rng;
}

export const fact = (n) => { let x = 1; for (let i = 2; i <= n; i++) x *= i; return x; };
export const nPr = (n, r) => { let x = 1; for (let i = 0; i < r; i++) x *= n - i; return x; };
export const nCr = (n, r) => nPr(n, r) / fact(r);

/** Pilihan ganda numerik: jawaban + pengecoh (miskonsepsi umum), diacak. */
export function numericMC(rng, ans, distractors) {
  const opts = [ans];
  for (const d of rng.shuffle(distractors)) {
    if (opts.length >= 4) break;
    if (Number.isInteger(d) && d > 0 && !opts.includes(d)) opts.push(d);
  }
  let k = 1;
  while (opts.length < 4) {
    const d = ans + k * rng.int(2, 5);
    if (!opts.includes(d)) opts.push(d);
    k++;
  }
  const sh = rng.shuffle(opts);
  return { opts: sh.map(String), ans: sh.indexOf(ans) };
}
