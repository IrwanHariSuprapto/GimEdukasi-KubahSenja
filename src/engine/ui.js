/* Helper DOM kecil. Konten soal berasal dari data milik kita sendiri (boleh berisi <b>),
   sedangkan input pengguna SELALU lewat esc(). */
export const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export function render(html) {
  document.querySelectorAll('.overlay').forEach((o) => o.remove());
  const app = document.getElementById('app');
  app.innerHTML = `<div class="screen">${html}</div>`;
  window.scrollTo(0, 0);
  return app;
}

export function modal(inner, { wide = false } = {}) {
  const ov = document.createElement('div');
  ov.className = 'overlay';
  ov.innerHTML = `<div class="modal ${wide ? 'wide' : ''}" role="dialog" aria-modal="true">${inner}</div>`;
  document.body.appendChild(ov);
  const focusable = ov.querySelector('button, input, textarea');
  if (focusable) setTimeout(() => focusable.focus(), 30);
  return { el: ov, close: () => ov.remove() };
}

export function toast(ok, msg) {
  document.querySelectorAll('.toast').forEach((t) => t.remove());
  const t = document.createElement('div');
  t.className = 'toast ' + (ok ? 'ok' : 'no');
  t.setAttribute('role', 'status');
  t.innerHTML = `<span class="tico">${ok ? '✓' : '!'}</span><span>${msg}</span>`;
  document.body.appendChild(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 300); }, ok ? 1400 : 2200);
}

const CHEER = [
  'Belum tepat — baca lagi situasinya pelan-pelan.',
  'Hampir! Coba lihat petunjuk yang muncul.',
  'Salah itu bagian dari belajar. Coba lagi!',
  'Periksa lagi: apakah urutan diperhatikan?'
];
export const cheer = () => CHEER[Math.floor(Math.random() * CHEER.length)];

export function stars(n, max) {
  return Array.from({ length: max }, (_, i) => `<span class="star ${i < n ? '' : 'off'}">★</span>`).join('');
}

export function fmtTime(sec) {
  return `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;
}
