import { render, modal, $, $$ } from '../engine/ui.js';
import { sfx } from '../engine/audio.js';
import { S, resetAll, getRun } from '../engine/state.js';
import { CHAPTERS, ORDER } from '../data/chapters.js';
import { GAME } from '../data/story.js';
import { mapScreen } from './map.js';
import { resultScreen } from './result.js';
import { startScreen } from './start.js';
import { scene } from '../art/scenes.js';
import { figure } from '../art/characters.js';
import { music } from '../engine/music.js';

export function homeScreen() {
  music.play('title');
  const cards = ORDER.map((id) => {
    const ch = CHAPTERS[id];
    const done = S.completed[id];
    const run = S.runs[id];
    const progress = run ? run.done.filter(Boolean).length : 0;
    const status = done
      ? `${done.badge.icon} ${done.badge.label} · ${done.score}/${done.max} ⭐`
      : run ? `▶ Lanjutkan · ${progress}/${ch.rooms.length} ruang` : 'Ketuk untuk masuk →';
    return `
      <button class="ccard ${done ? 'done' : ''}" data-id="${id}" style="--accent:${ch.accent}">
        <span class="ccard-art">${scene(ch.scene) || ch.art}<span class="ccard-fig">${figure(ch.hero.figure)}</span></span>
        <span class="ccard-role">${ch.hero.role}</span>
        <span class="ccard-name">${ch.hero.name}</span>
        <span class="ccard-place">${ch.place}</span>
        <span class="ccard-status">${status}</span>
      </button>`;
  }).join('');

  const anyDone = Object.keys(S.completed).length > 0;
  render(`
    <header class="topbar">
      <button class="brand" id="brand">🔭 <b>${GAME.title}</b></button>
      <div class="grow"></div>
      ${anyDone ? '<button class="btn sm ghost" id="hasil">📋 Hasil</button>' : ''}
      <button class="btn sm ghost danger" id="reset">↺ Reset</button>
    </header>
    <p class="eyebrow">Pilih misi</p>
    <div class="cards">${cards}</div>`);

  $$('.ccard').forEach((el) => {
    el.onclick = () => {
      sfx.tap();
      const id = el.dataset.id;
      if (S.runs[id] || S.completed[id]) { getRun(id); mapScreen(id); } else objectives(id);
    };
  });
  $('#brand').onclick = () => { sfx.tap(); startScreen(); };
  const h = $('#hasil'); if (h) h.onclick = () => { sfx.tap(); resultScreen(); };
  $('#reset').onclick = () => {
    sfx.tap();
    const m = modal(`
      <h2>Hapus semua progres?</h2>
      <p>Bintang, hasil, dan refleksi di perangkat ini akan dihapus dan tidak bisa dikembalikan.</p>
      <div class="actions"><button class="btn ghost" id="no">Batal</button><button class="btn danger" id="yes">Hapus</button></div>`);
    $('#no', m.el).onclick = () => m.close();
    $('#yes', m.el).onclick = () => { resetAll(); m.close(); homeScreen(); };
  };
}

function objectives(id) {
  const ch = CHAPTERS[id];
  const m = modal(`
    <p class="eyebrow">Tujuan Pembelajaran</p>
    <h2>${ch.hero.name} · ${ch.place}</h2>
    <div class="tp">🎯 ${GAME.objective}</div>
    <p class="eyebrow" style="margin-top:14px">Peta belajar</p>
    <ol class="list">${ch.rooms.map((r) => `<li><b>${r.title}</b> — ${r.conceptLabel}</li>`).join('')}</ol>
    <p class="small">Tiap ruang dikerjakan bertahap: <b>Pahami → Hitung → Simpulkan</b>. Setiap tahap yang benar tanpa salah bernilai ⭐.</p>
    <div class="actions"><button class="btn" id="go">Mulai Misi →</button></div>`, { wide: true });
  $('#go', m.el).onclick = () => { sfx.tap(); m.close(); getRun(id); mapScreen(id); };
}
