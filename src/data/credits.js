/* Profil pengembang, referensi, dan keterangan AI. Ubah di sini. */
import foto from '../assets/foto-pengembang.webp'; // sumber asli: art-source/foto-pengembang.png

export const DEVELOPER = {
  name: 'Irwan Hari Suprapto',
  initials: 'IHS',
  photo: foto, // isi null untuk menampilkan inisial
  rows: [
    ['Nama', 'Irwan Hari Suprapto'],
    ['Instansi', 'SMA Negeri 1 Toboali'],
    ['Mata Pelajaran', 'Matematika'],
    ['Surel', 'irwansuprapto59@guru.sma.belajar.id'],
    ['Tahun Pembuatan', '2026']
  ]
};

// Periksa kembali edisi/tahun buku sebelum dipublikasikan.
export const REFERENCES = [
  'Tohir, M., dkk. (2025). <i>Matematika untuk SMA/MA/SMK/MAK Kelas XII</i> (Edisi Revisi), Bab Kaidah Pencacahan. Jakarta: Kementerian Pendidikan Dasar dan Menengah Republik Indonesia. <i>(acuan utama materi)</i>',
  'Badan Standar, Kurikulum, dan Asesmen Pendidikan. (2024). <i>Keputusan Kepala BSKAP Nomor 032/H/KR/2024 tentang Capaian Pembelajaran pada PAUD, Jenjang Pendidikan Dasar, dan Jenjang Pendidikan Menengah pada Kurikulum Merdeka</i>. Jakarta: Kemendikbudristek.',
  'Rosen, K. H. (2019). <i>Discrete Mathematics and Its Applications</i> (8th ed.), Bab 6: Counting. New York: McGraw-Hill Education.'
];

export const AI_NOTE =
  'Kode program, bank soal, ilustrasi ruang (vektor SVG), serta musik dan efek suara disusun dengan bantuan asisten ' +
  'kecerdasan artifisial <b>Claude (Anthropic)</b> berdasarkan arahan pengembang. Ilustrasi tokoh Irwan, Harry, dan Suprapto ' +
  'disediakan oleh pengembang. Musik dan efek suara disintesis langsung dengan Web Audio API, tanpa rekaman. ' +
  'Foto pengembang adalah foto asli. Seluruh konten ditinjau dan menjadi tanggung jawab pengembang.';
