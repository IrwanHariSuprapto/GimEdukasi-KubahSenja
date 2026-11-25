import { render, modal, $ } from '../engine/ui.js';
import { sfx } from '../engine/audio.js';
import { GAME, INTRO } from '../data/story.js';
import { homeScreen } from './home.js';
import { S } from '../engine/state.js';
import { scene } from '../art/scenes.js';
import { figure, kubit } from '../art/characters.js';
import { music } from '../engine/music.js';
import { creditsModal } from './settings.js';

export function startScreen() {
  music.play('title');
  render(`
    <section class="hero">
      <div class="hero-art">${scene('title')}</div>
      <p class="eyebrow">${GAME.subject}</p>
      <h1 class="title">${GAME.title}</h1>
      <p class="lead">${GAME.tagline}</p>
      <div class="menu">
        <button class="btn" id="go">▶ Mulai</button>
        <button class="btn ghost" id="howto">Cara Bermain</button>
        <button class="btn ghost" id="dev">Profil Pengembang</button>
      </div>
    </section>`);
  $('#dev').onclick = () => { sfx.init(); sfx.tap(); creditsModal(); };
  $('#go').onclick = () => {
    sfx.init(); sfx.tap();
    // pemain lama langsung ke beranda, pemain baru melihat pengantar
    if (Object.keys(S.completed).length || Object.keys(S.runs).length) homeScreen();
    else introScreen(0);
  };
  $('#howto').onclick = () => { sfx.init(); sfx.tap(); howTo(); };
}

export function howTo() {
  const m = modal(`
    <p class="eyebrow">Cara Bermain</p>
    <h2>Keluar dari Kubah Senja</h2>
    <ul class="list">
      ${GAME.howto.map((h) => `<li>${h}</li>`).join('')}
    </ul>
    <div class="actions"><button class="btn" id="ok">Mengerti</button></div>`);
  $('#ok', m.el).onclick = () => { sfx.tap(); m.close(); };
}

function introScreen(i) {
  const p = INTRO[i];
  const last = i === INTRO.length - 1;
  render(`
    <section class="story">
      <div class="story-art">${p.cast
        ? `<div class="cast">${p.cast.map((k) => (k === 'kubit' ? kubit() : figure(k, { pose: i === INTRO.length - 1 ? 'cheer' : undefined }))).join('')}</div>`
        : `<span aria-hidden="true">${p.art}</span>`}</div>
      <p class="eyebrow">Pengantar · ${i + 1} dari ${INTRO.length}</p>
      <h2>${p.title}</h2>
      <div class="panel">${p.body}</div>
      <nav class="story-nav">
        <button class="btn ghost" id="back" ${i === 0 ? 'disabled' : ''}>← Kembali</button>
        <div class="dots">${INTRO.map((_, j) => `<span class="dot ${j === i ? 'on' : ''}"></span>`).join('')}</div>
        <button class="btn" id="next">${last ? 'Masuk →' : 'Lanjut →'}</button>
      </nav>
    </section>`);
  $('#back').onclick = () => { sfx.tap(); introScreen(i - 1); };
  $('#next').onclick = () => { sfx.tap(); last ? homeScreen() : introScreen(i + 1); };
}
