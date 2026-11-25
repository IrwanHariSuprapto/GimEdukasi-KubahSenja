/* ============================================================
   ILUSTRASI VEKTOR (SVG) — orisinal, tanpa file eksternal.
   scene(key) → string <svg>. Kunci dipakai di data misi (field `scene`).
   Untuk mengganti dengan gambar raster (WebP), lihat sceneImage() di bawah.
   ============================================================ */

let uid = 0;
const W = 320, H = 180;

/* bintang deterministik (posisi sama tiap render) */
function stars(n, seed, maxY = 110, minY = 0, op = 0.8) {
  let s = seed * 7919 + 17;
  const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  let out = '';
  for (let i = 0; i < n; i++) {
    out += `<circle cx="${(r() * W).toFixed(1)}" cy="${(minY + r() * (maxY - minY)).toFixed(1)}" r="${(r() * 1.1 + 0.3).toFixed(2)}" fill="#fff" opacity="${(r() * op + 0.15).toFixed(2)}"/>`;
  }
  return out;
}

function bubbles(n, seed, x0 = 0, x1 = W) {
  let s = seed * 104729 + 3;
  const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  let out = '';
  for (let i = 0; i < n; i++) {
    const rr = (r() * 2.6 + 0.8).toFixed(1);
    out += `<circle cx="${(x0 + r() * (x1 - x0)).toFixed(1)}" cy="${(r() * 160).toFixed(1)}" r="${rr}" fill="none" stroke="#bff6ff" stroke-width=".7" opacity="${(r() * 0.5 + 0.25).toFixed(2)}"/>`;
  }
  return out;
}

/* ---------------- LATAR ---------------- */
const duskDefs = (id) => `
  <linearGradient id="${id}sky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#16123a"/><stop offset=".5" stop-color="#4f3570"/>
    <stop offset=".8" stop-color="#d0705c"/><stop offset="1" stop-color="#f7b45e"/>
  </linearGradient>
  <radialGradient id="${id}sun"><stop offset="0" stop-color="#ffe6a8"/><stop offset=".35" stop-color="#ffb46a" stop-opacity=".85"/><stop offset="1" stop-color="#ff8a5b" stop-opacity="0"/></radialGradient>`;

function duskSky(id, seed = 1) {
  return `<rect width="${W}" height="${H}" fill="url(#${id}sky)"/>${stars(46, seed, 95)}
    <circle cx="238" cy="150" r="70" fill="url(#${id}sun)"/>`;
}
const hills = `
  <path d="M0 146 Q50 126 110 138 T230 132 T320 138 V180 H0Z" fill="#2b1d3f"/>
  <path d="M0 160 Q90 146 170 156 T320 152 V180 H0Z" fill="#170f27"/>`;

/* interior observatorium: dinding gelap + jendela lengkung berisi langit senja */
function observatoryRoom(id, seed) {
  return `
    <defs>${duskDefs(id)}
      <linearGradient id="${id}wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#231c45"/><stop offset="1" stop-color="#110d24"/></linearGradient>
      <linearGradient id="${id}floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2a4a"/><stop offset="1" stop-color="#1a1226"/></linearGradient>
      <clipPath id="${id}win"><path d="M220 150 V60 A40 40 0 0 1 300 60 V150Z"/></clipPath>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#${id}wall)"/>
    ${[40, 80, 120].map((y) => `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="#ffffff" stroke-opacity=".03"/>`).join('')}
    <g clip-path="url(#${id}win)">
      <rect x="220" y="20" width="80" height="130" fill="url(#${id}sky)"/>
      ${stars(14, seed, 90, 20).replace(/cx="(\d+(\.\d+)?)"/g, (_, x) => `cx="${(220 + (+x / W) * 80).toFixed(1)}"`)}
      <circle cx="262" cy="150" r="34" fill="url(#${id}sun)"/>
      <path d="M220 142 Q250 132 300 138 V150 H220Z" fill="#2b1d3f"/>
    </g>
    <path d="M220 150 V60 A40 40 0 0 1 300 60 V150" fill="none" stroke="#c9923a" stroke-width="4"/>
    <line x1="260" y1="20" x2="260" y2="150" stroke="#c9923a" stroke-width="2" opacity=".7"/>
    <rect x="0" y="150" width="${W}" height="30" fill="url(#${id}floor)"/>
    <path d="M220 150 L170 180 H330 L300 150Z" fill="#f7b45e" opacity=".07"/>`;
}

const seaDefs = (id) => `
  <linearGradient id="${id}sea" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#1b7a8c"/><stop offset=".45" stop-color="#0d4a63"/><stop offset="1" stop-color="#061a2c"/>
  </linearGradient>
  <linearGradient id="${id}ray" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d8fbff" stop-opacity=".35"/><stop offset="1" stop-color="#d8fbff" stop-opacity="0"/></linearGradient>`;

const fish = (x, y, s = 1, flip = false) =>
  `<path transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})" d="M0 0 Q8 -6 16 0 Q8 6 0 0Z M16 0 L22 -4 L22 4Z" fill="#071d2b" opacity=".75"/>`;

/* interior kubah bawah laut: dinding logam + jendela bulat ke laut */
function hullRoom(id, seed) {
  return `
    <defs>${seaDefs(id)}
      <linearGradient id="${id}wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#123440"/><stop offset="1" stop-color="#081b23"/></linearGradient>
      <clipPath id="${id}port"><circle cx="262" cy="70" r="38"/></clipPath>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#${id}wall)"/>
    ${[36, 72, 108, 144].map((y) => `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="#7fe9f0" stroke-opacity=".06"/>`).join('')}
    ${[30, 90, 150, 210].map((x) => `<line x1="${x}" y1="0" x2="${x}" y2="150" stroke="#7fe9f0" stroke-opacity=".04"/>`).join('')}
    <g clip-path="url(#${id}port)">
      <rect x="220" y="30" width="84" height="80" fill="url(#${id}sea)"/>
      <path d="M236 30 L250 110 H262 L256 30Z M270 30 L290 110 H298 L280 30Z" fill="url(#${id}ray)"/>
      ${fish(238, 64, 0.9)}${fish(286, 84, 0.7, true)}${bubbles(8, seed, 230, 300)}
    </g>
    <circle cx="262" cy="70" r="38" fill="none" stroke="#5fc6c9" stroke-width="5"/>
    <circle cx="262" cy="70" r="44" fill="none" stroke="#2c6b74" stroke-width="3"/>
    ${Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return `<circle cx="${(262 + Math.cos(a) * 44).toFixed(1)}" cy="${(70 + Math.sin(a) * 44).toFixed(1)}" r="2" fill="#8fdde0"/>`; }).join('')}
    <rect x="0" y="150" width="${W}" height="30" fill="#0a1f27"/>
    ${Array.from({ length: 16 }, (_, i) => `<line x1="${i * 20 + 6}" y1="152" x2="${i * 20 + 6}" y2="180" stroke="#2c6b74" stroke-opacity=".5"/>`).join('')}
    <rect x="0" y="149" width="${W}" height="3" fill="#2c6b74"/>`;
}

/* interior rumah kaca: rangka kaca berlengkung, cahaya hutan keemasan, daun di tepi */
const leaf = (x, y, s, rot, c = '#3f8f5a') =>
  `<path transform="translate(${x} ${y}) rotate(${rot}) scale(${s})" d="M0 0 Q10 -10 22 0 Q10 10 0 0Z" fill="${c}"/><path transform="translate(${x} ${y}) rotate(${rot}) scale(${s})" d="M0 0 L20 0" stroke="#1d4a30" stroke-width=".8"/>`;

function greenhouseRoom(id, seed) {
  return `
    <defs>
      <linearGradient id="${id}gh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2d4a3a"/><stop offset=".6" stop-color="#1b3328"/><stop offset="1" stop-color="#0f1f18"/></linearGradient>
      <linearGradient id="${id}glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe2a0" stop-opacity=".55"/><stop offset=".6" stop-color="#9fd8a8" stop-opacity=".25"/><stop offset="1" stop-color="#2d4a3a" stop-opacity="0"/></linearGradient>
      <linearGradient id="${id}beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff1c4" stop-opacity=".28"/><stop offset="1" stop-color="#fff1c4" stop-opacity="0"/></linearGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#${id}gh)"/>
    <path d="M0 0 H${W} V120 H0Z" fill="url(#${id}glass)"/>
    ${[40, 100, 160, 220, 280].map((x) => `<path d="M${x} 0 V150" stroke="#cfe9d4" stroke-opacity=".22" stroke-width="2"/>`).join('')}
    ${[0, 1, 2].map((i) => `<path d="M0 ${24 + i * 36} Q160 ${8 + i * 36} 320 ${24 + i * 36}" stroke="#cfe9d4" stroke-opacity=".18" fill="none" stroke-width="2"/>`).join('')}
    <path d="M206 0 L250 150 H286 L240 0Z" fill="url(#${id}beam)"/>
    ${stars(10, seed, 110, 10, 0.5).replace(/fill="#fff"/g, 'fill="#fff1c4"')}
    ${leaf(-4, 30, 1.6, 20)}${leaf(-2, 60, 1.3, 35, '#4fa46a')}${leaf(300, 40, 1.5, 160)}${leaf(306, 76, 1.2, 150, '#4fa46a')}
    ${leaf(10, 4, 1.1, 70, '#2f7a4a')}${leaf(296, 8, 1.2, 110, '#2f7a4a')}
    <rect x="0" y="150" width="${W}" height="30" fill="#3b2a1e"/>
    <rect x="0" y="150" width="${W}" height="4" fill="#5a4030"/>
    ${[18, 60, 112, 170, 230, 284].map((x, i) => `<circle cx="${x}" cy="${163 + (i % 2) * 7}" r="${2 + (i % 3)}" fill="#6b4c36"/>`).join('')}`;
}

/* ---------------- OBJEK RUANG: MISI 1 (observatorium) ---------------- */
const daraObjects = {
  telescope: () => `
    <path d="M150 92 L232 52 L236 64 L156 102Z" fill="#ffe6a8" opacity=".08"/>
    <g transform="rotate(-26 140 92)">
      <rect x="80" y="81" width="128" height="22" rx="5" fill="#b9802f"/>
      <rect x="80" y="81" width="128" height="8" rx="4" fill="#f3c873" opacity=".55"/>
      <rect x="120" y="79" width="8" height="26" fill="#7a5420"/>
      <rect x="204" y="76" width="16" height="32" rx="4" fill="#7a5420"/>
      <ellipse cx="220" cy="92" rx="3" ry="14" fill="#bfe8ff" opacity=".8"/>
      <rect x="66" y="86" width="16" height="12" rx="2" fill="#5c3e16"/>
    </g>
    <g stroke="#7d6036" stroke-width="5" stroke-linecap="round">
      <line x1="136" y1="102" x2="108" y2="160"/><line x1="136" y1="102" x2="166" y2="160"/><line x1="136" y1="102" x2="138" y2="166"/>
    </g>
    <circle cx="136" cy="100" r="7" fill="#4b3616"/>
    <ellipse cx="136" cy="166" rx="40" ry="5" fill="#000" opacity=".25"/>`,

  cabinet: () => {
    let d = '';
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
      const x = 62 + c * 42, y = 50 + r * 32, open = r === 1 && c === 2;
      d += `<rect x="${x}" y="${y}" width="38" height="28" rx="2" fill="${open ? '#2a1a0c' : '#6b4524'}" stroke="#3f2810"/>`;
      d += open ? '' : `<circle cx="${x + 19}" cy="${y + 14}" r="3" fill="#e9b45a"/>`;
    }
    return `
      <rect x="54" y="40" width="142" height="120" rx="6" fill="#4b2f18"/>
      <rect x="54" y="40" width="142" height="6" fill="#7a5130"/>
      ${d}
      <g transform="translate(150 108)">
        <rect x="0" y="0" width="52" height="18" rx="2" fill="#7c5230" stroke="#3f2810"/>
        <circle cx="16" cy="-4" r="11" fill="#bfe8ff" opacity=".35" stroke="#f3c873" stroke-width="2.5"/>
        <path d="M10 -9 Q15 -13 21 -10" stroke="#fff" stroke-width="1.5" fill="none" opacity=".8"/>
        <circle cx="38" cy="-2" r="8" fill="#bfe8ff" opacity=".3" stroke="#f3c873" stroke-width="2"/>
      </g>
      <text x="125" y="31" text-anchor="middle" font-family="ui-monospace,monospace" font-size="13" fill="#f3c873" opacity=".85">n! = n·(n−1)!</text>
      <ellipse cx="125" cy="162" rx="78" ry="5" fill="#000" opacity=".3"/>`;
  },

  starmap: () => {
    const pts = [[118, 62], [138, 76], [160, 70], [176, 92], [158, 112], [134, 120], [120, 100]];
    return `
      <circle cx="148" cy="92" r="62" fill="#0e1636" stroke="#c9923a" stroke-width="4"/>
      <circle cx="148" cy="92" r="54" fill="none" stroke="#c9923a" stroke-opacity=".35" stroke-dasharray="2 4"/>
      ${Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return `<line x1="${(148 + Math.cos(a) * 56).toFixed(1)}" y1="${(92 + Math.sin(a) * 56).toFixed(1)}" x2="${(148 + Math.cos(a) * 62).toFixed(1)}" y2="${(92 + Math.sin(a) * 62).toFixed(1)}" stroke="#f3c873" stroke-width="1.5"/>`; }).join('')}
      <polyline points="${pts.map((p) => p.join(',')).join(' ')}" fill="none" stroke="#f3c873" stroke-width="1.4" opacity=".8"/>
      ${pts.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 3 === 0 ? 3.4 : 2.4}" fill="#fff4cf"/><circle cx="${x}" cy="${y}" r="7" fill="#ffd27a" opacity=".15"/>`).join('')}
      ${stars(24, 9, 150, 34).replace(/cx="(\d+(\.\d+)?)"/g, (_, x) => `cx="${(100 + (+x / W) * 96).toFixed(1)}"`)}
      <text x="148" y="172" text-anchor="middle" font-family="ui-monospace,monospace" font-size="12" fill="#f3c873" opacity=".85">P(n,r) = n!/(n−r)!</text>`;
  },

  meteor: () => {
    const rock = (x, y, s, c) => `<path transform="translate(${x} ${y}) scale(${s})" d="M-14 4 L-10 -8 L2 -12 L13 -6 L15 5 L5 12 L-8 11Z" fill="${c}"/><circle cx="${x - 3 * s}" cy="${y - 2 * s}" r="${2.6 * s}" fill="#000" opacity=".25"/><circle cx="${x + 6 * s}" cy="${y + 4 * s}" r="${1.6 * s}" fill="#000" opacity=".25"/>`;
    return `
      <path d="M236 34 L292 70" stroke="#ffe6a8" stroke-width="2.5" stroke-linecap="round" opacity=".9"/>
      <path d="M226 28 L292 70" stroke="#ffb46a" stroke-width="8" stroke-linecap="round" opacity=".18"/>
      <rect x="40" y="76" width="160" height="6" rx="2" fill="#6b4524"/>
      <rect x="40" y="126" width="160" height="6" rx="2" fill="#6b4524"/>
      ${rock(70, 64, 1, '#6d5a52')}${rock(112, 66, 0.8, '#84705f')}
      <rect x="140" y="48" width="26" height="28" rx="4" fill="#bfe8ff" opacity=".18" stroke="#bfe8ff" stroke-opacity=".5"/>
      ${rock(153, 66, 0.5, '#9c7b5c')}
      ${rock(182, 66, 0.9, '#5a4a45')}
      ${rock(66, 114, 1.1, '#7a6455')}${rock(108, 116, 0.7, '#5e4e48')}${rock(150, 114, 1, '#8e735c')}
      <rect x="176" y="100" width="20" height="26" rx="2" fill="#e9d6b0"/><line x1="180" y1="108" x2="192" y2="108" stroke="#7a5420"/><line x1="180" y1="114" x2="190" y2="114" stroke="#7a5420"/>
      <text x="120" y="160" text-anchor="middle" font-family="ui-monospace,monospace" font-size="12" fill="#f3c873" opacity=".85">C(n,r) = P(n,r) ÷ r!</text>`;
  },

  domedoor: () => `
    <path d="M70 150 V78 A55 55 0 0 1 180 78 V150Z" fill="#3a2a1a" stroke="#c9923a" stroke-width="5"/>
    <line x1="125" y1="24" x2="125" y2="150" stroke="#c9923a" stroke-width="3"/>
    ${[50, 80, 110, 140].map((y) => `<circle cx="80" cy="${y}" r="2" fill="#f3c873"/><circle cx="170" cy="${y}" r="2" fill="#f3c873"/>`).join('')}
    <rect x="134" y="88" width="30" height="40" rx="4" fill="#0e1636" stroke="#f3c873"/>
    ${[0, 1, 2].map((r) => [0, 1, 2].map((c) => `<rect x="${138 + c * 8.5}" y="${94 + r * 10}" width="6" height="7" rx="1" fill="#f3c873" opacity="${(r + c) % 2 ? 0.5 : 0.9}"/>`).join('')).join('')}
    <circle cx="149" cy="83" r="2.5" fill="#6fe39a"/>
    <path d="M70 150 H180 L200 172 H50Z" fill="#ffcf7a" opacity=".12"/>
    <rect x="98" y="56" width="20" height="8" rx="2" fill="#f3c873" opacity=".8"/>`
};

/* ---------------- OBJEK RUANG: MISI 2 (bawah laut) ---------------- */
const naraObjects = {
  compass: () => {
    const rose = Array.from({ length: 8 }, (_, i) => {
      const a = (i / 8) * Math.PI * 2 - Math.PI / 2, L = i % 2 ? 20 : 34;
      const x = 118 + Math.cos(a) * L, y = 74 + Math.sin(a) * L;
      const a1 = a + Math.PI / 2, a2 = a - Math.PI / 2;
      return `<path d="M${(118 + Math.cos(a1) * 5).toFixed(1)} ${(74 + Math.sin(a1) * 5).toFixed(1)} L${x.toFixed(1)} ${y.toFixed(1)} L${(118 + Math.cos(a2) * 5).toFixed(1)} ${(74 + Math.sin(a2) * 5).toFixed(1)}Z" fill="${i === 0 ? '#ff7a6b' : i % 2 ? '#8fdde0' : '#e7fbff'}"/>`;
    }).join('');
    return `
      <circle cx="118" cy="74" r="44" fill="#0b2a35" stroke="#5fc6c9" stroke-width="3"/>
      <circle cx="118" cy="74" r="38" fill="none" stroke="#5fc6c9" stroke-opacity=".35" stroke-dasharray="2 3"/>
      ${rose}<circle cx="118" cy="74" r="4" fill="#0b2a35" stroke="#e7fbff"/>
      <path d="M40 150 L56 120 H180 L196 150Z" fill="#1d4a55"/>
      <rect x="64" y="126" width="34" height="16" rx="2" fill="#3ad6c5" opacity=".55"/>
      <rect x="104" y="126" width="34" height="16" rx="2" fill="#3ad6c5" opacity=".3"/>
      <rect x="144" y="126" width="28" height="16" rx="2" fill="#ffcf7a" opacity=".45"/>
      <text x="118" y="22" text-anchor="middle" font-family="ui-monospace,monospace" font-size="12" fill="#8fdde0">n₁ × n₂ × n₃</text>`;
  },

  sonar: (id) => `
    <defs><radialGradient id="${id}sw" cx="0" cy="1" r="1"><stop offset="0" stop-color="#3ad6c5" stop-opacity=".7"/><stop offset="1" stop-color="#3ad6c5" stop-opacity="0"/></radialGradient></defs>
    <rect x="52" y="26" width="140" height="124" rx="10" fill="#0b2a35" stroke="#2c6b74" stroke-width="4"/>
    <circle cx="122" cy="88" r="52" fill="#041318"/>
    ${[14, 28, 42, 52].map((r) => `<circle cx="122" cy="88" r="${r}" fill="none" stroke="#3ad6c5" stroke-opacity=".35"/>`).join('')}
    <line x1="70" y1="88" x2="174" y2="88" stroke="#3ad6c5" stroke-opacity=".25"/><line x1="122" y1="36" x2="122" y2="140" stroke="#3ad6c5" stroke-opacity=".25"/>
    <path d="M122 88 L122 36 A52 52 0 0 1 167 62Z" fill="url(#${id}sw)"/>
    <circle cx="146" cy="58" r="3" fill="#b6fff4"/><circle cx="104" cy="112" r="2.5" fill="#b6fff4" opacity=".6"/><circle cx="150" cy="104" r="2" fill="#b6fff4" opacity=".4"/>
    <text x="122" y="170" text-anchor="middle" font-family="ui-monospace,monospace" font-size="12" fill="#8fdde0">6!/4! = 6 × 5</text>`,

  helm: () => {
    const spokes = Array.from({ length: 8 }, (_, i) => {
      const a = (i / 8) * Math.PI * 2;
      const x1 = 122 + Math.cos(a) * 12, y1 = 86 + Math.sin(a) * 12;
      const x2 = 122 + Math.cos(a) * 62, y2 = 86 + Math.sin(a) * 62;
      return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#b9802f" stroke-width="6" stroke-linecap="round"/>`;
    }).join('');
    return `
      <rect x="114" y="120" width="16" height="32" fill="#2c4a52"/>
      ${spokes}
      <circle cx="122" cy="86" r="44" fill="none" stroke="#8a5f22" stroke-width="9"/>
      <circle cx="122" cy="86" r="44" fill="none" stroke="#e0a54a" stroke-width="3"/>
      <circle cx="122" cy="86" r="13" fill="#e0a54a"/><circle cx="122" cy="86" r="5" fill="#5c3e16"/>
      <text x="122" y="172" text-anchor="middle" font-family="ui-monospace,monospace" font-size="12" fill="#8fdde0">KAPAL → 5!/2!</text>`;
  },

  coral: () => `
    <rect x="40" y="56" width="150" height="94" rx="6" fill="#0d4a63" opacity=".55" stroke="#8fdde0" stroke-width="3"/>
    <rect x="40" y="56" width="150" height="10" fill="#8fdde0" opacity=".2"/>
    <path d="M70 150 V118 M70 128 L58 112 M70 122 L82 104 M82 104 L88 96 M58 112 L54 100" stroke="#ff7aa8" stroke-width="5" stroke-linecap="round" fill="none"/>
    <path d="M118 150 V110 M118 124 L104 106 M118 116 L130 98 M104 106 L100 94 M130 98 L138 92" stroke="#ffb46a" stroke-width="5" stroke-linecap="round" fill="none"/>
    <path d="M160 150 Q150 130 162 120 Q174 130 164 150Z" fill="#7ee081" opacity=".8"/>
    ${fish(140, 80, 0.8)}${bubbles(6, 4, 50, 180).replace(/cy="(\d+(\.\d+)?)"/g, (_, y) => `cy="${(60 + (+y / 160) * 80).toFixed(1)}"`)}
    <g transform="translate(200 104)">
      <rect x="0" y="34" width="40" height="8" fill="#2c4a52"/>
      ${[0, 13, 26].map((x, i) => `<rect x="${x + 2}" y="0" width="9" height="36" rx="4" fill="#e7fbff" opacity=".25" stroke="#e7fbff" stroke-opacity=".6"/><rect x="${x + 3}" y="${16 - i * 4}" width="7" height="${19 + i * 4}" rx="3" fill="${['#ff7aa8', '#3ad6c5', '#ffcf7a'][i]}" opacity=".8"/>`).join('')}
    </g>
    <text x="115" y="44" text-anchor="middle" font-family="ui-monospace,monospace" font-size="12" fill="#8fdde0">semua − yang tidak memenuhi</text>`,

  hatch: () => `
    <circle cx="112" cy="90" r="58" fill="#2c4a52" stroke="#5fc6c9" stroke-width="5"/>
    <circle cx="112" cy="90" r="46" fill="#1d3a42"/>
    ${Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return `<circle cx="${(112 + Math.cos(a) * 52).toFixed(1)}" cy="${(90 + Math.sin(a) * 52).toFixed(1)}" r="2.2" fill="#8fdde0"/>`; }).join('')}
    <circle cx="112" cy="90" r="22" fill="none" stroke="#e0a54a" stroke-width="5"/>
    <line x1="90" y1="90" x2="134" y2="90" stroke="#e0a54a" stroke-width="5"/><line x1="112" y1="68" x2="112" y2="112" stroke="#e0a54a" stroke-width="5"/>
    <circle cx="112" cy="90" r="6" fill="#e0a54a"/>
    <g transform="translate(202 118)">
      <circle r="24" fill="none" stroke="#fff" stroke-width="10"/>
      <circle r="24" fill="none" stroke="#ff5a5a" stroke-width="10" stroke-dasharray="18.85 18.85"/>
    </g>
    <circle cx="206" cy="36" r="5" fill="#ff5a5a"/><circle cx="206" cy="36" r="12" fill="#ff5a5a" opacity=".2"/>`
};

/* ---------------- OBJEK RUANG: MISI 3 (rimba) ---------------- */
const pot = (x, y, w, label, plant = 0) => {
  const plants = [
    `<path d="M${x} ${y} V${y - 18} M${x} ${y - 10} L${x - 8} ${y - 18} M${x} ${y - 14} L${x + 8} ${y - 22}" stroke="#4fa46a" stroke-width="3" stroke-linecap="round"/>`,
    `<ellipse cx="${x}" cy="${y - 12}" rx="7" ry="12" fill="#5fae6e"/><path d="M${x - 3} ${y - 20} l-2 -2 M${x + 3} ${y - 14} l2 -2" stroke="#e8f5e9" stroke-width="1"/>`,
    `<path d="M${x} ${y} V${y - 14}" stroke="#4fa46a" stroke-width="2.5"/><circle cx="${x}" cy="${y - 18}" r="6" fill="#ff7aa8"/><circle cx="${x}" cy="${y - 18}" r="2.2" fill="#ffcf7a"/>`
  ];
  return `${plants[plant % 3]}<path d="M${x - w / 2} ${y} H${x + w / 2} L${x + w / 2 - 4} ${y + 22} H${x - w / 2 + 4}Z" fill="#c26a43"/>
    <rect x="${x - w / 2 - 2}" y="${y - 1}" width="${w + 4}" height="5" rx="1.5" fill="#d98157"/>
    <text x="${x}" y="${y + 17}" text-anchor="middle" font-family="ui-monospace,monospace" font-size="10" font-weight="700" fill="#fff3e6">${label}</text>`;
};

const sekarObjects = {
  pots: () => `
    <rect x="36" y="86" width="190" height="5" rx="2" fill="#7a5130"/>
    <rect x="36" y="138" width="190" height="5" rx="2" fill="#7a5130"/>
    <rect x="40" y="86" width="4" height="64" fill="#5c3e22"/><rect x="218" y="86" width="4" height="64" fill="#5c3e22"/>
    ${pot(62, 64, 26, '1', 0)}${pot(102, 64, 26, '2', 1)}${pot(142, 64, 26, '3', 2)}${pot(182, 64, 26, '4', 0)}
    ${pot(82, 116, 26, '5', 2)}${pot(122, 116, 26, '6', 1)}${pot(162, 116, 26, '7', 0)}
    <g transform="translate(100 8)"><rect width="62" height="26" rx="5" fill="#0f1f18" stroke="#ff7aa8"/>
      <text x="31" y="18" text-anchor="middle" font-family="ui-monospace,monospace" font-size="13" fill="#ff9dbd">_ _ 2</text></g>`,

  tree: () => {
    // pohon bercabang 1 → 2 → 6 (diagram faktorial)
    const L1 = [[124, 116]], L2 = [[90, 84], [158, 84]];
    const L3 = [[64, 50], [90, 46], [116, 50], [132, 50], [158, 46], [184, 50]];
    const br = (a, b, w) => `<path d="M${a[0]} ${a[1]} Q${(a[0] + b[0]) / 2} ${a[1] - 6} ${b[0]} ${b[1]}" stroke="#7a5130" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
    // digeser ke kiri agar sisi kanan bebas untuk figur tokoh
    return `<g transform="translate(-34 0)">
      <path d="M116 150 Q120 132 124 116 L130 116 Q132 134 138 150Z" fill="#7a5130"/>
      ${L2.map((p) => br(L1[0], p, 6)).join('')}
      ${L3.map((p, i) => br(L2[i < 3 ? 0 : 1], p, 3.5)).join('')}
      ${L3.map(([x, y], i) => `<circle cx="${x}" cy="${y - 6}" r="13" fill="${i % 2 ? '#4fa46a' : '#3f8f5a'}" opacity=".9"/>`).join('')}
      ${L3.map(([x, y]) => `<circle cx="${x + 4}" cy="${y - 10}" r="2.5" fill="#ff7aa8"/>`).join('')}
      <g font-family="ui-monospace,monospace" font-size="10.5" fill="#ffd3e2">
        <text x="210" y="124">1! = 1</text><text x="210" y="92">2! = 2</text><text x="210" y="58">3! = 6</text>
      </g>
      <path d="M206 120 H138 M206 88 H170 M206 54 H200" stroke="#ffd3e2" stroke-opacity=".4" stroke-dasharray="2 3"/></g>`;
  },

  ring: () => {
    const n = 8, cx = 128, cy = 108, rx = 74, ry = 34;
    const flowers = Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2, x = cx + Math.cos(a) * rx, y = cy + Math.sin(a) * ry;
      const col = ['#ff7aa8', '#ffcf7a', '#c79bff', '#ff9d6b'][i % 4];
      return `<path d="M${x.toFixed(1)} ${y.toFixed(1)} v-12" stroke="#3f8f5a" stroke-width="2"/>
        ${[0, 72, 144, 216, 288].map((d) => `<ellipse cx="${(x + Math.cos((d * Math.PI) / 180) * 4).toFixed(1)}" cy="${(y - 14 + Math.sin((d * Math.PI) / 180) * 4).toFixed(1)}" rx="3.4" ry="3.4" fill="${col}"/>`).join('')}
        <circle cx="${x.toFixed(1)}" cy="${(y - 14).toFixed(1)}" r="2" fill="#fff3c4"/>`;
    });
    // gambar bunga belakang dulu (y kecil) agar tumpukan terlihat benar
    const order = [...flowers.keys()].sort((a, b) => Math.sin((a / n) * 2 * Math.PI) - Math.sin((b / n) * 2 * Math.PI));
    return `
      <ellipse cx="${cx}" cy="${cy + 4}" rx="${rx + 12}" ry="${ry + 10}" fill="#4a3424"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${rx + 6}" ry="${ry + 6}" fill="#5e4430"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${rx - 18}" ry="${ry - 10}" fill="#3f8f5a"/>
      <ellipse cx="${cx}" cy="${cy - 2}" rx="10" ry="5" fill="#9fd8ef" opacity=".7"/>
      ${order.map((i) => flowers[i]).join('')}
      <path d="M${cx + rx + 26} ${cy - 30} a14 14 0 1 1 -6 -18" stroke="#ffd3e2" stroke-width="2" fill="none"/>
      <path d="M${cx + rx + 20} ${cy - 48} l2 -6 l4 5" stroke="#ffd3e2" stroke-width="2" fill="none"/>
      <text x="${cx}" y="34" text-anchor="middle" font-family="ui-monospace,monospace" font-size="12" fill="#ffd3e2">(n−1)!</text>`;
  },

  seeds: () => {
    const jar = (x, c, lvl) => `
      <rect x="${x}" y="64" width="40" height="64" rx="8" fill="#e8f5e9" opacity=".14" stroke="#e8f5e9" stroke-opacity=".55" stroke-width="2"/>
      <rect x="${x + 3}" y="${128 - lvl}" width="34" height="${lvl - 3}" rx="5" fill="${c}"/>
      ${Array.from({ length: 6 }, (_, i) => `<circle cx="${x + 8 + (i % 3) * 12}" cy="${128 - lvl + 6 + Math.floor(i / 3) * 8}" r="2" fill="#000" opacity=".18"/>`).join('')}
      <rect x="${x - 2}" y="56" width="44" height="10" rx="3" fill="#8a5f3a"/>`;
    return `
      <rect x="30" y="128" width="210" height="6" rx="2" fill="#7a5130"/>
      ${jar(40, '#e0525e', 40)}${jar(92, '#f2c14e', 52)}${jar(144, '#7a5ab8', 30)}${jar(196, '#6fae5a', 46)}
      ${[0, 1, 2, 3, 4, 5].map((i) => `<ellipse cx="${60 + i * 30}" cy="${160 + (i % 2) * 6}" rx="3" ry="2" fill="${['#e0525e', '#f2c14e', '#6fae5a'][i % 3]}"/>`).join('')}
      <text x="140" y="38" text-anchor="middle" font-family="ui-monospace,monospace" font-size="12" fill="#ffd3e2">C(a,x) × C(b,y)</text>`;
  },

  gate: () => `
    <path d="M78 150 V74 A54 54 0 0 1 186 74 V150Z" fill="#14261d"/>
    <path d="M90 150 V78 A42 42 0 0 1 174 78 V150Z" fill="#fff1c4" opacity=".22"/>
    <path d="M78 150 V74 A54 54 0 0 1 186 74 V150" stroke="#7a5130" stroke-width="10" fill="none"/>
    <path d="M70 150 Q76 110 72 80 Q84 40 120 26 Q160 20 182 46 Q196 70 188 110 Q184 132 194 150" stroke="#5c3e22" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M84 150 Q92 126 84 104 M178 150 Q170 120 182 96 M100 34 Q110 52 96 66 M160 32 Q150 50 166 62" stroke="#5c3e22" stroke-width="3" fill="none" stroke-linecap="round"/>
    ${leaf(70, 92, 1, -40)}${leaf(180, 70, 1, 220, '#4fa46a')}${leaf(110, 30, 0.9, -10)}${leaf(156, 30, 0.9, 190, '#4fa46a')}${leaf(186, 120, 0.9, 200)}
    <circle cx="132" cy="58" r="9" fill="#ff7aa8"/><circle cx="132" cy="58" r="3.5" fill="#ffcf7a"/>
    <rect x="152" y="98" width="16" height="22" rx="3" fill="#0f1f18" stroke="#ff7aa8"/>
    <circle cx="160" cy="106" r="3" fill="#ff7aa8"/><rect x="158.5" y="108" width="3" height="7" fill="#ff7aa8"/>
    <path d="M90 150 H174 L196 172 H68Z" fill="#fff1c4" opacity=".1"/>`
};

/* ---------------- ADEGAN UTAMA ---------------- */
const heroes = {
  /* kartu misi 1 (Irwan): observatorium di bukit saat senja */
  'dara-hero': (id) => `
    <defs>${duskDefs(id)}</defs>${duskSky(id, 3)}
    <path d="M0 138 Q60 112 140 120 Q210 126 320 116 V180 H0Z" fill="#2b1d3f"/>
    <rect x="128" y="88" width="64" height="34" fill="#3d2c55"/>
    <path d="M124 90 A36 36 0 0 1 196 90Z" fill="#e6dcef"/>
    <path d="M124 90 A36 36 0 0 1 196 90" fill="none" stroke="#c9923a" stroke-width="2"/>
    <path d="M156 56 L166 56 L166 90 L156 90Z" fill="#2b1d3f"/>
    <line x1="161" y1="70" x2="186" y2="46" stroke="#b9802f" stroke-width="5" stroke-linecap="round"/>
    <rect x="152" y="104" width="14" height="18" rx="2" fill="#ffcf7a"/>
    <rect x="136" y="98" width="10" height="8" fill="#ffcf7a" opacity=".7"/><rect x="174" y="98" width="10" height="8" fill="#ffcf7a" opacity=".7"/>
    <path d="M0 160 Q90 146 170 156 T320 152 V180 H0Z" fill="#170f27"/>`,

  /* kartu misi 2 (Harry): kubah kaca di dasar laut */
  'nara-hero': (id) => `
    <defs>${seaDefs(id)}<radialGradient id="${id}glow"><stop offset="0" stop-color="#ffe6a8" stop-opacity=".55"/><stop offset="1" stop-color="#ffe6a8" stop-opacity="0"/></radialGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#${id}sea)"/>
    <path d="M60 0 L110 180 H140 L95 0Z M180 0 L240 180 H262 L208 0Z" fill="url(#${id}ray)"/>
    ${bubbles(22, 7)}${fish(40, 50)}${fish(262, 40, 0.8, true)}${fish(280, 70, 0.6, true)}
    <circle cx="160" cy="130" r="70" fill="url(#${id}glow)"/>
    <path d="M100 150 A60 60 0 0 1 220 150Z" fill="#bff6ff" opacity=".18" stroke="#bff6ff" stroke-width="2.5"/>
    <path d="M160 90 V150 M130 98 Q140 120 140 150 M190 98 Q180 120 180 150 M104 130 H216 M116 110 H204" stroke="#bff6ff" stroke-opacity=".45" fill="none"/>
    <rect x="146" y="128" width="28" height="22" rx="2" fill="#ffcf7a" opacity=".55"/>
    <path d="M0 150 Q60 140 120 150 T240 146 T320 150 V180 H0Z" fill="#c9a86a" opacity=".55"/>
    <path d="M0 162 Q80 154 160 162 T320 160 V180 H0Z" fill="#8c7046" opacity=".6"/>
    <path d="M30 160 V140 M30 148 L22 136 M30 146 L38 132" stroke="#ff7aa8" stroke-width="4" stroke-linecap="round" fill="none"/>
    <path d="M270 162 V136 M270 148 L282 130 M270 152 L262 140" stroke="#ffb46a" stroke-width="4" stroke-linecap="round" fill="none"/>`,

  /* kartu misi 3 (Suprapto): rumah kaca berkubah di tepi hutan saat matahari sore */
  'sekar-hero': (id) => `
    <defs>
      <linearGradient id="${id}sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffcf8a"/><stop offset=".55" stop-color="#f3a27a"/><stop offset="1" stop-color="#b9707a"/></linearGradient>
      <radialGradient id="${id}sn"><stop offset="0" stop-color="#fff4cf"/><stop offset=".4" stop-color="#ffe0a0" stop-opacity=".8"/><stop offset="1" stop-color="#ffd08a" stop-opacity="0"/></radialGradient>
      <linearGradient id="${id}gl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8fff0" stop-opacity=".55"/><stop offset="1" stop-color="#9fd8a8" stop-opacity=".25"/></linearGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#${id}sk)"/>
    <circle cx="70" cy="70" r="60" fill="url(#${id}sn)"/>
    ${[[-10, 150, 34], [24, 142, 26], [250, 146, 30], [290, 138, 38], [330, 150, 30]].map(([x, y, r]) => `<path d="M${x} ${y} L${x + r * 0.5} ${y - r * 2.4} L${x + r} ${y}Z" fill="#2f5a3e"/>`).join('')}
    ${[[40, 152, 22], [212, 150, 24], [270, 156, 20]].map(([x, y, r]) => `<path d="M${x} ${y} L${x + r * 0.5} ${y - r * 2.2} L${x + r} ${y}Z" fill="#1f4430"/>`).join('')}
    <path d="M0 150 Q80 140 160 146 T320 144 V180 H0Z" fill="#2a4a33"/>
    <rect x="104" y="112" width="112" height="36" fill="url(#${id}gl)" stroke="#e8fff0" stroke-width="2"/>
    <path d="M104 112 A56 50 0 0 1 216 112Z" fill="url(#${id}gl)" stroke="#e8fff0" stroke-width="2.5"/>
    <path d="M160 62 V148 M132 70 Q140 90 132 112 M188 70 Q180 90 188 112 M110 94 H210 M104 130 H216 M132 112 V148 M188 112 V148" stroke="#e8fff0" stroke-opacity=".6" fill="none"/>
    ${leaf(116, 140, 1.1, -60)}${leaf(196, 142, 1, 240, '#4fa46a')}${leaf(150, 100, 0.9, -30, '#4fa46a')}
    <circle cx="176" cy="126" r="4" fill="#ff7aa8"/><circle cx="140" cy="132" r="3.5" fill="#ffcf7a"/>
    <rect x="150" y="128" width="20" height="20" fill="#5c3e22"/>
    <path d="M0 166 Q90 158 170 166 T320 162 V180 H0Z" fill="#1d3626"/>`,

  /* layar judul: observatorium di atas, kubah bawah laut di bawah garis air */
  title: (id) => `
    <defs>${duskDefs(id)}${seaDefs(id)}</defs>
    <rect width="${W}" height="96" fill="url(#${id}sky)"/>${stars(40, 5, 70)}
    <circle cx="240" cy="96" r="54" fill="url(#${id}sun)"/>
    <path d="M0 96 Q30 70 70 62 Q110 58 140 96Z" fill="#2b1d3f"/>
    <path d="M62 64 A14 14 0 0 1 90 64Z" fill="#e6dcef"/><rect x="62" y="64" width="28" height="10" fill="#3d2c55"/>
    <line x1="78" y1="56" x2="90" y2="46" stroke="#b9802f" stroke-width="3" stroke-linecap="round"/>
    <path d="M250 96 Q262 78 286 76 Q306 76 320 86 V96Z" fill="#2a4a33"/>
    <path d="M276 78 A13 12 0 0 1 302 78Z" fill="#c9f0d2" opacity=".75" stroke="#e8fff0" stroke-width="1"/>
    <path d="M289 66 V78" stroke="#e8fff0" stroke-opacity=".7" stroke-width=".8"/>
    <path d="M262 84 L266 72 L270 84Z M308 84 L312 70 L316 84Z" fill="#1f4430"/>
    <rect x="0" y="96" width="${W}" height="84" fill="url(#${id}sea)"/>
    <path d="M0 96 Q20 93 40 96 T80 96 T120 96 T160 96 T200 96 T240 96 T280 96 T320 96" stroke="#ffcf7a" stroke-opacity=".6" fill="none"/>
    <path d="M200 96 L230 180 H250 L222 96Z" fill="url(#${id}ray)"/>
    ${bubbles(14, 11, 150, 320).replace(/cy="(\d+(\.\d+)?)"/g, (_, y) => `cy="${(100 + (+y / 160) * 70).toFixed(1)}"`)}
    <path d="M190 172 A34 34 0 0 1 258 172Z" fill="#bff6ff" opacity=".2" stroke="#bff6ff" stroke-width="2"/>
    <rect x="216" y="158" width="16" height="14" fill="#ffcf7a" opacity=".55"/>
    ${fish(120, 130, 0.9)}${fish(290, 120, 0.7, true)}
    <path d="M0 172 Q80 164 160 172 T320 170 V180 H0Z" fill="#8c7046" opacity=".7"/>`,

  vault: (id) => `
    <defs><linearGradient id="${id}bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1e1a3c"/><stop offset="1" stop-color="#0b0a18"/></linearGradient>
      <linearGradient id="${id}steel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8b8fa8"/><stop offset="1" stop-color="#3c3f55"/></linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#${id}bg)"/>
    <rect x="90" y="24" width="140" height="132" rx="10" fill="url(#${id}steel)" stroke="#1c1d2c" stroke-width="3"/>
    <rect x="100" y="34" width="120" height="112" rx="6" fill="none" stroke="#c7cad8" stroke-opacity=".35"/>
    <circle cx="160" cy="90" r="34" fill="#2b2d40" stroke="#f5b942" stroke-width="3"/>
    ${Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2 - Math.PI / 2; return `<text x="${(160 + Math.cos(a) * 25).toFixed(1)}" y="${(94 + Math.sin(a) * 25).toFixed(1)}" text-anchor="middle" font-family="ui-monospace,monospace" font-size="8" fill="#f5b942">${i}</text>`; }).join('')}
    <circle cx="160" cy="90" r="10" fill="#f5b942"/><line x1="160" y1="90" x2="160" y2="72" stroke="#2b2d40" stroke-width="3"/>
    <rect x="212" y="78" width="10" height="24" rx="3" fill="#c7cad8"/>
    <circle cx="118" cy="44" r="3" fill="#ff6b7a"/>
    <ellipse cx="160" cy="162" rx="80" ry="6" fill="#000" opacity=".35"/>`
};

/* ---------------- REGISTRI ---------------- */
const ROOMS = {
  ...Object.fromEntries(Object.entries(daraObjects).map(([k, f]) => [`dara-${k}`, (id, seed) => observatoryRoom(id, seed) + f(id)])),
  ...Object.fromEntries(Object.entries(naraObjects).map(([k, f]) => [`nara-${k}`, (id, seed) => hullRoom(id, seed) + f(id)])),
  // latar rumah kaca lebih terang → beri garis tepi gelap pada teks agar tetap terbaca
  ...Object.fromEntries(Object.entries(sekarObjects).map(([k, f]) => [`sekar-${k}`, (id, seed) =>
    greenhouseRoom(id, seed) + f(id).replace(/<text /g, '<text stroke="#0f1f18" stroke-width="3" paint-order="stroke" ')]))
};
const ALL = { ...ROOMS, ...heroes };

/** Opsional: ganti adegan tertentu dengan gambar raster, mis. { 'dara-telescope': 'assets/teleskop.webp' } */
export const sceneImage = {};

export function scene(key, { cls = '', label = '' } = {}) {
  if (sceneImage[key]) {
    return `<img class="scene ${cls}" src="${sceneImage[key]}" alt="${label}" ${label ? '' : 'aria-hidden="true"'}>`;
  }
  const f = ALL[key];
  if (!f) return '';
  const id = `sc${++uid}`;
  let seed = 0;
  for (const ch of key) seed = (seed * 31 + ch.charCodeAt(0)) % 997;
  return `<svg class="scene ${cls}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'} xmlns="http://www.w3.org/2000/svg">${f(id, seed)}</svg>`;
}

export const SCENE_KEYS = Object.keys(ALL);
