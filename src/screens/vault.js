import { render, modal, toast, stars, $, $$, fmtTime } from '../engine/ui.js';
import { sfx } from '../engine/audio.js';
import { S, getRun, clearRun, persist } from '../engine/state.js';
import { maxStars, badgeFor, VAULT_STARS } from '../engine/scoring.js';
import { CHAPTERS } from '../data/chapters.js';
import { mapScreen } from './map.js';
import { homeScreen } from './home.js';
import { scene } from '../art/scenes.js';
import { figure, avatar, kubit } from '../art/characters.js';
import { music } from '../engine/music.js';

export function vaultScreen(id) {
  const ch = CHAPTERS[id];
  const run = getRun(id);
  const answer = run.code.join('');
  const len = answer.length;
  const t0 = Date.now();
  let entry = '', vStars = VAULT_STARS, wrong = 0, revealed = 0, locked = false;

  render(`
    <header class="topbar" style="--accent:${ch.accent}">
      <button class="btn sm ghost" id="back">← Peta</button>
      <span class="pill">${avatar(ch.hero.figure)} <b>${ch.hero.name}</b></span>
      <div class="grow"></div>
    </header>
    <div class="room" style="--accent:${ch.accent}">
      <aside class="panel brief">
        <p class="eyebrow">Ruang terakhir · Brankas</p>
        <div class="room-art">${scene('vault')}
          <span class="room-fig">${figure(ch.hero.figure)}</span>
          <span class="room-kubit">${kubit({ mood: 'think' })}</span>
        </div>
        <p>Masukkan <b>${len} digit</b> kode yang kamu kumpulkan dari Ruang 1–${len} <b>secara berurutan</b>, lalu tekan ✓.</p>
      </aside>
      <section class="panel vault">
        <div class="safe" id="safe" aria-label="Isian kode"></div>
        <div class="keypad" id="pad"></div>
        <div class="qbar center">
          <span id="vstars">${stars(vStars, VAULT_STARS)}</span>
          <button class="btn sm ghost" id="hintbtn">💡 Buka 1 digit</button>
        </div>
      </section>
    </div>`);

  const renderSafe = () => {
    $('#safe').innerHTML = Array.from({ length: len }, (_, i) => {
      const ghost = i >= entry.length && i < revealed ? `<span class="ghost">${answer[i]}</span>` : '';
      return `<span class="slot ${i < entry.length ? 'filled' : ''} ${i === entry.length ? 'active' : ''}">${entry[i] ?? ghost}</span>`;
    }).join('');
  };
  renderSafe();

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', '✓'];
  $('#pad').innerHTML = keys.map((k) =>
    `<button class="key ${k === '✓' ? 'ok' : ''}" data-k="${k}" aria-label="${k === '⌫' ? 'Hapus' : k === '✓' ? 'Periksa' : k}">${k}</button>`).join('');

  const press = (k) => {
    if (locked) return;
    if (k === '⌫') { entry = entry.slice(0, -1); sfx.tap(); }
    else if (k === '✓') return submit();
    else if (entry.length < len) { entry += k; sfx.flip(); }
    renderSafe();
  };
  $$('.key').forEach((b) => { b.onclick = () => press(b.dataset.k); });
  const onKey = (e) => {
    if (!document.getElementById('pad')) return document.removeEventListener('keydown', onKey);
    if (/^[0-9]$/.test(e.key)) press(e.key);
    else if (e.key === 'Backspace') press('⌫');
    else if (e.key === 'Enter') press('✓');
  };
  document.addEventListener('keydown', onKey);

  $('#hintbtn').onclick = () => {
    if (locked || revealed >= len) return;
    sfx.hint(); revealed++; renderSafe();
    if (revealed >= len) $('#hintbtn').disabled = true;
  };
  $('#back').onclick = () => { sfx.tap(); document.removeEventListener('keydown', onKey); mapScreen(id); };

  function submit() {
    if (entry.length < len) return toast(false, `Lengkapi ${len} digit dulu.`);
    if (entry === answer) {
      locked = true;
      document.removeEventListener('keydown', onKey);
      sfx.unlock();
      toast(true, 'Brankas terbuka!');
      run.vault = { stars: vStars, wrong };
      run.time += Math.round((Date.now() - t0) / 1000);
      setTimeout(() => finish(id), 600);
    } else {
      entry = ''; wrong++;
      vStars = Math.max(0, vStars - 1);
      $('#vstars').innerHTML = stars(vStars, VAULT_STARS);
      sfx.wrong();
      toast(false, 'Kode belum cocok — periksa catatanmu (urutan ruang 1 → 5).');
      const v = $('.vault'); v.classList.add('shake'); setTimeout(() => v.classList.remove('shake'), 450);
      renderSafe();
    }
  }
}

function finish(id) {
  const ch = CHAPTERS[id];
  const run = S.runs[id];
  const score = run.stars.reduce((a, b) => a + b, 0) + run.vault.stars;
  const max = maxStars(ch);
  const badge = badgeFor(score, max);
  const wrongRooms = ch.rooms
    .map((r, i) => ({ label: r.conceptLabel, n: run.wrong[i] }))
    .filter((x) => x.n > 0);

  S.completed[id] = {
    score, max, badge, time: run.time,
    wrong: run.wrong, vaultWrong: run.vault.wrong,
    date: new Date().toISOString(), reflect: S.completed[id]?.reflect || null
  };
  clearRun(id);
  sfx.win();
  music.duck(4);

  const m = modal(`
    <div class="modal-cast win">${figure(ch.hero.figure, { pose: 'cheer' })}<span class="medal">${badge.icon}</span>${kubit()}</div>
    <p class="eyebrow">Lencana ${badge.label}</p>
    <h2>${ch.hero.name} berhasil keluar! 🔓</h2>
    <p>${badge.sub}</p>
    <div class="scoreline">
      <div><b class="num">${score}/${max}</b><span>Bintang</span></div>
      <div><b class="num">${fmtTime(run.time)}</b><span>Waktu</span></div>
    </div>
    ${wrongRooms.length
      ? `<div class="recap"><b>Konsep untuk diulang:</b> ${wrongRooms.map((w) => `${w.label} (${w.n}×)`).join(', ')}</div>`
      : '<div class="recap ok">✓ Tanpa kesalahan — mantap!</div>'}
    <div class="actions"><button class="btn" id="next">Refleksi →</button></div>`);
  $('#next', m.el).onclick = () => { sfx.tap(); m.close(); reflect(id); };
}

function reflect(id) {
  const ch = CHAPTERS[id];
  const m = modal(`
    <div class="value">💚 ${ch.value}</div>
    <p class="eyebrow">Refleksi</p>
    <h2>Sejenak, pikirkan kembali 🤔</h2>
    ${ch.reflection.map((q, i) => `
      <label class="rf-q" for="rf${i}">${i + 1}. ${q}</label>
      <textarea class="input" id="rf${i}" rows="2" maxlength="400"></textarea>`).join('')}
    <div class="actions"><button class="btn" id="save">Simpan & Kembali →</button></div>
    <p class="small center">Jawaban hanya tersimpan di perangkat ini.</p>`, { wide: true });
  $('#save', m.el).onclick = () => {
    S.completed[id].reflect = ch.reflection.map((_, i) => $(`#rf${i}`, m.el).value.trim());
    persist(); sfx.tap(); m.close(); homeScreen();
  };
}
