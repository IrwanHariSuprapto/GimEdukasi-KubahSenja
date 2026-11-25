/* Teks umum gim (orisinal). Ubah di sini untuk mengganti judul/cerita. */
export const GAME = {
  id: 'kubah-senja',
  version: '0.1.0',
  title: 'Kubah Senja',
  subject: 'Petualangan Pecah Sandi · Kaidah Pencacahan',
  tagline: 'Saat senja, semua kubah di pusat riset terkunci sendiri. Pecahkan teka-teki di setiap ruang, kumpulkan digit kode, dan buka pintu keluar sebelum malam.',
  objective:
    'Setelah menuntaskan misi ini, kamu dapat <b>menggunakan aturan penjumlahan dan perkalian</b>, ' +
    '<b>menghitung faktorial, permutasi, dan kombinasi</b>, serta <b>memilih cara mencacah yang tepat</b> untuk masalah kontekstual.',
  howto: [
    '<b>Pilih misi</b>: Irwan (dasar), Harry (menengah), atau Suprapto (tantangan). Buka ruang di peta secara berurutan.',
    'Setiap ruang punya 2–3 tahap: <b>Pahami → Hitung → Simpulkan</b>.',
    'Jawab benar tanpa salah = ⭐. Salah? <b>Tidak ada game over</b>: petunjuk terbuka dan kamu boleh mencoba lagi.',
    'Setiap ruang yang terbuka memberi <b>1 digit kode</b>. Kode berbeda di tiap permainan, jadi catat milikmu!',
    'Masukkan semua digit di <b>brankas</b> pintu keluar. Tiap salah memasukkan kode mengurangi bintang brankas.',
    'Progres tersimpan otomatis di perangkat ini. Hasil bisa dicetak atau diunduh untuk guru.'
  ]
};

export const INTRO = [
  {
    art: '🤔',
    cast: ['kubit'],
    title: 'Berapa banyak kemungkinannya?',
    body: `<p>Menyusun kata sandi, memilih regu piket, menentukan juara lomba… semuanya soal <b>mencacah kemungkinan</b>.
           Tapi cara menghitungnya bisa berbeda-beda.</p>
           <p>Pertanyaan kuncinya: <b>apakah urutan diperhatikan?</b></p>`
  },
  {
    art: '🌇',
    cast: ['irwan', 'harry', 'suprapto', 'kubit'],
    title: 'Kubah-kubah yang terkunci',
    body: `<p>Pusat riset <b>Kubah Senja</b> punya tiga kubah: observatorium di puncak bukit, laboratorium di dasar teluk, dan rumah kaca di tepi hutan.
           Sore itu sistem keamanannya aktif sendiri: semua pintu terkunci dan setiap ruang meminta teka-teki dipecahkan.</p>
           <p>🔭 <b>Irwan</b> terjebak di observatorium, 🤿 <b>Harry</b> di kubah bawah laut, dan 🌿 <b>Suprapto</b> di Kubah Rimba.
              Untungnya, robot pemandu <b>Kubit</b> terhubung ke ketiga kubah dan siap memberi petunjuk.</p>
           <p class="small">Saran urutan: Irwan (dasar) → Harry (menengah) → Suprapto (tantangan).</p>`
  },
  {
    art: '🗝️',
    cast: ['irwan', 'kubit', 'harry', 'suprapto'],
    title: 'Cara keluar',
    body: `<p>Setiap kubah punya <b>5 ruang</b>. Setiap ruang yang terbuka menampilkan <b>satu digit kode</b>.
           Gabungkan kelima digit untuk membuka brankas di pintu keluar.</p>
           <div class="value">💚 Bukan soal cepat, tapi soal berpikir jernih dan tidak menyerah.</div>`
  }
];
