/* ---------- Misi 3: Suprapto · Kubah Rimba (orisinal; kunci internal: 'sekar') ----------
   Misi paling menantang: pengisian tempat bersyarat, persamaan faktorial,
   permutasi melingkar/terlarang, kombinasi bersyarat, dan pembagian kelompok. */
import { fact, nPr, nCr, numericMC } from '../../engine/rng.js';

/** banyak susunan huruf sebuah kata (memperhitungkan huruf kembar) */
function wordPerm(w) {
  const cnt = {};
  for (const c of w) cnt[c] = (cnt[c] || 0) + 1;
  return Object.values(cnt).reduce((acc, k) => acc / fact(k), fact(w.length));
}
const PLANT_WORDS = ['DAUN', 'AKAR', 'BIJI', 'BENIH', 'MAWAR', 'BATANG', 'KAKTUS', 'MELATI', 'TUNAS', 'PADI', 'LUMUT', 'ANGGREK'];

export const sekar = {
  id: 'sekar',
  art: '🌿',
  accent: '#ff7aa8',
  place: 'Kubah Rimba',
  scene: 'sekar-hero',
  music: 'forest',
  hero: { name: 'Suprapto', role: 'Ahli Botani Muda', figure: 'suprapto' },
  value: 'Seperti tanaman, pemahaman tumbuh perlahan. Kesabaran dan ketelitian adalah pupuknya.',
  reflection: [
    'Pada soal bersyarat, bagian mana yang kamu kerjakan lebih dulu? Mengapa?',
    'Kapan hasil perhitunganmu perlu dibagi agar tidak menghitung dua kali?',
    'Dari ketiga misi, konsep mana yang sekarang paling kamu kuasai, dan mana yang masih perlu dilatih?'
  ],
  rooms: [
    /* ---- Ruang 1: pengisian tempat bersyarat ---- */
    {
      scene: 'sekar-pots',
      art: '🪴',
      title: 'Rak Pot Bernomor',
      conceptLabel: 'Pengisian tempat bersyarat',
      brief: `<p>Setiap pot diberi label angka. Kunci rak meminta bilangan dengan <b>syarat tertentu</b>.</p>
              <p>Strategi: <b>isi dulu tempat yang bersyarat</b>, baru tempat lainnya, lalu kalikan.</p>`,
      layers: [
        {
          kind: 'PAHAMI', type: 'mc',
          q: 'Suprapto ingin menyusun bilangan <b>3 angka genap</b> dari angka 1–6 tanpa pengulangan. Tempat mana yang sebaiknya diisi <b>lebih dulu</b>?',
          opts: [
            'Angka satuan, karena hanya tempat itu yang punya syarat (harus genap)',
            'Angka ratusan, karena letaknya paling depan',
            'Bebas, urutan mengisi tidak pernah berpengaruh'
          ],
          ans: 0,
          hints: ['Syarat "genap" hanya ditentukan oleh satu tempat.', 'Bilangan genap ditentukan oleh angka terakhirnya.', 'Isi tempat bersyarat dulu agar pilihannya tidak "terpakai" oleh tempat lain.'],
          why: 'Genap ditentukan oleh <b>angka satuan</b>. Mengisi tempat bersyarat lebih dulu mencegah pilihan genap habis terpakai di tempat lain.'
        },
        (rng) => {
          const n = rng.int(5, 7), e = Math.floor(n / 2), ans = e * (n - 1) * (n - 2);
          const evens = Array.from({ length: e }, (_, i) => 2 * (i + 1)).join(', ');
          return {
            kind: 'HITUNG', type: 'short',
            q: `Dari angka <b>1–${n}</b> akan dibentuk bilangan <b>3 angka genap</b> tanpa pengulangan. Ada berapa bilangan?`,
            ans,
            hints: [`Satuan harus genap: ${evens} → ${e} pilihan.`, `Ratusan: angka sisa → ${n - 1} pilihan. Puluhan: ${n - 2} pilihan.`, `Kalikan: ${e} × ${n - 1} × ${n - 2}.`],
            why: `Satuan (genap) ${e} pilihan, ratusan ${n - 1}, puluhan ${n - 2}. Total ${e} × ${n - 1} × ${n - 2} = <b>${ans}</b>.`
          };
        },
        (rng) => {
          const n = rng.int(5, 7), first = n - 3, ans = first * (n - 1) * (n - 2);
          return {
            kind: 'SIMPULKAN', type: 'mc',
            q: `Dari angka <b>1–${n}</b> disusun bilangan 3 angka tanpa pengulangan yang <b>lebih dari 400</b>. Ada berapa bilangan?`,
            ...numericMC(rng, ans, [nPr(n, 3), (n - 3) * n * n, (n - 4) * (n - 1) * (n - 2), first * (n - 1)]),
            hints: ['Syaratnya ada pada angka ratusan.', `Ratusan harus 4–${n} → ${first} pilihan.`, `Lalu ${n - 1} × ${n - 2} untuk dua tempat sisanya.`],
            why: `Ratusan ∈ {4, …, ${n}} → ${first} pilihan, lalu ${n - 1} dan ${n - 2}. Total ${first} × ${n - 1} × ${n - 2} = <b>${ans}</b>.`
          };
        }
      ]
    },

    /* ---- Ruang 2: faktorial (sifat & persamaan) ---- */
    {
      scene: 'sekar-tree',
      art: '🌳',
      title: 'Pohon Cabang',
      conceptLabel: 'Sifat & persamaan faktorial',
      brief: `<p>Pohon ini bercabang seperti diagram faktorial: 1 batang → 2 cabang → 6 ranting → 24 daun…</p>
              <p><code>n! = n × (n−1)!</code> dan <code>n!/(n−r)! = n × (n−1) × … × (n−r+1)</code>.</p>`,
      layers: [
        {
          kind: 'PAHAMI', type: 'mc',
          q: 'Manakah pernyataan tentang faktorial yang <b>benar</b>?',
          opts: ['(n+1)! = (n+1) × n!', '(2n)! = 2 × n!', '(a+b)! = a! + b!'],
          ans: 0,
          hints: ['Coba dengan angka kecil, misalnya n = 3.', '(2·3)! = 720, sedangkan 2 × 3! = 12.', '4! = 4 × 3! — pola ini selalu berlaku.'],
          why: 'Menurut definisi, <b>(n+1)! = (n+1) × n!</b>. Dua pernyataan lain gagal untuk n = 3: 6! = 720 ≠ 12, dan (1+2)! = 6 ≠ 1! + 2! = 3.'
        },
        (rng) => {
          const ns = rng.shuffle([3, 4, 5, 6, 7]).slice(0, 4).sort((a, b) => a - b);
          return {
            kind: 'HITUNG', type: 'flip',
            prompt: 'Setiap kartu menyimpan persamaan atau penyelesaiannya. Cocokkan <b>n! = …</b> dengan nilai <b>n</b>.',
            pairs: ns.map((n) => [`n! = ${fact(n)}`, `n = ${n}`]),
            hints: ['Hitung faktorial berurutan: 3! = 6, 4! = 24, …', 'Setiap faktorial berikutnya = sebelumnya × n.', '5! = 120, 6! = 720, 7! = 5040.'],
            why: `Faktorial tumbuh sangat cepat: 3! = 6, 4! = 24, 5! = 120, 6! = 720, 7! = 5040.`
          };
        },
        (rng) => {
          const n = rng.int(6, 11), v = n * (n - 1);
          return {
            kind: 'SIMPULKAN', type: 'short',
            q: `Kubit menemukan catatan: <b>n! / (n−2)! = ${v}</b>. Berapakah nilai <b>n</b>?`,
            ans: n,
            hints: ['Sederhanakan dulu: n!/(n−2)! = n × (n−1).', `Cari dua bilangan berurutan yang hasil kalinya ${v}.`, `Coba bilangan di sekitar √${v} ≈ ${Math.round(Math.sqrt(v))}.`],
            why: `n!/(n−2)! = n(n−1) = ${v} = ${n} × ${n - 1}, jadi <b>n = ${n}</b>.`
          };
        }
      ]
    },

    /* ---- Ruang 3: permutasi lanjut ---- */
    {
      scene: 'sekar-ring',
      art: '🌸',
      title: 'Taman Melingkar',
      conceptLabel: 'Permutasi lanjut (siklis, huruf kembar, larangan)',
      brief: `<p>Taman bundar di tengah kubah ditata ulang setiap musim.</p>
              <p>Siklis <code>(n−1)!</code> · bisa dibalik (kalung) <code>(n−1)!/2</code> · unsur sama <code>n!/(k₁!·k₂!…)</code> · <b>tidak boleh bersebelahan</b>: semua − yang bersebelahan.</p>`,
      layers: [
        {
          kind: 'PAHAMI', type: 'mc',
          q: '<b>6 manik berbeda</b> dirangkai menjadi gelang. Karena gelang bisa <b>diputar dan dibalik</b>, banyak susunannya adalah…',
          opts: ['(6−1)!/2 = 60', '(6−1)! = 120', '6! = 720'],
          ans: 0,
          hints: ['Mulai dari susunan melingkar: (n−1)!.', 'Gelang yang dibalik terlihat sama dengan susunan cerminnya.', 'Setiap susunan terhitung dua kali → bagi 2.'],
          why: 'Melingkar memberi (n−1)! = 120. Karena gelang bisa dibalik, setiap susunan dan cerminnya dianggap sama → 120/2 = <b>60</b>.'
        },
        (rng) => {
          const pool = rng.shuffle(PLANT_WORDS), pairs = [], used = new Set();
          for (const w of pool) {
            const v = wordPerm(w);
            if (used.has(v)) continue;
            used.add(v); pairs.push([w, String(v)]);
            if (pairs.length === 4) break;
          }
          return {
            kind: 'HITUNG', type: 'match',
            prompt: 'Papan nama tanaman bisa disusun ulang. Jodohkan setiap kata dengan <b>banyak susunan hurufnya</b>.',
            pairs,
            hints: ['Hitung panjang kata (n) dan huruf yang muncul lebih dari sekali.', 'Banyak susunan = n! ÷ (k₁! · k₂! · …).', 'AKAR: 4 huruf, A dua kali → 4!/2! = 12.'],
            why: 'Gunakan <b>n!/(k₁!·k₂!·…)</b>. Contoh: KAKTUS = 6 huruf, K dua kali → 6!/2! = 360; MELATI tanpa huruf kembar → 6! = 720.'
          };
        },
        (rng) => {
          const n = rng.int(5, 6), ans = fact(n) - 2 * fact(n - 1);
          return {
            kind: 'SIMPULKAN', type: 'mc',
            q: `<b>${n} pot bunga berbeda</b> diletakkan berjajar. Pot kaktus dan pot anggrek <b>tidak boleh bersebelahan</b>. Ada berapa susunan?`,
            ...numericMC(rng, ans, [fact(n), 2 * fact(n - 1), fact(n) - fact(n - 1), fact(n - 1)]),
            hints: [`Hitung semua susunan dulu: ${n}! = ${fact(n)}.`, `Susunan yang bersebelahan: anggap satu blok → 2 × ${n - 1}! = ${2 * fact(n - 1)}.`, `Kurangkan: ${fact(n)} − ${2 * fact(n - 1)}.`],
            why: `Semua susunan ${n}! = ${fact(n)}, yang bersebelahan 2 × ${n - 1}! = ${2 * fact(n - 1)}. Jadi ${fact(n)} − ${2 * fact(n - 1)} = <b>${ans}</b>.`
          };
        }
      ]
    },

    /* ---- Ruang 4: kombinasi bersyarat ---- */
    {
      scene: 'sekar-seeds',
      art: '🫘',
      title: 'Lumbung Benih',
      conceptLabel: 'Kombinasi bersyarat',
      brief: `<p>Toples-toples benih berwarna harus dipilih dengan aturan tertentu.</p>
              <p>Satu kelompok → <code>C(n,r)</code>. Beberapa kelompok dengan kuota → <code>C(a,x) × C(b,y)</code>.</p>`,
      layers: [
        {
          kind: 'PAHAMI', type: 'classify',
          prompt: 'Kelompokkan setiap situasi menurut <b>model hitungnya</b>.',
          buckets: [
            { k: 'S', label: 'C(n,r)', sub: 'satu kelompok' },
            { k: 'M', label: 'C(a,x) × C(b,y)', sub: 'beberapa kelompok, ada kuota' }
          ],
          items: [
            { t: 'Mengambil 3 benih dari toples berisi 10 benih', k: 'S' },
            { t: 'Mengambil 2 benih merah dari 5 dan 1 benih kuning dari 4', k: 'M' },
            { t: 'Memilih 4 tanaman dari 9 untuk dipindah ke pot besar', k: 'S' },
            { t: 'Tim: 2 ahli tanah dari 6 dan 2 ahli serangga dari 5', k: 'M' }
          ],
          hints: ['Apakah ada beberapa jenis/kelompok dengan jumlah yang ditentukan?', 'Kuota per kelompok → pilih dari tiap kelompok terpisah.', 'Pilihan tiap kelompok terjadi bersama → kalikan.'],
          why: 'Jika anggota dipilih dari <b>satu</b> kelompok → C(n,r). Jika ada <b>kuota per kelompok</b> → hitung tiap kelompok lalu <b>kalikan</b>.'
        },
        (rng) => {
          const a = rng.int(4, 6), b = rng.int(3, 5), ans = nCr(a, 2) * b;
          return {
            kind: 'HITUNG', type: 'mc',
            q: `Toples berisi <b>${a} benih merah</b> dan <b>${b} benih kuning</b>. Suprapto mengambil 3 benih dengan syarat <b>tepat 2 merah</b>. Ada berapa cara?`,
            ...numericMC(rng, ans, [nCr(a + b, 3), nCr(a, 2) + b, nCr(a, 3), nPr(a, 2) * b]),
            hints: ['"Tepat 2 merah" berarti benih ketiga harus kuning.', `Merah: C(${a},2) = ${nCr(a, 2)}. Kuning: C(${b},1) = ${b}.`, `Kalikan: ${nCr(a, 2)} × ${b}.`],
            why: `C(${a},2) × C(${b},1) = ${nCr(a, 2)} × ${b} = <b>${ans}</b>. C(${a + b},3) = ${nCr(a + b, 3)} salah karena tidak menjaga syarat tepat 2 merah.`
          };
        },
        (rng) => {
          const n = rng.int(6, 10), ans = nCr(n, 2) - n;
          return {
            kind: 'SIMPULKAN', type: 'short',
            q: `Atap lumbung berbentuk <b>segi-${n} beraturan</b>. Kabel penguat dipasang pada setiap <b>diagonal</b>. Berapa banyak kabel?`,
            ans,
            hints: [`Setiap dua titik sudut membentuk ruas garis: C(${n},2) = ${nCr(n, 2)}.`, `Tetapi ${n} di antaranya adalah sisi, bukan diagonal.`, `${nCr(n, 2)} − ${n}.`],
            why: `Ruas garis antar-titik sudut: C(${n},2) = ${nCr(n, 2)}, dikurangi ${n} sisi → <b>${ans}</b> diagonal.`
          };
        }
      ]
    },

    /* ---- Ruang 5: penerapan akhir ---- */
    {
      scene: 'sekar-gate',
      art: '🚪',
      title: 'Gerbang Akar',
      conceptLabel: 'Penerapan (wajib dipilih & pembagian kelompok)',
      brief: `<p>Gerbang keluar dililit akar raksasa. Teka-teki terakhir menguji ketelitianmu.</p>
              <p>Unsur <b>wajib</b> → masukkan dulu, pilih sisanya. Kelompok <b>tanpa nama</b> → hati-hati menghitung dua kali.</p>`,
      layers: [
        {
          kind: 'PAHAMI', type: 'mc',
          q: 'Dari <b>10 tanaman</b> dipilih <b>4</b> untuk pameran, dan <b>2 tanaman langka wajib</b> ikut. Model yang tepat adalah…',
          opts: ['C(8,2) — 2 sudah pasti, pilih 2 lagi dari 8 sisanya', 'C(10,4) — pilih 4 dari 10', 'C(10,4) − C(8,4)'],
          ans: 0,
          hints: ['Tanaman wajib tidak perlu "dipilih" lagi.', 'Setelah 2 tanaman wajib masuk, berapa tempat tersisa dan berapa kandidat tersisa?', 'Sisa tempat 2, sisa kandidat 8.'],
          why: 'Dua tanaman wajib langsung masuk, sehingga tinggal memilih <b>2 dari 8</b>: C(8,2) = 28.'
        },
        (rng) => {
          const n = rng.int(9, 12), r = rng.int(4, 5), k = 2, ans = nCr(n - k, r - k);
          return {
            kind: 'HITUNG', type: 'short',
            q: `Dari <b>${n} anggota klub</b> dipilih <b>${r} orang</b> untuk ekspedisi. <b>Suprapto dan Kubit wajib ikut</b>. Ada berapa cara?`,
            ans,
            hints: ['Masukkan Suprapto dan Kubit lebih dulu.', `Tersisa ${r - k} tempat dari ${n - k} anggota lain.`, `Hitung C(${n - k},${r - k}).`],
            why: `Suprapto dan Kubit sudah pasti, jadi pilih ${r - k} dari ${n - k}: C(${n - k},${r - k}) = <b>${ans}</b>.`
          };
        },
        {
          kind: 'SIMPULKAN', type: 'mc',
          q: '<b>6 relawan</b> dibagi menjadi <b>dua kelompok berisi 3 orang</b>, dan kelompoknya <b>tidak diberi nama</b>. Ada berapa cara pembagian?',
          opts: ['10', '20', '720', '36'],
          ans: 0,
          hints: ['Memilih 3 orang untuk kelompok "pertama" memberi C(6,3) = 20.', 'Tetapi memilih {A,B,C} sama dengan memilih {D,E,F} — keduanya menghasilkan pembagian yang sama.', 'Setiap pembagian terhitung dua kali → bagi 2.'],
          why: 'C(6,3) = 20 menghitung setiap pembagian <b>dua kali</b> ({A,B,C}|{D,E,F} sama dengan {D,E,F}|{A,B,C}) karena kelompok tidak bernama. Jadi 20/2 = <b>10</b>.'
        }
      ]
    }
  ]
};
