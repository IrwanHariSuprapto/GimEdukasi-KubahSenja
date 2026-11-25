import './styles.css';
import { load } from './engine/state.js';
import { sfx } from './engine/audio.js';
import { music } from './engine/music.js';
import { startScreen } from './screens/start.js';
import { render } from './engine/ui.js';
import { settingsModal } from './screens/settings.js';

load();

/* ---- tombol suara & musik (pilihan disimpan di perangkat) ---- */
const soundBtn = document.getElementById('sound');
const musicBtn = document.getElementById('music');
const paintSound = (on) => { soundBtn.textContent = on ? '🔊' : '🔇'; soundBtn.setAttribute('aria-label', on ? 'Efek suara aktif' : 'Efek suara mati'); };
const paintMusic = (on) => { musicBtn.classList.toggle('off', !on); musicBtn.setAttribute('aria-label', on ? 'Musik latar aktif' : 'Musik latar mati'); musicBtn.setAttribute('aria-pressed', String(on)); };
paintSound(sfx.isOn());
paintMusic(music.isOn());
soundBtn.onclick = () => { sfx.init(); paintSound(sfx.toggle()); };
musicBtn.onclick = () => { music.unlock(); paintMusic(music.toggle()); };
document.getElementById('settings').onclick = () => { sfx.init(); sfx.tap(); settingsModal(); };
document.addEventListener('audiochange', () => { paintSound(sfx.isOn()); paintMusic(music.isOn()); });

// Browser hanya mengizinkan audio setelah interaksi pertama pengguna.
const unlockAudio = () => { music.unlock(); };
document.addEventListener('pointerdown', unlockAudio, { once: true, capture: true });
document.addEventListener('keydown', unlockAudio, { once: true, capture: true });

// Buka index.html#galeri untuk melihat semua ilustrasi sekaligus (alat bantu pengembang).
if (location.hash === '#galeri') {
  Promise.all([import('./art/scenes.js'), import('./art/characters.js')]).then(([{ scene, SCENE_KEYS }, C]) => {
    const figs = C.FIGURE_KEYS.flatMap((k) => ['idle', 'cheer', 'hold'].map((p) =>
      `<figure class="fig-cell">${C.figure(k, { pose: p })}<figcaption>${k} · ${p}</figcaption></figure>`)).join('');
    render(`<p class="eyebrow">Galeri tokoh</p>
      <div class="fig-gallery">${figs}
        <figure class="fig-cell">${C.kubit()}<figcaption>kubit · happy</figcaption></figure>
        <figure class="fig-cell">${C.kubit({ mood: 'think' })}<figcaption>kubit · think</figcaption></figure>
        <figure class="fig-cell">${C.FIGURE_KEYS.map((k) => C.avatar(k)).join('')}<figcaption>avatar</figcaption></figure>
      </div>
      <p class="eyebrow" style="margin-top:20px">Galeri ilustrasi · ${SCENE_KEYS.length} adegan</p>
      <div class="gallery">${SCENE_KEYS.map((k) => `<figure><div class="frame">${scene(k)}</div><figcaption>${k}</figcaption></figure>`).join('')}</div>`);
  });
} else {
  startScreen();
}
