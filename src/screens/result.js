import { render, esc, $, fmtTime } from '../engine/ui.js';
import { sfx } from '../engine/audio.js';
import { S, persist } from '../engine/state.js';
import { resultCode } from '../engine/scoring.js';
import { CHAPTERS, ORDER } from '../data/chapters.js';
import { GAME } from '../data/story.js';
import { homeScreen } from './home.js';
import { avatar } from '../art/characters.js';

function payload() {
  return {
    game: GAME.id,
    version: GAME.version,
    name: S.name,
    results: ORDER.filter((id) => S.completed[id]).map((id) => {
      const c = S.completed[id];
      return {
        chapter: id, score: c.score, max: c.max, badge: c.badge.id,
        time: c.time, wrongPerRoom: c.wrong, vaultWrong: c.vaultWrong,
        date: c.date, reflect: c.reflect
      };
    })
  };
}

export function resultScreen() {
  const rows = ORDER.filter((id) => S.completed[id]).map((id) => {
    const ch = CHAPTERS[id];
    const c = S.completed[id];
    return `
      <tr>
        <td><span class="td-ava">${avatar(ch.hero.figure)}</span><b>${ch.hero.name}</b><br><span class="small">${ch.place}</span></td>
        <td class="num">${c.badge.icon} ${c.badge.label}</td>
        <td class="num">${c.score}/${c.max}</td>
        <td class="num">${fmtTime(c.time)}</td>
      </tr>
      ${c.reflect ? `<tr class="rf-row"><td colspan="4">${c.reflect.map((r, i) => `<div><b>R${i + 1}:</b> ${esc(r) || '<i>—</i>'}</div>`).join('')}</td></tr>` : ''}`;
  }).join('');

  const today = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
  render(`
    <header class="topbar no-print">
      <button class="btn sm ghost" id="back">← Beranda</button>
      <div class="grow"></div>
      <button class="btn sm ghost" id="print">🖨️ Cetak</button>
      <button class="btn sm" id="dl">⬇ Unduh JSON</button>
    </header>
    <section class="report">
      <p class="eyebrow">Laporan Misi · ${today}</p>
      <h2>${GAME.title}</h2>
      <label class="small" for="sname">Nama</label>
      <input class="input" id="sname" maxlength="40" placeholder="Tulis nama kamu" value="${esc(S.name)}" autocomplete="off">
      <table class="table">
        <thead><tr><th>Misi</th><th>Lencana</th><th>Bintang</th><th>Waktu</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <p class="small">Kode hasil: <b class="num" id="code"></b> — penanda ringkas, bukan bukti yang tidak bisa dipalsukan.</p>
    </section>`);

  const updateCode = () => { $('#code').textContent = resultCode(payload()); };
  updateCode();
  $('#sname').oninput = (e) => { S.name = e.target.value; persist(); updateCode(); };
  $('#back').onclick = () => { sfx.tap(); homeScreen(); };
  $('#print').onclick = () => window.print();
  $('#dl').onclick = () => {
    const data = { ...payload(), code: resultCode(payload()), exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `hasil-${(S.name || 'siswa').replace(/[^\w-]+/g, '_')}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
}
