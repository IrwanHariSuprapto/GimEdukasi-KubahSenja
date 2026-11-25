# Kubah Senja — Petualangan Pecah Sandi Kaidah Pencacahan

Gim edukasi **petualangan pecah sandi** (Matematika Fase F): aturan penjumlahan/perkalian, faktorial, permutasi, dan kombinasi.
Cerita, tokoh, dan soal **orisinal**; polanya terinspirasi dari analisis di `../ANALISIS-escape-room-permutasi-kombinasi.md`.

## Menjalankan

```powershell
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/index.html (satu file, offline, ±50 KB)
```

`dist/index.html` bisa dibuka langsung, diunggah ke LMS, atau di-embed lewat iframe.

## Struktur

```
src/
  main.js              entry
  styles.css           tema & semua gaya
  data/
    story.js           judul, cara bermain, slide pengantar
    chapters.js        misi → 5 ruang → tahap soal (bank soal)
  engine/
    state.js           progres + localStorage (kunci: kubah-senja-v1)
    rng.js             RNG ber-seed, fact/nPr/nCr, pembuat opsi pilihan ganda
    scoring.js         bintang, lencana, buildLayers, kode hasil
    audio.js           SFX sintetis (Web Audio)
    ui.js              render, modal, toast, esc
  screens/             start → home → map → room → vault → result
  widgets/             mc, flip, match, classify, short (+ index.js registri)
```

## Menambah konten

- **Soal baru**: edit `rooms[i].layers` di `src/data/chapters.js`. Lapis boleh berupa objek tetap atau
  fungsi `(rng) => lapis` untuk angka acak per permainan (seed tersimpan, jadi soal tetap sama saat dilanjutkan).
- **Misi/tokoh baru**: buat file di `src/data/missions/` (contoh: `nara.js`), lalu impor dan daftarkan di `CHAPTERS` dan `ORDER` pada `chapters.js`.

## Ilustrasi

Semua ilustrasi adalah SVG vektor buatan tangan di `src/art/scenes.js` (tanpa file gambar, tajam di layar mana pun).

- Lihat semuanya sekaligus: buka `http://localhost:5173/#galeri`.
- Setiap ruang/misi menunjuk adegan lewat field `scene` di data misi (mis. `scene: 'dara-telescope'`).
- Adegan ruang = latar bersama (`observatoryRoom` / `hullRoom`) + objek khas ruang. Untuk misi baru,
  tambahkan fungsi latar + objek, lalu daftarkan di bagian REGISTRI.
- Ingin memakai gambar raster (mis. hasil ilustrator)? Isi `sceneImage` di `scenes.js`:
  `{ 'dara-telescope': 'assets/teleskop.webp' }`. Adegan itu otomatis memakai gambar tersebut.

### Figur tokoh

**Ilustrasi utama Irwan, Harry, dan Suprapto** berasal dari gambar yang diberikan pemilik proyek
(`art-source/tokoh-sumber.jpg`). Gambar itu dipotong dan latar terangnya dihapus dengan `art-source/cutout.py`,
lalu hasilnya disimpan di `src/assets/tokoh/` (`<nama>.webp` untuk badan, `<nama>-ava.webp` untuk avatar wajah).
Untuk memperbarui, ganti gambar sumber, sesuaikan kotak potong `BOXES` di skrip, lalu jalankan:

```powershell
python -m pip install pillow numpy
python art-source/cutout.py art-source/tokoh-sumber.jpg src/assets/tokoh
```

Satu gambar dipakai untuk semua pose; pose `cheer` diberi animasi lompat lewat CSS.
Figur SVG (`figure(key, { svg: true })`) tetap tersedia sebagai cadangan.

`src/art/characters.js` berisi figur SVG tokoh utama **Irwan**, **Harry**, **Suprapto**, dan robot pemandu **Kubit**. Figur lama (Dara, Nara, Sekar) masih tersedia sebagai cadangan.

- Setiap misi menunjuk figurnya lewat `hero.figure` (mis. `hero: { name: 'Irwan', figure: 'irwan' }`). Ganti nilai itu untuk menukar tokoh.
- `figure(key, { pose })`, dengan pose `idle`, `cheer`, atau `hold` (Sekar memegang pot). `avatar(key)` menghasilkan potongan kepala untuk pill/tabel.
- `kubit({ mood })`, dengan mood `happy` atau `think`.
- Tokoh tampil di kartu misi, panel ruang (berdiri di sisi kanan adegan), gelembung bicara Kubit di peta,
  petunjuk (disampaikan Kubit), modal benar/menang (pose bersorak), dan slide pengantar.
- Objek adegan ruang sebaiknya tidak menempati ±25% sisi kanan, karena di situ tokoh berdiri.

## Musik latar

`src/engine/music.js`: musik orisinal yang disintesis langsung dengan Web Audio API (tanpa file audio), dengan pad, bel, marimba, bas, derau ombak, dan reverb.

| Tema | Dipakai di | Suasana |
|---|---|---|
| `title` | layar awal, pengantar, beranda | hangat, D mayor; melodi bel masuk setelah 4 birama |
| `stars` | misi Irwan | melayang & berkilau, E minor, arpeggio bel |
| `sea` | misi Harry | tenang & dalam, D minor, ombak + ping sonar |
| `forest` | misi Suprapto | ceria, G pentatonik, marimba + shaker |

- Misi memilih temanya lewat field `music` di data misi.
- Musik mulai setelah interaksi pertama (aturan autoplay browser) dan berganti dengan crossfade antarlayar.
- Tombol 🎵 (musik) dan 🔊 (efek suara) terpisah; pilihan disimpan di `localStorage` (`kubah-senja-audio`).
- Tombol ⚙️ membuka pengaturan suara: musik dan efek suara bisa diatur 0–200% (disimpan di perangkat). Pembatas (*compressor*) di ujung rantai mencegah suara pecah saat di atas 100%. Volume dasar (100%) = konstanta `VOL` di `music.js`. Musik otomatis mengecil saat fanfare kemenangan dan berhenti saat tab disembunyikan.

## Profil pengembang

Menu **Profil Pengembang** ada di layar awal. Data diri, referensi, dan keterangan kecerdasan artifisial disimpan di `src/data/credits.js`.
Foto pengembang ada di `src/assets/foto-pengembang.webp` (256×256, dipotong dari `art-source/foto-pengembang.png`).
Untuk mengganti foto, timpa file WebP itu. Isi `DEVELOPER.photo` dengan `null` bila ingin menampilkan inisial saja.

## Misi

Kunci internal misi tetap `dara` / `nara` / `sekar` (dipakai untuk penyimpanan dan nama adegan).

| Misi | Latar | Ciri khas |
|---|---|---|
| Irwan · Pengamat Bintang | Observatorium | Konsep dasar tiap materi |
| Harry · Navigator Muda | Kubah Bawah Laut | Menengah: kode berulang vs tidak, a!/b!, "paling sedikit satu" (komplemen), jabat tangan, susunan blok bersebelahan |
| Suprapto · Ahli Botani Muda | Kubah Rimba | Tantangan: pengisian tempat bersyarat (genap, > 400), persamaan faktorial, gelang (n−1)!/2, huruf kembar, "tidak boleh bersebelahan", tepat-k, diagonal segi-n, anggota wajib, pembagian kelompok tak bernama |
- **Tipe interaksi baru**: buat `src/widgets/nama.js` dengan `export function nama(el, layer, api)`,
  lalu daftarkan di `widgets/index.js`. Panggil `api.correct()`, `api.wrong(msg?)`, `api.progress()`.

## Perbedaan dari gim referensi

| Referensi | Versi ini |
|---|---|
| Soal tetap; jawaban pilihan ganda hampir selalu di opsi A | Soal berparameter + opsi diacak |
| Kode brankas sama untuk semua siswa | Kode acak per permainan |
| 11,6 MB (gambar base64) | ±50 KB (emoji/CSS; siap diganti ilustrasi WebP) |
| Hasil hanya via screenshot | Cetak + unduh JSON |
| Elemen `div` yang bisa diklik | Elemen `button`, navigasi keyboard, `prefers-reduced-motion` |

## Belum dikerjakan (ide lanjutan)

- Pengiriman hasil ke server/LMS (kode hasil saat ini bukan pengaman)
