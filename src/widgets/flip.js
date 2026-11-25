/* Kartu memori: buka dua kartu, cocokkan pasangan. layer: { prompt, pairs:[[a,b],...] }
   Salah buka bukan "salah jawab" (sifat permainan ingatan), jadi tidak memanggil api.wrong. */
export function flip(el, L, api) {
  const deck = [];
  L.pairs.forEach((p, g) => { deck.push({ v: p[0], g }); deck.push({ v: p[1], g }); });
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  el.innerHTML = `
    <p class="qtext">${L.prompt || 'Buka dua kartu dan cocokkan pasangannya.'}</p>
    <div class="fgrid">
      ${deck.map((d, i) => `<button class="fcard" data-g="${d.g}" data-i="${i}" aria-label="Kartu tertutup"><span class="face">${d.v}</span></button>`).join('')}
    </div>`;
  let open = [], matched = 0, busy = false;
  el.querySelectorAll('.fcard').forEach((c) => {
    c.onclick = () => {
      if (busy || c.classList.contains('open') || c.classList.contains('matched')) return;
      c.classList.add('open');
      c.setAttribute('aria-label', c.textContent);
      api.progress();
      open.push(c);
      if (open.length < 2) return;
      busy = true;
      const [a, b] = open;
      if (a.dataset.g === b.dataset.g) {
        setTimeout(() => {
          a.classList.add('matched'); b.classList.add('matched');
          a.disabled = b.disabled = true;
          open = []; busy = false; matched++;
          if (matched === L.pairs.length) api.correct();
        }, 300);
      } else {
        setTimeout(() => {
          a.classList.remove('open'); b.classList.remove('open');
          a.setAttribute('aria-label', 'Kartu tertutup'); b.setAttribute('aria-label', 'Kartu tertutup');
          open = []; busy = false;
        }, 700);
      }
    };
  });
}
