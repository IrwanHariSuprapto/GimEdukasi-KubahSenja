/* Isian angka. layer: { q, ans:number } */
export function short(el, L, api) {
  el.innerHTML = `
    <p class="qtext">${L.q}</p>
    <form class="short">
      <input class="input" id="ans" inputmode="numeric" autocomplete="off" placeholder="?" aria-label="Jawaban">
      <button class="btn" type="submit">Buka Kunci</button>
    </form>`;
  const inp = el.querySelector('#ans');
  el.querySelector('form').onsubmit = (e) => {
    e.preventDefault();
    const raw = inp.value.trim().replace(/[.\s]/g, '');
    if (!raw) return;
    if (Number(raw) === L.ans) { inp.disabled = true; api.correct(); }
    else { inp.select(); api.wrong(); }
  };
  setTimeout(() => inp.focus(), 50);
}
