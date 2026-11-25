import { render, modal, toast, cheer, $ } from '../engine/ui.js';
import { sfx } from '../engine/audio.js';
import { getRun, persist } from '../engine/state.js';
import { buildLayers } from '../engine/scoring.js';
import { CHAPTERS } from '../data/chapters.js';
import { WIDGETS } from '../widgets/index.js';
import { mapScreen } from './map.js';
import { scene } from '../art/scenes.js';
import { figure, avatar, kubit } from '../art/characters.js';
import { music } from '../engine/music.js';

const KIND = { PAHAMI: 'Pahami', HITUNG: 'Hitung', SIMPULKAN: 'Simpulkan' };

export function roomScreen(id, roomIdx) {
  const ch = CHAPTERS[id];
  const room = ch.rooms[roomIdx];
  music.play(ch.music);
  const run = getRun(id);
  const layers = buildLayers(ch, roomIdx, run.seed);
  const t0 = Date.now();
  let li = 0, roomStars = 0, roomWrong = 0;

  function showLayer() {
    const L = layers[li];
    let lost = false, hintsShown = 0, locked = false;
    const tumblers = ch.rooms.map((_, i) =>
      `<span class="tum ${run.done[i] ? 'done' : ''} ${i === roomIdx ? 'now' : ''}">${i + 1}</span>`).join('');

    render(`
      <header class="topbar" style="--accent:${ch.accent}">
        <button class="btn sm ghost" id="back">← Peta</button>
        <span class="pill">${avatar(ch.hero.figure)} <b>${ch.hero.name}</b></span>
        <div class="grow"></div>
        <div class="tumblers">${tumblers}</div>
      </header>
      <div class="room" style="--accent:${ch.accent}">
        <aside class="panel brief">
          <p class="eyebrow">Ruang ${roomIdx + 1}/${ch.rooms.length} · ${room.title}</p>
          <div class="room-art">${scene(room.scene) || room.art}
            <span class="room-fig">${figure(ch.hero.figure)}</span>
            <span class="room-kubit">${kubit({ mood: 'think' })}</span>
          </div>
          ${room.brief}
        </aside>
        <section class="panel qbox">
          <div class="layer-head">
            Tahap ${li + 1}/${layers.length} · <b>${KIND[L.kind]}</b>
            <span class="star" id="lstar" title="Bintang tahap ini">★</span>
          </div>
          <div id="widget"></div>
          <div class="qbar"><button class="btn sm ghost" id="hintbtn">💡 Petunjuk</button></div>
          <div id="hints" aria-live="polite"></div>
        </section>
      </div>`);

    const hintBtn = $('#hintbtn');
    const revealHint = () => {
      const hints = L.hints || [];
      if (hintsShown >= hints.length) return;
      const d = document.createElement('div');
      d.className = 'hint';
      d.innerHTML = `${kubit({ cls: 'hint-ava' })}<div><b>Kubit · Petunjuk ${hintsShown + 1}:</b> ${hints[hintsShown]}</div>`;
      $('#hints').appendChild(d);
      hintsShown++;
      if (hintsShown >= hints.length) hintBtn.disabled = true;
    };
    hintBtn.onclick = () => { if (!locked) { sfx.hint(); revealHint(); } };
    $('#back').onclick = () => { sfx.tap(); mapScreen(id); };

    WIDGETS[L.type]($('#widget'), L, {
      correct() {
        if (locked) return;
        locked = true;
        if (!lost) roomStars++;
        sfx.correct();
        explain(L, lost);
      },
      wrong(msg) {
        if (locked) return;
        if (!lost) { lost = true; $('#lstar').classList.add('off'); }
        roomWrong++;
        sfx.wrong();
        toast(false, msg || cheer());
        revealHint();
      },
      progress() { sfx.flip(); }
    });
  }

  function explain(L, lost) {
    const last = li === layers.length - 1;
    const m = modal(`
      <div class="modal-cast">${figure(ch.hero.figure, { pose: 'cheer' })}${kubit()}</div>
      <h2>${lost ? 'Bagus, kamu berhasil memperbaikinya! 👏' : 'Tepat sekali! ⭐'}</h2>
      <p class="earned">${lost ? '☆ tanpa bintang' : '⭐ +1 bintang'}</p>
      <div class="why">💡 <b>Pembahasan:</b> ${L.why}</div>
      <div class="actions"><button class="btn" id="next">${last ? 'Buka Pintu Ruang →' : 'Tahap Berikutnya →'}</button></div>`);
    $('#next', m.el).onclick = () => {
      sfx.tap(); m.close(); li++;
      last ? solved() : showLayer();
    };
  }

  function solved() {
    run.done[roomIdx] = true;
    run.stars[roomIdx] = roomStars;
    run.wrong[roomIdx] = roomWrong;
    run.time += Math.round((Date.now() - t0) / 1000);
    persist();
    sfx.unlock();
    const m = modal(`
      <div class="check">🔓</div>
      <h2>Ruang terbuka!</h2>
      <p class="earned">Bintang ruang: ⭐ ${roomStars}/${layers.length}</p>
      <div class="code-reveal">Digit kode ke-${roomIdx + 1}: <b class="num">${run.code[roomIdx]}</b>
        <p class="small">✍️ Catat angka ini — kelima digit dibutuhkan untuk membuka brankas. (Digit juga tampil di peta.)</p>
      </div>
      <div class="actions"><button class="btn" id="map">Kembali ke Peta →</button></div>`);
    $('#map', m.el).onclick = () => { sfx.tap(); m.close(); mapScreen(id); };
  }

  showLayer();
}
