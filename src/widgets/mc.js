/* Pilihan ganda. layer: { q, opts:[html], ans:index } */
export function mc(el, L, api) {
  el.innerHTML = `
    <p class="qtext">${L.q}</p>
    <div class="opts">
      ${L.opts.map((o, i) => `<button class="opt" data-i="${i}"><span class="key">${'ABCDE'[i]}</span><span>${o}</span></button>`).join('')}
    </div>`;
  const btns = [...el.querySelectorAll('.opt')];
  btns.forEach((b) => {
    b.onclick = () => {
      const i = +b.dataset.i;
      if (i === L.ans) {
        b.classList.add('correct');
        btns.forEach((x) => (x.disabled = true));
        api.correct();
      } else {
        b.classList.add('wrong');
        b.disabled = true;
        api.wrong();
      }
    };
  });
}
