import { modal, $, esc } from '../engine/ui.js';
import { sfx, audioPrefs } from '../engine/audio.js';
import { music } from '../engine/music.js';
import { DEVELOPER, REFERENCES, AI_NOTE } from '../data/credits.js';

const pct = (v) => Math.round(v * 100) + '%';
// beri tahu tombol 🎵/🔊 di pojok agar ikut berubah
const notify = () => document.dispatchEvent(new CustomEvent('audiochange'));

/* ---------------- Pengaturan suara ---------------- */
export function settingsModal() {
  const row = (id, label, on, vol) => `
    <div class="vol-row">
      <label class="vol-toggle"><input type="checkbox" id="${id}-on" ${on ? 'checked' : ''}> ${label}</label>
      <input type="range" id="${id}-vol" min="0" max="200" step="5" value="${Math.round(vol * 100)}"
             aria-label="Volume ${label}" ${on ? '' : 'disabled'}>
      <output id="${id}-out" class="num">${pct(vol)}</output>
    </div>`;
  const m = modal(`
    <p class="eyebrow">Pengaturan</p>
    <h2>Suara</h2>
    ${row('mus', '🎵 Musik latar', music.isOn(), audioPrefs.musicVol)}
    ${row('sfx', '🔊 Efek suara', sfx.isOn(), audioPrefs.sfxVol)}
    <p class="small muted">100% = volume bawaan. Geser hingga 200% bila suara perangkat kurang keras.</p>
    <div class="actions">
      <button class="btn ghost sm" id="reset">Kembalikan 100%</button>
      <button class="btn" id="ok">Selesai</button>
    </div>`);
  const el = m.el;

  const bind = (id, eng, get) => {
    const on = $(`#${id}-on`, el), vol = $(`#${id}-vol`, el), out = $(`#${id}-out`, el);
    on.onchange = () => {
      if (on.checked !== eng.isOn()) { sfx.init(); music.unlock(); eng.toggle(); notify(); }
      vol.disabled = !on.checked;
    };
    vol.oninput = () => { const v = vol.value / 100; out.textContent = pct(v); eng.setVolume(v); };
    // dengar contoh saat slider dilepas
    vol.onchange = () => { if (eng === sfx) sfx.correct(); };
    return () => { vol.value = 100; vol.oninput(); };
  };
  const r1 = bind('mus', music), r2 = bind('sfx', sfx);
  $('#reset', el).onclick = () => { r1(); r2(); sfx.tap(); };
  $('#ok', el).onclick = () => { sfx.tap(); m.close(); };
}

/* ---------------- Profil pengembang ---------------- */
export function creditsModal() {
  const d = DEVELOPER;
  const m = modal(`
    <div class="dev-head">
      ${d.photo
        ? `<img class="dev-photo" src="${d.photo}" alt="Foto ${esc(d.name)}">`
        : `<span class="dev-photo" aria-hidden="true">${esc(d.initials)}</span>`}
      <p class="eyebrow">Profil Pengembang</p>
    </div>
    <table class="dev-table">
      ${d.rows.map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}
    </table>
    <h3 class="dev-h">Referensi</h3>
    <ol class="dev-refs">${REFERENCES.map((r) => `<li>${r}</li>`).join('')}</ol>
    <h3 class="dev-h">Keterangan Kecerdasan Artifisial</h3>
    <p class="dev-ai">${AI_NOTE}</p>
    <div class="actions"><button class="btn" id="ok">Tutup</button></div>`, { wide: true });
  $('#ok', m.el).onclick = () => { sfx.tap(); m.close(); };
}
