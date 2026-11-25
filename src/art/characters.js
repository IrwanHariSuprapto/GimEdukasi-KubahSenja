/* ============================================================
   FIGUR TOKOH (SVG, orisinal) — gaya chibi datar, konsisten untuk semua tokoh.
   figure(key, { pose: 'idle'|'cheer'|'hold', crop: 'full'|'head' })
   kubit({ mood: 'happy'|'think' })
   ============================================================ */

const VB_FULL = '0 0 100 160';
const VB_HEAD = '25 13 50 50';

const TOKOH = {
  dara: {
    skin: '#c68a5e', hair: '#2a1d1a', top: '#2d3a6b', topDark: '#222c55', pants: '#3a2f45', shoes: '#1a1426',
    defaultPose: 'idle'
  },
  nara: {
    skin: '#8d5a3b', hair: '#1c1412', top: '#1f8c8a', topDark: '#176e6c', pants: '#1f8c8a', shoes: '#ff9d6b',
    defaultPose: 'idle'
  },
  sekar: {
    skin: '#e0ac82', hair: '#e86a92', top: '#f3e6d3', topDark: '#d9c8b0', pants: '#5c4a3a', shoes: '#3a2a20',
    defaultPose: 'hold'
  },
  /* --- tokoh utama saat ini --- */
  irwan: {
    skin: '#c08457', hair: '#1f1715', top: '#2d3a6b', topDark: '#222c55', pants: '#3a2f45', shoes: '#1a1426',
    defaultPose: 'idle'
  },
  harry: {
    skin: '#9a6340', hair: '#17110f', top: '#1f8c8a', topDark: '#176e6c', pants: '#1f8c8a', shoes: '#ff9d6b',
    defaultPose: 'idle'
  },
  suprapto: {
    skin: '#d39d72', hair: '#2a1d16', top: '#f3e6d3', topDark: '#d9c8b0', pants: '#8a7556', shoes: '#3a2a20',
    defaultPose: 'hold'
  }
};

/* ---------- bagian tubuh bersama ---------- */
const ARMS = {
  idle: [[35, 68, 30, 86, 29, 104], [65, 68, 70, 86, 71, 104]],
  cheer: [[35, 68, 26, 54, 22, 38], [65, 68, 74, 54, 78, 38]],
  hold: [[35, 68, 32, 90, 42, 97], [65, 68, 68, 90, 58, 97]]
};

function arms(t, pose) {
  return ARMS[pose].map(([x1, y1, qx, qy, x2, y2]) =>
    `<path d="M${x1} ${y1} Q${qx} ${qy} ${x2} ${y2}" stroke="${t.topDark}" stroke-width="9" stroke-linecap="round" fill="none"/>
     <path d="M${x1} ${y1} Q${qx} ${qy} ${x2} ${y2}" stroke="${t.top}" stroke-width="6.5" stroke-linecap="round" fill="none"/>`).join('');
}
const hands = (t, pose) => ARMS[pose].map(([, , , , x, y]) => `<circle cx="${x}" cy="${y}" r="4.6" fill="${t.skin}"/>`).join('');

function face(pose, cx = 50) {
  const happy = pose === 'cheer';
  const eyes = happy
    ? `<path d="M${cx - 9} 44 q2.6 -3.4 5.2 0 M${cx + 3.8} 44 q2.6 -3.4 5.2 0" stroke="#1b1426" stroke-width="1.8" fill="none" stroke-linecap="round"/>`
    : `<ellipse cx="${cx - 6.5}" cy="43" rx="2.3" ry="2.9" fill="#1b1426"/><ellipse cx="${cx + 6.5}" cy="43" rx="2.3" ry="2.9" fill="#1b1426"/>
       <circle cx="${cx - 5.7}" cy="41.9" r=".9" fill="#fff"/><circle cx="${cx + 7.3}" cy="41.9" r=".9" fill="#fff"/>`;
  const mouth = happy
    ? `<path d="M${cx - 4.5} 49 q4.5 6 9 0Z" fill="#7a3b2e"/>`
    : `<path d="M${cx - 3.8} 49.5 q3.8 3.2 7.6 0" stroke="#7a3b2e" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
  return `${eyes}${mouth}<circle cx="${cx - 10}" cy="48" r="2.6" fill="#ff7a7a" opacity=".35"/><circle cx="${cx + 10}" cy="48" r="2.6" fill="#ff7a7a" opacity=".35"/>`;
}

function legs(t) {
  return `<rect x="37" y="106" width="10.5" height="40" rx="4" fill="${t.pants}"/>
    <rect x="52.5" y="106" width="10.5" height="40" rx="4" fill="${t.pants}"/>`;
}
const torso = (t) => `<path d="M34 64 Q50 59 66 64 L70 112 Q50 117 30 112Z" fill="${t.top}"/>
  <path d="M34 64 Q50 59 66 64 L67 70 Q50 66 33 70Z" fill="${t.topDark}" opacity=".6"/>`;
const neck = (t) => `<rect x="45.5" y="54" width="9" height="11" rx="3" fill="${t.skin}"/>`;
const shadow = `<ellipse cx="50" cy="151" rx="24" ry="4.5" fill="#000" opacity=".28"/>`;

/* ---------- tokoh ---------- */
const DRAW = {
  dara(t, pose) {
    return `${shadow}
      <ellipse cx="42" cy="148" rx="7" ry="4" fill="${t.shoes}"/><ellipse cx="58" cy="148" rx="7" ry="4" fill="${t.shoes}"/>
      ${legs(t)}${torso(t)}
      <path d="M50 66 V112" stroke="${t.topDark}" stroke-width="1.4"/>
      ${[78, 90, 102].map((y) => `<circle cx="53.5" cy="${y}" r="1.6" fill="#f5b942"/>`).join('')}
      <path d="M38 84 l3 -3 l3 3 l-1 -4 l3 -2 h-4 l-1 -4 l-1 4 h-4 l3 2z" fill="#f5b942"/>
      ${neck(t)}
      <path d="M39 60 Q50 67 61 60 L61 66 Q50 73 39 66Z" fill="#f5b942"/>
      <path d="M56 65 l5 15 l-6 -2Z" fill="#e09a2f"/>
      ${arms(t, pose)}${hands(t, pose)}
      <path d="M29 43 Q27 17 50 17 Q73 17 71 43 L71 56 Q66 61 62 56 L62 44 H38 V56 Q34 61 29 56Z" fill="${t.hair}"/>
      <circle cx="50" cy="40" r="19" fill="${t.skin}"/>
      <path d="M31 39 Q33 19 50 20 Q67 19 69 39 Q61 30 53 33 Q45 27 31 39Z" fill="${t.hair}"/>
      <path d="M64 27 l1.6 3.4 3.7 .4 -2.8 2.5 .8 3.6 -3.3 -1.9 -3.3 1.9 .8 -3.6 -2.8 -2.5 3.7 -.4z" fill="#f5b942"/>
      ${face(pose)}`;
  },

  nara(t, pose) {
    return `${shadow}
      <ellipse cx="41" cy="148" rx="9.5" ry="4" fill="${t.shoes}"/><ellipse cx="59" cy="148" rx="9.5" ry="4" fill="${t.shoes}"/>
      ${legs(t)}
      <path d="M38 110 V144 M62 110 V144" stroke="#ff9d6b" stroke-width="2"/>
      ${torso(t)}
      <path d="M33 74 L31 110 M67 74 L69 110" stroke="#ff9d6b" stroke-width="3" stroke-linecap="round"/>
      <path d="M50 64 V108" stroke="#0f4f4e" stroke-width="1.6"/><rect x="48" y="64" width="4" height="5" rx="1" fill="#e7fbff"/>
      ${neck(t)}
      <circle cx="71" cy="41" r="7" fill="${t.hair}"/><circle cx="74" cy="52" r="6" fill="${t.hair}"/><circle cx="72" cy="61" r="4.5" fill="${t.hair}"/>
      ${arms(t, pose)}${hands(t, pose)}
      <circle cx="35" cy="27" r="9" fill="${t.hair}"/><circle cx="50" cy="20" r="10" fill="${t.hair}"/><circle cx="65" cy="27" r="9" fill="${t.hair}"/>
      <circle cx="69" cy="36" r="2.6" fill="#ff9d6b"/>
      <circle cx="50" cy="40" r="19" fill="${t.skin}"/>
      <path d="M31 38 Q33 22 50 22 Q67 22 69 38 Q60 31 50 32 Q40 31 31 38Z" fill="${t.hair}"/>
      <path d="M31 30 H69" stroke="#0f4f4e" stroke-width="3"/>
      <circle cx="43" cy="29" r="5.6" fill="#9fe8f0" opacity=".9" stroke="#ff9d6b" stroke-width="2"/>
      <circle cx="57" cy="29" r="5.6" fill="#9fe8f0" opacity=".9" stroke="#ff9d6b" stroke-width="2"/>
      <path d="M41 27 l2.5 -1.5 M55 27 l2.5 -1.5" stroke="#fff" stroke-width="1.2" stroke-linecap="round"/>
      ${face(pose)}`;
  },

  sekar(t, pose) {
    const pot = pose === 'hold'
      ? `<path d="M50 92 V84 M50 88 l-6 -6 M50 86 l6 -7" stroke="#4fa46a" stroke-width="2.4" stroke-linecap="round"/>
         <circle cx="44" cy="81" r="3" fill="#5fae6e"/><circle cx="56" cy="78" r="3" fill="#5fae6e"/><circle cx="50" cy="82" r="2.6" fill="#ff7aa8"/>
         <path d="M41 92 H59 L57 106 H43Z" fill="#c26a43"/><rect x="40" y="91" width="20" height="4" rx="1.5" fill="#d98157"/>`
      : '';
    return `${shadow}
      <ellipse cx="42" cy="148" rx="7" ry="4" fill="${t.shoes}"/><ellipse cx="58" cy="148" rx="7" ry="4" fill="${t.shoes}"/>
      ${legs(t)}${torso(t)}
      <path d="M38 74 H62 L66 113 Q50 117 34 113Z" fill="#4fa46a"/>
      <path d="M38 74 L35 66 M62 74 L65 66" stroke="#3f8f5a" stroke-width="2"/>
      <rect x="44" y="94" width="12" height="9" rx="2" fill="#3f8f5a"/>
      ${neck(t)}
      ${arms(t, pose)}${pot}${hands(t, pose)}
      <path d="M27 44 Q26 15 50 15 Q74 15 73 44 Q76 63 69 73 Q50 81 31 73 Q24 63 27 44Z" fill="${t.hair}"/>
      <path d="M31 72 Q50 80 69 72 L66 64 Q50 70 34 64Z" fill="#d0587e"/>
      <circle cx="50" cy="42" r="15.5" fill="${t.skin}"/>
      <circle cx="50" cy="42" r="16" fill="none" stroke="#d0587e" stroke-width="2.4"/>
      <circle cx="64" cy="54" r="2.2" fill="#f5b942"/>
      ${face(pose)}`;
  }
};

/* ---------- tokoh utama: Irwan, Harry, Suprapto ---------- */
const POT = `<path d="M50 92 V84 M50 88 l-6 -6 M50 86 l6 -7" stroke="#4fa46a" stroke-width="2.4" stroke-linecap="round"/>
  <circle cx="44" cy="81" r="3" fill="#5fae6e"/><circle cx="56" cy="78" r="3" fill="#5fae6e"/><circle cx="50" cy="82" r="2.6" fill="#ff7aa8"/>
  <path d="M41 92 H59 L57 106 H43Z" fill="#c26a43"/><rect x="40" y="91" width="20" height="4" rx="1.5" fill="#d98157"/>`;

/* ekor jas lebih panjang & bahu lebih lebar untuk siluet laki-laki */
const torsoWide = (t) => `<path d="M32 64 Q50 59 68 64 L71 112 Q50 116 29 112Z" fill="${t.top}"/>
  <path d="M32 64 Q50 59 68 64 L69 70 Q50 66 31 70Z" fill="${t.topDark}" opacity=".6"/>`;

Object.assign(DRAW, {
  /* Irwan — pengamat bintang: rambut belah samping, kacamata, jas biru tua & syal emas */
  irwan(t, pose) {
    return `${shadow}
      <ellipse cx="42" cy="148" rx="7.5" ry="4" fill="${t.shoes}"/><ellipse cx="58" cy="148" rx="7.5" ry="4" fill="${t.shoes}"/>
      ${legs(t)}${torsoWide(t)}
      <path d="M50 64 L44 76 L50 74 L56 76Z" fill="#e8ecf5"/>
      <path d="M50 74 V112" stroke="${t.topDark}" stroke-width="1.4"/>
      ${[82, 94, 106].map((y) => `<circle cx="53.5" cy="${y}" r="1.6" fill="#f5b942"/>`).join('')}
      <path d="M38 86 l3 -3 l3 3 l-1 -4 l3 -2 h-4 l-1 -4 l-1 4 h-4 l3 2z" fill="#f5b942"/>
      ${neck(t)}
      <path d="M40 60 Q50 66 60 60 L60 65 Q50 71 40 65Z" fill="#f5b942"/>
      <path d="M57 64 l4 13 l-5 -1.5Z" fill="#e09a2f"/>
      ${arms(t, pose)}${hands(t, pose)}
      <circle cx="31.5" cy="42" r="3.4" fill="${t.skin}"/><circle cx="68.5" cy="42" r="3.4" fill="${t.skin}"/>
      <circle cx="50" cy="40" r="19" fill="${t.skin}"/>
      <path d="M31 40 Q29 18 50 18 Q71 18 69 40 Q67 30 62 27 Q52 31 40 27 Q34 30 31 40Z" fill="${t.hair}"/>
      <path d="M40 27 Q47 20 60 22 Q54 22 48 28Z" fill="#3a2b26"/>
      <rect x="37.5" y="38.5" width="11" height="9" rx="3" fill="#bfe8ff" fill-opacity=".18" stroke="#1b1426" stroke-width="1.6"/>
      <rect x="51.5" y="38.5" width="11" height="9" rx="3" fill="#bfe8ff" fill-opacity=".18" stroke="#1b1426" stroke-width="1.6"/>
      <path d="M48.5 42 H51.5" stroke="#1b1426" stroke-width="1.4"/>
      <path d="M41 35.5 h6 M53 35.5 h6" stroke="${t.hair}" stroke-width="1.6" stroke-linecap="round"/>
      ${face(pose)}`;
  },

  /* Harry — navigator: rambut cepak bertekstur, kacamata selam di dahi, baju selam */
  harry(t, pose) {
    const curls = Array.from({ length: 9 }, (_, i) => {
      const a = Math.PI + (i / 8) * Math.PI;
      return `<circle cx="${(50 + Math.cos(a) * 17).toFixed(1)}" cy="${(37 + Math.sin(a) * 17).toFixed(1)}" r="5.2" fill="${t.hair}"/>`;
    }).join('');
    return `${shadow}
      <ellipse cx="41" cy="148" rx="9.5" ry="4" fill="${t.shoes}"/><ellipse cx="59" cy="148" rx="9.5" ry="4" fill="${t.shoes}"/>
      ${legs(t)}
      <path d="M38 110 V144 M62 110 V144" stroke="#ff9d6b" stroke-width="2"/>
      ${torsoWide(t)}
      <path d="M32 74 L30 110 M68 74 L70 110" stroke="#ff9d6b" stroke-width="3" stroke-linecap="round"/>
      <path d="M50 64 V108" stroke="#0f4f4e" stroke-width="1.6"/><rect x="48" y="64" width="4" height="5" rx="1" fill="#e7fbff"/>
      <circle cx="61" cy="80" r="4" fill="#0f4f4e"/><path d="M61 77 v6 M58 80 h6" stroke="#ffcf7a" stroke-width="1"/>
      ${neck(t)}
      ${arms(t, pose)}${hands(t, pose)}
      <circle cx="31.5" cy="42" r="3.4" fill="${t.skin}"/><circle cx="68.5" cy="42" r="3.4" fill="${t.skin}"/>
      <circle cx="50" cy="40" r="19" fill="${t.skin}"/>
      ${curls}
      <path d="M33 36 Q34 22 50 21 Q66 22 67 36 Q58 30 50 31 Q42 30 33 36Z" fill="${t.hair}"/>
      <path d="M31 31 H69" stroke="#0f4f4e" stroke-width="3"/>
      <circle cx="43" cy="30" r="5.6" fill="#9fe8f0" opacity=".9" stroke="#ff9d6b" stroke-width="2"/>
      <circle cx="57" cy="30" r="5.6" fill="#9fe8f0" opacity=".9" stroke="#ff9d6b" stroke-width="2"/>
      <path d="M41 28 l2.5 -1.5 M55 28 l2.5 -1.5" stroke="#fff" stroke-width="1.2" stroke-linecap="round"/>
      <path d="M42 39 h5 M53 39 h5" stroke="${t.hair}" stroke-width="1.8" stroke-linecap="round"/>
      ${face(pose)}`;
  },

  /* Suprapto — ahli botani: topi penjelajah, kemeja krem, celemek hijau, membawa pot */
  suprapto(t, pose) {
    return `${shadow}
      <ellipse cx="42" cy="148" rx="7.5" ry="4" fill="${t.shoes}"/><ellipse cx="58" cy="148" rx="7.5" ry="4" fill="${t.shoes}"/>
      ${legs(t)}${torsoWide(t)}
      <path d="M44 64 L50 72 L56 64" stroke="${t.topDark}" stroke-width="1.6" fill="none"/>
      <path d="M37 74 H63 L67 113 Q50 117 33 113Z" fill="#4fa46a"/>
      <path d="M37 74 L35 66 M63 74 L65 66" stroke="#3f8f5a" stroke-width="2"/>
      <rect x="44" y="96" width="12" height="9" rx="2" fill="#3f8f5a"/>
      <path d="M58 78 h5 v8 h-5z" fill="#3f8f5a"/><path d="M60 76 v4" stroke="#e8ecf5" stroke-width="1.4"/>
      ${neck(t)}
      ${arms(t, pose)}${pose === 'hold' ? POT : ''}${hands(t, pose)}
      <circle cx="31.5" cy="42" r="3.4" fill="${t.skin}"/><circle cx="68.5" cy="42" r="3.4" fill="${t.skin}"/>
      <circle cx="50" cy="40" r="19" fill="${t.skin}"/>
      <path d="M31.5 42 Q31 33 34 30 H66 Q69 33 68.5 42 Q66 36 63 34 H37 Q34 36 31.5 42Z" fill="${t.hair}"/>
      <path d="M33 30 Q34 15 50 14 Q66 15 67 30Z" fill="#c9a86a"/>
      <rect x="33" y="25" width="34" height="5" fill="#4f7a3a"/>
      <ellipse cx="50" cy="30.5" rx="27" ry="4.6" fill="#b8975a"/>
      <path d="M38 17 Q50 13 62 17" stroke="#e3c88e" stroke-width="1.4" fill="none"/>
      ${leafPin}
      <path d="M41.5 38 h6 M52.5 38 h6" stroke="${t.hair}" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M45 47.2 Q50 45.4 55 47.2 Q50 48.6 45 47.2Z" fill="${t.hair}"/>
      ${face(pose)}`;
  }
});

const leafPin = `<path d="M62 25 q5 -6 9 -2 q-5 5 -9 2Z" fill="#5fae6e"/>`;

/* ---------- ilustrasi raster (diberikan pengguna) ----------
   Hasil potong dari art-source/tokoh-sumber.jpg lewat art-source/cutout.py.
   Jika ada, dipakai menggantikan figur SVG; satu gambar untuk semua pose
   (pose 'cheer' diberi animasi lompat lewat CSS). */
import irwanImg from '../assets/tokoh/irwan.webp';
import harryImg from '../assets/tokoh/harry.webp';
import supraptoImg from '../assets/tokoh/suprapto.webp';
import irwanAva from '../assets/tokoh/irwan-ava.webp';
import harryAva from '../assets/tokoh/harry-ava.webp';
import supraptoAva from '../assets/tokoh/suprapto-ava.webp';

const RASTER = {
  irwan: { full: irwanImg, head: irwanAva, alt: 'Irwan, pengamat bintang' },
  harry: { full: harryImg, head: harryAva, alt: 'Harry, navigator muda' },
  suprapto: { full: supraptoImg, head: supraptoAva, alt: 'Suprapto, ahli botani' }
};

/** Figur tokoh utuh atau kepala saja (untuk avatar). */
export function figure(key, { pose, crop = 'full', cls = '', svg = false } = {}) {
  const r = !svg && RASTER[key];
  if (r) {
    return `<img class="fig fig-img ${cls} ${pose === 'cheer' ? 'pose-cheer' : ''}" src="${crop === 'head' ? r.head : r.full}" alt="" draggable="false">`;
  }
  const t = TOKOH[key];
  if (!t) return '';
  const p = pose || t.defaultPose;
  return `<svg class="fig ${cls}" viewBox="${crop === 'head' ? VB_HEAD : VB_FULL}" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">${DRAW[key](t, p)}</svg>`;
}

export const avatar = (key) => figure(key, { crop: 'head', cls: 'ava' });

/** Robot pemandu Kubit. */
export function kubit({ mood = 'happy', cls = '' } = {}) {
  const eyes = mood === 'think'
    ? `<circle cx="23" cy="29" r="2.6" fill="#5fe6e0"/><path d="M33 28 h6" stroke="#5fe6e0" stroke-width="2.4" stroke-linecap="round"/>`
    : `<path d="M20 30 q3 -4 6 0 M34 30 q3 -4 6 0" stroke="#5fe6e0" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
  const mouth = mood === 'think'
    ? `<path d="M26 35 h8" stroke="#5fe6e0" stroke-width="1.8" stroke-linecap="round"/>`
    : `<path d="M25 34 q5 4 10 0" stroke="#5fe6e0" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
  return `<svg class="kubit ${cls}" viewBox="0 0 60 66" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 52 Q30 66 36 52Z" fill="#ffb46a" opacity=".85"/><path d="M27 52 Q30 60 33 52Z" fill="#fff1c4"/>
    <line x1="30" y1="5" x2="30" y2="13" stroke="#9aa6c4" stroke-width="2"/><circle cx="30" cy="5" r="3.4" fill="#f5b942"/>
    <circle cx="8" cy="31" r="4.5" fill="#9aa6c4"/><circle cx="52" cy="31" r="4.5" fill="#9aa6c4"/>
    <rect x="8" y="12" width="44" height="40" rx="15" fill="#e3e9f7" stroke="#9aa6c4" stroke-width="2"/>
    <rect x="14" y="19" width="32" height="22" rx="8" fill="#12172b"/>
    ${eyes}${mouth}
    <circle cx="16" cy="46" r="1.6" fill="#ff7aa8"/><circle cx="44" cy="46" r="1.6" fill="#ff7aa8"/>
  </svg>`;
}

export const FIGURE_KEYS = Object.keys(TOKOH);
