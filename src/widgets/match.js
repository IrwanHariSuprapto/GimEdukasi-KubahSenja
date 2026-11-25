/* Menjodohkan: pilih satu di kiri, lalu pasangannya di kanan.
   layer: { prompt, pairs:[[kiri, kanan], ...] } — nilai kanan boleh kembar. */
const COLORS = ['#f5b942', '#3ad6c5', '#ff7aa8', '#8f8cff', '#7ee081'];

export function match(el, L, api) {
  const right = L.pairs.map((p, i) => ({ v: p[1], i }));
  for (let i = right.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [right[i], right[j]] = [right[j], right[i]];
  }
  el.innerHTML = `
    <p class="qtext">${L.prompt || 'Jodohkan tiap bentuk dengan nilainya.'}</p>
    <div class="match">
      <div class="mcol">${L.pairs.map((p, i) => `<button class="mitem" data-side="L" data-i="${i}">${p[0]}</button>`).join('')}</div>
      <div class="mcol">${right.map((r) => `<button class="mitem" data-side="R" data-i="${r.i}">${r.v}</button>`).join('')}</div>
    </div>`;
  let sel = null, done = 0;
  const items = [...el.querySelectorAll('.mitem')];
  items.forEach((b) => {
    b.onclick = () => {
      if (b.classList.contains('done')) return;
      if (b.dataset.side === 'L') {
        items.forEach((x) => x.classList.remove('sel'));
        sel = b; b.classList.add('sel'); api.progress();
        return;
      }
      if (!sel) return;
      const li = +sel.dataset.i, ri = +b.dataset.i;
      if (String(L.pairs[li][1]) === String(L.pairs[ri][1])) {
        const col = COLORS[done % COLORS.length];
        [sel, b].forEach((x) => { x.classList.add('done'); x.classList.remove('sel'); x.style.setProperty('--tag', col); x.disabled = true; });
        sel = null; done++; api.progress();
        if (done === L.pairs.length) api.correct();
      } else {
        sel.classList.remove('sel'); sel = null;
        api.wrong();
      }
    };
  });
}
