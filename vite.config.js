import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// Hasil build = satu file dist/index.html (JS + CSS + aset ter-inline) agar bisa dipakai offline.
export default defineConfig({
  base: './',
  plugins: [viteSingleFile()],
  build: { assetsInlineLimit: 100_000_000 }
});
