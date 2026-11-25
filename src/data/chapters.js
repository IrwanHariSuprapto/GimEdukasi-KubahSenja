/* ============================================================
   DATA MISI (orisinal)
   Struktur lapis (tahap):
     { kind:'PAHAMI'|'HITUNG'|'SIMPULKAN', type:'mc'|'flip'|'match'|'classify'|'short',
       ...field khusus tipe, hints:[3 petunjuk berjenjang], why:'pembahasan' }
   Lapis boleh berupa FUNGSI (rng) => lapis, untuk soal berparameter (angka diacak per permainan).
   Tipe 'mc': opsi diacak otomatis (set keepOrder:true untuk menonaktifkan).
   ============================================================ */
import { fact, nPr, nCr, numericMC } from '../engine/rng.js';
import { nara } from './missions/nara.js';
import { sekar } from './missions/sekar.js';

const PK_BUCKETS = [
  { k: 'P', label: 'Permutasi', sub: 'urutan/posisi penting' },
  { k: 'K', label: 'Kombinasi', sub: 'hanya memilih anggota' }
];

/* ---------- Misi 1: Irwan · Observatorium (kunci internal: 'dara') ---------- */
const dara = {
  id: 'dara',
  art: '🔭',
  accent: '#f5b942',
  place: 'Observatorium Kubah Senja',
  scene: 'dara-hero',
  music: 'stars',
  hero: { name: 'Irwan', role: 'Pengamat Bintang', figure: 'irwan' },
  value: 'Setiap kesalahan adalah data baru — ilmuwan pun mencoba berkali-kali sebelum menemukan jawabannya.',
  reflection: [
    'Konsep mana yang paling menantang bagimu? Mengapa?',
    'Bagaimana kamu memutuskan apakah suatu masalah memakai permutasi atau kombinasi?',
    'Ceritakan satu contoh di kehidupanmu sehari-hari yang bisa dihitung dengan kaidah pencacahan.'
  ],
  rooms: [
    /* ---- Ruang 1: aturan penjumlahan & perkalian ---- */
    {
      art: '🔭',
      scene: 'dara-telescope',
      title: 'Ruang Teleskop',
      conceptLabel: 'Aturan penjumlahan & perkalian',
      brief: `<p><b>Aturan penjumlahan</b> — pilih <b>salah satu</b> dari kelompok yang saling lepas: <code>n₁ + n₂</code>.</p>
              <p><b>Aturan perkalian</b> — beberapa tahap yang <b>semuanya</b> terjadi: <code>n₁ × n₂</code>.</p>`,
      layers: [
        (rng) => {
          const a = rng.int(4, 7), b = rng.int(3, 6);
          return {
            kind: 'PAHAMI', type: 'mc',
            q: `Kubit hanya boleh memasang <b>satu</b> lensa: dari kotak kayu (<b>${a} lensa</b>) <b>atau</b> dari kotak logam (<b>${b} lensa</b>). Cara menghitung dan hasilnya adalah…`,
            opts: [
              `Aturan penjumlahan → ${a} + ${b} = ${a + b} cara`,
              `Aturan perkalian → ${a} × ${b} = ${a * b} cara`,
              `Permutasi → P(${a + b}, 2) = ${nPr(a + b, 2)} cara`
            ],
            ans: 0,
            hints: ['Perhatikan kata "atau" dan "hanya satu lensa".',
              'Memilih dari kotak kayu berarti tidak memilih dari kotak logam — saling lepas.',
              `Kejadian saling lepas dijumlahkan: ${a} + ${b}.`],
            why: `Hanya satu lensa dipilih dari dua kelompok yang saling lepas, jadi <b>dijumlahkan</b>: ${a} + ${b} = <b>${a + b}</b> cara.`
          };
        },
        (rng) => {
          const m = rng.int(3, 6), n = rng.int(3, 5), ans = m * n;
          return {
            kind: 'HITUNG', type: 'mc',
            q: `Untuk mengamati bulan, Irwan memilih <b>1 lensa okuler</b> dari ${m} jenis <b>dan</b> <b>1 filter warna</b> dari ${n} jenis. Ada berapa pasangan lensa–filter?`,
            ...numericMC(rng, ans, [m + n, m * (n + 1), (m + 1) * n, ans - 1, nPr(m + n, 2)]),
            hints: ['Lensa DAN filter keduanya dipakai — dua tahap.',
              'Setiap lensa bisa dipasangkan dengan setiap filter.',
              `Kalikan: ${m} × ${n}.`],
            why: `Dua tahap yang keduanya terjadi → <b>aturan perkalian</b>: ${m} × ${n} = <b>${ans}</b> pasangan.`
          };
        },
        {
          kind: 'SIMPULKAN', type: 'mc',
          q: 'Kata apa dalam soal yang biasanya menandakan kita harus <b>mengalikan</b>?',
          opts: [
            '"dan" / "lalu" — semua tahap harus dilalui',
            '"atau" — cukup salah satu',
            '"paling banyak" — ambil yang terbesar'
          ],
          ans: 0,
          hints: ['Ingat soal lensa DAN filter tadi.', 'Pada soal itu, kedua pilihan harus terjadi bersama.', 'Tahap berurutan yang semuanya terjadi → dikalikan.'],
          why: 'Kata <b>"dan"/"lalu"</b> menandakan tahap-tahap yang semuanya terjadi → <b>dikalikan</b>. Kata <b>"atau"</b> (pilih salah satu dari kelompok saling lepas) → <b>dijumlahkan</b>.'
        }
      ]
    },

    /* ---- Ruang 2: faktorial ---- */
    {
      art: '🗄️',
      scene: 'dara-cabinet',
      title: 'Lemari Lensa',
      conceptLabel: 'Faktorial',
      brief: `<p><b>Faktorial</b>: <code>n! = n × (n−1) × … × 2 × 1</code>, dengan <code>0! = 1</code>.</p>
              <p>Banyak cara menyusun <b>n benda berbeda</b> dalam satu baris adalah <code>n!</code>.</p>`,
      layers: [
        (rng) => {
          const ns = rng.shuffle([0, 2, 3, 4, 5, 6]).slice(0, 4).sort((a, b) => a - b);
          return {
            kind: 'HITUNG', type: 'flip',
            prompt: 'Lemari terkunci dengan kartu bergambar. Cocokkan tiap faktorial dengan nilainya.',
            pairs: ns.map((n) => [`${n}!`, String(fact(n))]),
            hints: ['n! = hasil kali bilangan bulat dari n turun sampai 1.', 'Contoh: 4! = 4 × 3 × 2 × 1 = 24.', 'Ingat: 0! didefinisikan sama dengan 1.'],
            why: `n! = n × (n−1) × … × 1. Contoh: ${ns[3]}! = ${fact(ns[3])}.`
          };
        },
        (rng) => {
          const n = rng.int(5, 7), prev = fact(n - 1), ans = fact(n);
          return {
            kind: 'SIMPULKAN', type: 'mc',
            q: `Kubit sudah tahu bahwa ${n - 1}! = <b>${prev}</b>. Tanpa menghitung ulang dari awal, berapakah ${n}!?`,
            ...numericMC(rng, ans, [prev + n, prev * (n - 1), prev * 2, prev + 1]),
            hints: ['Bandingkan definisi n! dan (n−1)!.', `${n}! = ${n} × (${n - 1} × … × 1).`, `Jadi ${n}! = ${n} × ${n - 1}!.`],
            why: `Karena <b>n! = n × (n−1)!</b>, maka ${n}! = ${n} × ${prev} = <b>${ans}</b>.`
          };
        }
      ]
    },

    /* ---- Ruang 3: permutasi ---- */
    {
      art: '✨',
      scene: 'dara-starmap',
      title: 'Peta Rasi Bintang',
      conceptLabel: 'Permutasi (termasuk unsur sama)',
      brief: `<p><b>Permutasi</b> — susunan yang <b>memperhatikan urutan</b>: <code>P(n,r) = n!/(n−r)!</code>.</p>
              <p>Jika ada unsur yang sama: <code>n!/(k₁!·k₂!·…)</code>.</p>`,
      layers: [
        {
          kind: 'PAHAMI', type: 'mc',
          q: 'Irwan memasang <b>3 lensa berbeda</b> di tabung teleskop, dari depan ke belakang. Menukar posisi lensa mengubah hasil pengamatan. Apakah urutan diperhatikan?',
          opts: ['Ya — ini permutasi', 'Tidak — ini kombinasi'],
          ans: 0, keepOrder: true,
          hints: ['Bayangkan susunan A-B-C dibandingkan C-B-A.', 'Soal menyebut menukar posisi mengubah hasil.', 'Jika urutan mengubah hasil → permutasi.'],
          why: 'Karena menukar posisi lensa menghasilkan susunan yang berbeda, <b>urutan diperhatikan</b> → permutasi.'
        },
        (rng) => {
          const items = [], used = new Set();
          let guard = 0;
          while (items.length < 4 && guard++ < 300) {
            const n = rng.int(4, 8), r = rng.int(2, 3);
            const v = nPr(n, r);
            if (v > 400 || used.has(v)) continue;
            used.add(v); items.push([`P(${n},${r})`, String(v)]);
          }
          return {
            kind: 'HITUNG', type: 'match',
            prompt: 'Panel peta rasi meminta kamu menjodohkan setiap permutasi dengan hasilnya.',
            pairs: items,
            hints: ['P(n,r) = n!/(n−r)!.', 'Cara cepat: kalikan r bilangan menurun mulai dari n.', 'Contoh: P(6,2) = 6 × 5 = 30.'],
            why: 'P(n,r) = n × (n−1) × … sebanyak r faktor. Misalnya P(5,3) = 5 × 4 × 3 = 60.'
          };
        },
        {
          kind: 'SIMPULKAN', type: 'mc',
          q: 'Kata <b>GALAKSI</b> punya 7 huruf, tetapi banyak susunan hurufnya hanya <b>2.520</b>, bukan 7! = 5.040. Mengapa?',
          opts: [
            'Huruf A muncul dua kali, jadi 7! dibagi 2!',
            'Huruf pertama harus tetap G',
            'Hanya 6 huruf yang boleh dipindah'
          ],
          ans: 0,
          hints: ['Cari huruf yang muncul lebih dari sekali.', 'Menukar kedua huruf A tidak menghasilkan kata yang berbeda.', 'Permutasi unsur sama: n!/k! = 7!/2!.'],
          why: 'Ada dua huruf A. Menukar keduanya tidak menghasilkan susunan baru, sehingga 7!/2! = 5.040/2 = <b>2.520</b>.'
        }
      ]
    },

    /* ---- Ruang 4: permutasi vs kombinasi ---- */
    {
      art: '☄️',
      scene: 'dara-meteor',
      title: 'Arsip Meteorit',
      conceptLabel: 'Kombinasi & beda dengan permutasi',
      brief: `<p><b>Kombinasi</b> — memilih anggota <b>tanpa memperhatikan urutan</b>: <code>C(n,r) = n!/(r!(n−r)!)</code>.</p>
              <p>Hubungannya: <code>C(n,r) = P(n,r) ÷ r!</code>.</p>`,
      layers: [
        {
          kind: 'PAHAMI', type: 'classify',
          prompt: 'Ketuk sebuah kartu, lalu ketuk wadah tujuannya. Kartu bisa dipindah sebelum diperiksa.',
          buckets: PK_BUCKETS,
          items: [
            { t: 'Menentukan juara 1, 2, dan 3 lomba foto langit malam', k: 'P' },
            { t: 'Memilih 3 sampel meteorit untuk dikirim ke lab', k: 'K' },
            { t: 'Menyusun kode pintu 4 digit berbeda', k: 'P' },
            { t: 'Memilih 2 teman untuk ikut kemah astronomi', k: 'K' },
            { t: 'Menetapkan ketua dan sekretaris klub astronomi', k: 'P' }
          ],
          hints: ['Tanyakan: kalau dua anggota ditukar, apakah hasilnya berbeda?', 'Juara 1 dan juara 2 jelas berbeda peran; sampel yang dikirim tidak punya peran.', 'Ada peran/posisi → permutasi. Hanya kelompok → kombinasi.'],
          why: 'Jika ada <b>peran, peringkat, atau posisi</b> → permutasi. Jika hanya <b>membentuk kelompok</b> → kombinasi.'
        },
        (rng) => {
          const n = rng.int(6, 9), r = 3, ans = nCr(n, r) * r;
          return {
            kind: 'HITUNG', type: 'short',
            q: `Dari <b>${n} meteorit</b> dipilih <b>${r}</b> untuk dipamerkan, lalu salah satunya ditetapkan sebagai <b>pusat pameran</b>. Ada berapa cara seluruhnya?`,
            ans,
            hints: ['Kerjakan dua tahap: memilih dulu, lalu menetapkan pusat pameran.', `Tahap 1 (tanpa urutan): C(${n},${r}) = ${nCr(n, r)}. Tahap 2: pilih 1 dari ${r}.`, `Kalikan: ${nCr(n, r)} × ${r}.`],
            why: `C(${n},${r}) = ${nCr(n, r)} cara memilih, lalu ${r} cara menetapkan pusat. Total ${nCr(n, r)} × ${r} = <b>${ans}</b>.`
          };
        },
        {
          kind: 'SIMPULKAN', type: 'mc',
          q: 'Memilih <b>2 dari 9</b> meteorit untuk diteliti ternyata sama banyaknya dengan memilih <b>7 dari 9</b>. Mengapa C(9,2) = C(9,7)?',
          opts: [
            'Setiap kali memilih 2 yang diteliti, otomatis 7 sisanya tidak diteliti',
            'Karena 2 + 7 = 9 selalu memberi hasil sama untuk semua rumus',
            'Kebetulan saja untuk angka 9'
          ],
          ans: 0,
          hints: ['Pikirkan meteorit yang TIDAK dipilih.', 'Menentukan siapa yang masuk sama dengan menentukan siapa yang keluar.', 'Secara umum C(n,r) = C(n, n−r).'],
          why: 'Memilih r benda sekaligus menentukan n−r benda yang tidak dipilih, sehingga <b>C(n,r) = C(n,n−r)</b>. Di sini C(9,2) = C(9,7) = 36.'
        }
      ]
    },

    /* ---- Ruang 5: penerapan ---- */
    {
      art: '🚪',
      scene: 'dara-domedoor',
      title: 'Pintu Kubah',
      conceptLabel: 'Penerapan (gabungan & siklis)',
      brief: `<p>Tentukan dulu: <b>apakah urutan diperhatikan?</b> Ya → permutasi, tidak → kombinasi.</p>
              <p>Pemilihan dari beberapa kelompok yang terjadi bersamaan → <b>kalikan</b>. Susunan melingkar → <code>(n−1)!</code>.</p>`,
      layers: [
        {
          kind: 'PAHAMI', type: 'mc',
          q: 'Tim jaga malam terdiri atas <b>2 dari 6 pengamat</b> dan <b>2 dari 5 teknisi</b> (tanpa urutan). Strategi yang tepat adalah…',
          opts: [
            'Hitung C(6,2) dan C(5,2), lalu kalikan',
            'Hitung C(6,2) dan C(5,2), lalu jumlahkan',
            'Gabungkan semua orang, lalu hitung C(11,4)'
          ],
          ans: 0,
          hints: ['Ada dua kelompok terpisah dengan kuota masing-masing.', 'Kedua pemilihan harus terjadi bersama.', 'Tahap yang semuanya terjadi → dikalikan. C(11,4) tidak menjaga kuota 2 + 2.'],
          why: 'Pilih dari tiap kelompok dengan kombinasi, lalu <b>kalikan</b> karena keduanya terjadi. C(11,4) salah karena bisa menghasilkan 4 pengamat tanpa teknisi.'
        },
        (rng) => {
          const a = rng.int(5, 7), b = rng.int(4, 6), x = 2, y = rng.pick([2, 3]);
          const ans = nCr(a, x) * nCr(b, y);
          return {
            kind: 'HITUNG', type: 'short',
            q: `Hitung banyak cara memilih <b>${x} dari ${a} pengamat</b> sekaligus <b>${y} dari ${b} teknisi</b> untuk tim jaga malam.`,
            ans,
            hints: ['Hitung kombinasi tiap kelompok.', `C(${a},${x}) = ${nCr(a, x)} dan C(${b},${y}) = ${nCr(b, y)}.`, `Kalikan: ${nCr(a, x)} × ${nCr(b, y)}.`],
            why: `C(${a},${x}) × C(${b},${y}) = ${nCr(a, x)} × ${nCr(b, y)} = <b>${ans}</b> cara.`
          };
        },
        (rng) => {
          const n = rng.int(5, 7), ans = fact(n - 1);
          return {
            kind: 'SIMPULKAN', type: 'mc',
            q: `Sebelum pintu terbuka, <b>${n} anggota tim</b> berdiskusi mengelilingi meja peta bintang yang <b>bundar</b>. Ada berapa susunan duduk yang berbeda?`,
            ...numericMC(rng, ans, [fact(n), fact(n) / 2, fact(n - 2), ans * 2]),
            hints: ['Pada meja bundar tidak ada kursi "pertama".', 'Memutar semua orang satu kursi menghasilkan susunan yang sama.', `Permutasi siklis: (n−1)! = ${n - 1}!.`],
            why: `Pada <b>permutasi siklis</b>, susunan yang hanya diputar dianggap sama, sehingga banyaknya (${n}−1)! = <b>${ans}</b>.`
          };
        }
      ]
    }
  ]
};

/* Misi lain disimpan di ./missions/<id>.js, lalu didaftarkan di CHAPTERS dan ORDER. */
export const CHAPTERS = { dara, nara, sekar };
export const ORDER = ['dara', 'nara', 'sekar'];
