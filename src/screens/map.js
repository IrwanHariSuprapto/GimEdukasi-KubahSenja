import { render, $, $$ } from '../engine/ui.js';
import { sfx } from '../engine/audio.js';
import { getRun } from '../engine/state.js';
import { CHAPTERS } from '../data/chapters.js';
import { homeScreen } from './home.js';
import { roomScreen } from './room.js';
import { vaultScreen } from './vault.js';
import { scene } from '../art/scenes.js';
import { figure, avatar, kubit } from '../art/characters.js';
import { music } from '../engine/music.js';

export function mapScreen(id) {
  const ch = CHAPTERS[id];
  music.play(ch.music);
  const run = getRun(id);
  const next = run.done.indexOf(false);
  const allDone = next === -1;
  const score = run.stars.reduce((a, b) => a + b, 0);

  const nodes = ch.rooms.map((r, i) => {
    const state = run.done[i] ? 'done' : i === next ? 'active' : 'locked';
    const icon = run.done[i] ? '✓' : state === 'locked' ? '🔒' : i + 1;
    return `
      <li class="node ${state}">
        <button data-i="${i}" ${state === 'active' ? '' : 'disabled'} aria-label="Ruang ${i + 1}: ${r.title}">
          <span class="node-ico">${icon}</span>
          <span class="node-art">${scene(r.scene) || r.art}</span>
          <span class="node-title">${r.title}</span>
          ${run.done[i] ? `<span class="node-code">kode <b class="num">${run.code[i]}</b></span>` : ''}
        </button>
      </li>`;
  }).join('');

  render(`
    <header class="topbar" style="--accent:${ch.accent}">
      <button class="btn sm ghost" id="back">← Beranda</button>
      <span class="pill">${avatar(ch.hero.figure)} <b>${ch.hero.name}</b></span>
      <span class="pill">⭐ <b class="num">${score}</b></span>
      <div class="grow"></div>
    </header>
    <p class="eyebrow">${ch.place}</p>
    <div class="say">
      ${figure(ch.hero.figure)}
      ${kubit()}
      <div class="bubble">
        <b>Kubit:</b> ${allDone
          ? `Semua ruang terbuka! Masukkan ${ch.rooms.length} digit kode di brankas pintu keluar, ${ch.hero.name}.`
          : next === 0
            ? `Halo, ${ch.hero.name}! Mulai dari ruang yang menyala. Setiap ruang memberi satu digit kode — jangan lupa dicatat.`
            : `Bagus! ${next} ruang sudah terbuka. Lanjut ke ruang ${next + 1}: <b>${ch.rooms[next].title}</b>.`}
      </div>
    </div>
    <ol class="map" style="--accent:${ch.accent}">
      ${nodes}
      <li class="node exit ${allDone ? 'active' : 'locked'}">
        <button data-i="vault" ${allDone ? '' : 'disabled'} aria-label="Brankas pintu keluar">
          <span class="node-ico">${allDone ? '🚪' : '🔒'}</span>
          <span class="node-art">${scene('vault')}</span>
          <span class="node-title">Brankas Pintu Keluar</span>
        </button>
      </li>
    </ol>`);

  $('#back').onclick = () => { sfx.tap(); homeScreen(); };
  $$('.map button:not([disabled])').forEach((b) => {
    b.onclick = () => { sfx.tap(); b.dataset.i === 'vault' ? vaultScreen(id) : roomScreen(id, +b.dataset.i); };
  });
}
