/* Setiap widget: mount(el, layer, api)
   api.correct()      → tahap selesai
   api.wrong(msg?)    → jawaban salah (bintang tahap hilang, petunjuk terbuka)
   api.progress()     → umpan balik kecil (mis. satu pasangan cocok)

   Menambah tipe soal baru = buat file widget + daftarkan di sini. */
import { mc } from './mc.js';
import { flip } from './flip.js';
import { match } from './match.js';
import { classify } from './classify.js';
import { short } from './short.js';

export const WIDGETS = { mc, flip, match, classify, short };
