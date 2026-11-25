/* ---------- Misi 2: Harry · Kubah Bawah Laut (orisinal; kunci internal: 'nara') ----------
   Variasi dari misi 1: konsep sama, tetapi tipe interaksi per ruang diputar
   dan ada soal yang lebih menantang (berulang, komplemen "paling sedikit", blok bersebelahan). */
import { fact, nPr, nCr, numericMC } from '../../engine/rng.js';

const PK_BUCKETS = [
  { k: 'P', label: 'Permutasi', sub: 'urutan/peran penting' },
  { k: 'K', label: 'Kombinasi', sub: 'hanya memilih anggota' }
];

export const nara = {
  id: 'nara',
  art: '🤿',
  accent: '#3ad6c5',
  place: 'Kubah Bawah Laut',
  scene: 'nara-hero',
  music: 'sea',
  hero: { name: 'Harry', role: 'Navigator Muda', figure: 'harry' },
  value: 'Tetap tenang saat tertekan: pecah masalah besar menjadi tahap-tahap kecil, lalu selesaikan satu per satu.',
  reflection: [
    'Soal mana yang membuatmu paling lama berpikir? Apa yang akhirnya membantumu?',
    'Kapan kamu memakai cara "semua kemungkinan dikurangi yang tidak diinginkan"?',
    'Apa bedanya menghitung kode yang angkanya boleh berulang dan yang tidak boleh berulang?'
  ],
  rooms: [
    /* ---- Ruang 1: aturan penjumlahan & perkalian ---- */
    {
      art: '🧭',
      scene: 'nara-compass',
      title: 'Anjungan Navigasi',
      conceptLabel: 'Aturan penjumlahan & perkalian',
      brief: `<p>Listrik kubah padam. Untuk menyalakan anjungan, Harry harus menghitung rute dan kode cadangan.</p>
              <p><b>Pilih salah satu</b> → jumlahkan. <b>Tahap berurutan yang semuanya terjadi</b> → kalikan.</p>`,
      layers: [
        {
          kind: 'PAHAMI', type: 'classify',
          prompt: 'Kelompokkan setiap situasi: cukup <b>dijumlahkan</b> atau harus <b>dikalikan</b>?',
          buckets: [
            { k: 'J', label: 'Jumlahkan', sub: 'pilih salah satu kelompok' },
            { k: 'X', label: 'Kalikan', sub: 'semua tahap terjadi' }
          ],
          items: [
            { t: 'Memilih 1 pintu keluar: dari 3 pintu sisi kiri atau 2 pintu sisi kanan', k: 'J' },
            { t: 'Memilih 1 baju selam lalu 1 tabung oksigen', k: 'X' },
            { t: 'Makan siang: 1 menu ikan atau 1 menu sayur', k: 'J' },
            { t: 'Membuat label sampel: 1 huruf diikuti 1 angka', k: 'X' }
          ],
          hints: ['Cari kata "atau" dan "lalu/diikuti".', 'Jika memilih dari satu kelompok membatalkan kelompok lain → saling lepas.', 'Saling lepas → jumlahkan; bertahap → kalikan.'],
          why: 'Memilih <b>salah satu</b> dari kelompok yang saling lepas → <b>dijumlahkan</b>. Beberapa <b>tahap</b> yang semuanya dilakukan → <b>dikalikan</b>.'
        },
        (rng) => {
          const a = rng.int(2, 4), b = rng.int(2, 4), c = rng.int(2, 3), ans = a * b * c;
          return {
            kind: 'HITUNG', type: 'short',
            q: `Dari dok ke ruang mesin ada <b>${a} lorong</b>, dari ruang mesin ke palka ada <b>${b} tangga</b>, dan dari palka ke kapsul penyelamat ada <b>${c} pintu</b>. Berapa banyak rute dari dok ke kapsul?`,
            ans,
            hints: ['Rute harus melewati ketiga bagian secara berurutan.', 'Setiap pilihan lorong bisa digabung dengan setiap tangga, lalu setiap pintu.', `Kalikan: ${a} × ${b} × ${c}.`],
            why: `Tiga tahap berurutan → aturan perkalian: ${a} × ${b} × ${c} = <b>${ans}</b> rute.`
          };
        },
        (rng) => {
          const k = rng.int(4, 6), ans = k ** 3;
          return {
            kind: 'SIMPULKAN', type: 'mc',
            q: `Panel cadangan memakai kode <b>3 digit</b> dari angka 1–${k}, dan angka <b>boleh berulang</b> (misalnya 1-1-2). Ada berapa kode yang mungkin?`,
            ...numericMC(rng, ans, [nPr(k, 3), 3 * k, k * k, nCr(k, 3)]),
            hints: ['Hitung banyak pilihan untuk setiap digit.', `Karena boleh berulang, setiap digit selalu punya ${k} pilihan.`, `${k} × ${k} × ${k}.`],
            why: `Setiap digit punya ${k} pilihan karena angka boleh berulang: ${k} × ${k} × ${k} = <b>${ans}</b>. Jika <b>tidak boleh</b> berulang, hasilnya P(${k},3) = ${nPr(k, 3)}.`
          };
        }
      ]
    },

    /* ---- Ruang 2: faktorial ---- */
    {
      art: '📡',
      scene: 'nara-sonar',
      title: 'Ruang Sonar',
      conceptLabel: 'Faktorial',
      brief: `<p>Layar sonar menampilkan deretan simbol faktorial yang harus dipecahkan.</p>
              <p><code>n! = n × (n−1) × … × 1</code>, <code>0! = 1</code>, dan <code>n! = n × (n−1)!</code>.</p>`,
      layers: [
        {
          kind: 'PAHAMI', type: 'mc',
          q: 'Kubit ragu: "Mengapa <b>0! = 1</b>, bukan 0?" Penjelasan yang paling tepat adalah…',
          opts: [
            'Ada tepat satu cara menyusun nol benda, dan rumus n! = n × (n−1)! tetap berlaku untuk n = 1',
            'Karena 0 dikalikan bilangan apa pun hasilnya 1',
            'Hanya kesepakatan tanpa alasan matematis'
          ],
          ans: 0,
          hints: ['Coba gunakan rumus n! = n × (n−1)! untuk n = 1.', '1! = 1 × 0!. Agar 1! = 1, berapa nilai 0!?', 'Selain itu, "tidak menyusun apa pun" tetap dihitung sebagai satu cara.'],
          why: 'Dari 1! = 1 × 0! dan 1! = 1, diperoleh <b>0! = 1</b>. Secara makna, ada tepat <b>satu</b> cara menyusun nol benda.'
        },
        (rng) => {
          const used = new Set(), pairs = [];
          let guard = 0;
          while (pairs.length < 4 && guard++ < 200) {
            // selisih 2–3 agar tidak terlalu mudah (a!/(a−1)! = a)
            const a = rng.int(4, 8), d = rng.int(2, 3), b = a - d;
            const v = fact(a) / fact(b);
            if (v > 720 || used.has(v)) continue;
            used.add(v); pairs.push([`${a}!/${b}!`, String(v)]);
          }
          return {
            kind: 'HITUNG', type: 'match',
            prompt: 'Jodohkan setiap pecahan faktorial dengan nilainya — tanpa menghitung n! seluruhnya!',
            pairs,
            hints: ['Faktor-faktor yang sama di pembilang dan penyebut saling coret.', '6!/4! = (6 × 5 × 4!)/4! = 6 × 5.', 'Hasilnya = perkalian bilangan menurun dari a sampai (b+1).'],
            why: 'a!/b! = a × (a−1) × … × (b+1), karena b! di pembilang dan penyebut saling menghapus. Contoh: 7!/5! = 7 × 6 = 42.'
          };
        },
        (rng) => {
          const n = rng.int(5, 7), ans = fact(n);
          return {
            kind: 'SIMPULKAN', type: 'mc',
            q: `Harry harus menata <b>${n} tabung sampel berbeda</b> dalam satu baris di rak sonar. Ada berapa susunan?`,
            ...numericMC(rng, ans, [n * n, n * (n - 1), fact(n - 1), ans / 2]),
            hints: ['Posisi pertama punya n pilihan, posisi kedua n−1, dan seterusnya.', 'Itulah definisi faktorial.', `${n}! = ${Array.from({ length: n }, (_, i) => n - i).join(' × ')}.`],
            why: `Menyusun ${n} benda berbeda dalam satu baris = ${n}! = <b>${ans}</b> cara.`
          };
        }
      ]
    },

    /* ---- Ruang 3: permutasi ---- */
    {
      art: '⚓',
      scene: 'nara-helm',
      title: 'Ruang Kemudi',
      conceptLabel: 'Permutasi (termasuk unsur sama)',
      brief: `<p>Kemudi terkunci kode berurutan. <b>Permutasi</b>: <code>P(n,r) = n!/(n−r)!</code>.</p>
              <p>Unsur sama: <code>n!/(k₁!·k₂!·…)</code>.</p>`,
      layers: [
        (rng) => {
          const n = rng.int(6, 9);
          return {
            kind: 'PAHAMI', type: 'mc',
            q: `Kode kemudi terdiri atas <b>3 digit</b> dari angka 1–${n}, dan angka <b>tidak boleh berulang</b>. Model hitung yang tepat adalah…`,
            opts: [`P(${n},3) = ${nPr(n, 3)}`, `C(${n},3) = ${nCr(n, 3)}`, `${n}³ = ${n ** 3}`],
            ans: 0,
            hints: ['Apakah kode 1-2-3 sama dengan 3-2-1?', 'Urutan penting, dan tidak ada pengulangan.', 'Urutan penting tanpa pengulangan → permutasi.'],
            why: `Urutan digit penting dan angka tidak berulang → <b>P(${n},3)</b> = ${n} × ${n - 1} × ${n - 2} = ${nPr(n, 3)}. (${n}³ untuk angka boleh berulang; C(${n},3) untuk tanpa urutan.)`
          };
        },
        (rng) => {
          const pairs = [], used = new Set();
          let guard = 0;
          while (pairs.length < 4 && guard++ < 300) {
            const n = rng.int(4, 9), r = rng.int(2, 3);
            const v = nPr(n, r);
            if (v > 504 || used.has(v)) continue;
            used.add(v); pairs.push([`P(${n},${r})`, String(v)]);
          }
          return {
            kind: 'HITUNG', type: 'flip',
            prompt: 'Panel kemudi menampilkan kartu tertutup. Cocokkan setiap permutasi dengan nilainya.',
            pairs,
            hints: ['P(n,r) = perkalian r bilangan menurun mulai dari n.', 'P(7,2) = 7 × 6 = 42.', 'P(6,3) = 6 × 5 × 4 = 120.'],
            why: 'P(n,r) = n × (n−1) × … sebanyak r faktor.'
          };
        },
        {
          kind: 'SIMPULKAN', type: 'mc',
          q: 'Nama kapal riset ini adalah <b>KAPAL</b>. Berapa banyak susunan huruf berbeda dari kata tersebut?',
          opts: [
            '5!/2! = 60, karena huruf A muncul dua kali',
            '5! = 120, karena semua huruf dianggap berbeda',
            '5!/(2!·2!) = 30, karena huruf K dan L sama-sama di ujung'
          ],
          ans: 0,
          hints: ['Hitung berapa kali setiap huruf muncul.', 'K: 1, A: 2, P: 1, L: 1.', 'Hanya huruf A yang berulang → bagi dengan 2!.'],
          why: 'Huruf A muncul dua kali, sehingga 5!/2! = 120/2 = <b>60</b> susunan. Posisi K dan L tidak memengaruhi pembagi.'
        }
      ]
    },

    /* ---- Ruang 4: kombinasi ---- */
    {
      art: '🧪',
      scene: 'nara-coral',
      title: 'Laboratorium Karang',
      conceptLabel: 'Kombinasi & "paling sedikit"',
      brief: `<p><b>Kombinasi</b>: <code>C(n,r) = n!/(r!(n−r)!)</code> — urutan tidak diperhatikan.</p>
              <p>Untuk syarat <b>"paling sedikit satu"</b>, sering lebih mudah: <i>semua kemungkinan − yang tidak memenuhi</i>.</p>`,
      layers: [
        {
          kind: 'PAHAMI', type: 'classify',
          prompt: 'Ketuk kartu, lalu ketuk wadahnya. Apakah urutan/peran diperhatikan?',
          buckets: PK_BUCKETS,
          items: [
            { t: 'Memilih 3 penyelam untuk survei terumbu karang', k: 'K' },
            { t: 'Menentukan urutan 4 penyelam turun ke air', k: 'P' },
            { t: 'Memilih 2 dari 6 sampel air untuk diuji', k: 'K' },
            { t: 'Menetapkan pilot, kopilot, dan navigator dari 5 kru', k: 'P' }
          ],
          hints: ['Jika dua orang ditukar, apakah hasilnya berbeda?', 'Pilot dan kopilot adalah peran yang berbeda.', 'Ada urutan/peran → permutasi; hanya kelompok → kombinasi.'],
          why: '<b>Urutan turun</b> dan <b>jabatan</b> membuat susunan berbeda → permutasi. <b>Memilih tim/sampel</b> saja → kombinasi.'
        },
        (rng) => {
          const n = rng.int(6, 9), r = rng.pick([2, 3]), ans = nCr(n, r);
          return {
            kind: 'HITUNG', type: 'mc',
            q: `Kamera bawah laut merekam <b>${n} spesies ikan</b>. Peneliti memilih <b>${r} spesies</b> untuk dipelajari lebih lanjut. Ada berapa pilihan?`,
            ...numericMC(rng, ans, [nPr(n, r), n * r, fact(r), nCr(n, r - 1)]),
            hints: ['Apakah urutan memilih spesies penting?', `Tidak → gunakan C(${n},${r}).`, `C(${n},${r}) = P(${n},${r}) ÷ ${r}! = ${nPr(n, r)} ÷ ${fact(r)}.`],
            why: `Urutan tidak penting → C(${n},${r}) = ${nPr(n, r)} ÷ ${fact(r)} = <b>${ans}</b>. (P(${n},${r}) = ${nPr(n, r)} adalah jebakan jika urutan dianggap penting.)`
          };
        },
        (rng) => {
          const a = rng.int(4, 6), b = rng.int(2, 4), total = nCr(a + b, 3), none = nCr(a, 3), ans = total - none;
          return {
            kind: 'SIMPULKAN', type: 'short',
            q: `Tim lab terdiri atas <b>3 orang</b> yang dipilih dari <b>${a} peneliti</b> dan <b>${b} teknisi</b>. Tim harus memuat <b>paling sedikit 1 teknisi</b>. Ada berapa cara?`,
            ans,
            hints: ['Hitung dulu semua tim tanpa syarat: C(' + (a + b) + ',3).', `Tim yang TIDAK memenuhi = tim tanpa teknisi = C(${a},3) = ${none}.`, `Kurangkan: ${total} − ${none}.`],
            why: `Semua tim: C(${a + b},3) = ${total}. Tim tanpa teknisi: C(${a},3) = ${none}. Jadi ${total} − ${none} = <b>${ans}</b> cara.`
          };
        }
      ]
    },

    /* ---- Ruang 5: penerapan ---- */
    {
      art: '🛟',
      scene: 'nara-hatch',
      title: 'Palka Darurat',
      conceptLabel: 'Penerapan (jabat tangan & blok)',
      brief: `<p>Kapsul penyelamat siap. Sebelum berangkat, seluruh kru berkumpul di palka.</p>
              <p>Tentukan modelnya dulu: pasangan tanpa urutan, susunan berurutan, atau susunan dengan syarat?</p>`,
      layers: [
        {
          kind: 'PAHAMI', type: 'mc',
          q: 'Setiap dua kru di palka saling berjabat tangan <b>tepat satu kali</b>. Model hitung yang tepat untuk banyak jabat tangan adalah…',
          opts: [
            'C(n,2) — pasangan dua orang tanpa urutan',
            'P(n,2) — pasangan dua orang berurutan',
            'n × n — setiap orang dengan setiap orang'
          ],
          ans: 0,
          hints: ['Apakah "A berjabat dengan B" berbeda dengan "B berjabat dengan A"?', 'Satu jabat tangan = satu pasangan orang.', 'Pasangan tanpa urutan → kombinasi C(n,2).'],
          why: 'Jabat tangan A–B sama dengan B–A, jadi yang dihitung adalah <b>pasangan tanpa urutan</b>: C(n,2). P(n,2) menghitung setiap pasangan dua kali; n × n bahkan menghitung orang yang berjabat dengan dirinya sendiri.'
        },
        (rng) => {
          const n = rng.int(7, 12), ans = nCr(n, 2);
          return {
            kind: 'HITUNG', type: 'short',
            q: `Ada <b>${n} kru</b> di palka, dan setiap dua kru berjabat tangan tepat sekali. Berapa banyak jabat tangan seluruhnya?`,
            ans,
            hints: ['Gunakan C(n,2).', `C(${n},2) = ${n} × ${n - 1} ÷ 2.`, `${n * (n - 1)} ÷ 2.`],
            why: `C(${n},2) = ${n} × ${n - 1} ÷ 2 = <b>${ans}</b> jabat tangan.`
          };
        },
        (rng) => {
          const n = rng.int(5, 6), ans = 2 * fact(n - 1);
          return {
            kind: 'SIMPULKAN', type: 'mc',
            q: `<b>${n} kru</b> duduk berderet di kapsul. Harry dan kapten harus duduk <b>bersebelahan</b>. Ada berapa susunan duduk?`,
            ...numericMC(rng, ans, [fact(n), fact(n - 1), 2 * fact(n), 2 * fact(n - 2)]),
            hints: ['Anggap Harry + kapten sebagai satu "blok".', `Sekarang ada ${n - 1} unit yang disusun: (${n - 1})! cara.`, 'Di dalam blok, Harry dan kapten bisa bertukar tempat: × 2!.'],
            why: `Gabungkan Harry dan kapten menjadi satu blok → ${n - 1} unit: ${n - 1}! = ${fact(n - 1)}. Di dalam blok ada 2! = 2 urutan. Total 2 × ${fact(n - 1)} = <b>${ans}</b>.`
          };
        }
      ]
    }
  ]
};
