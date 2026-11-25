/* Klasifikasi ke wadah (tap kartu → tap wadah; kartu bisa dipindah).
   layer: { prompt, buckets:[{k,label,sub}], items:[{t,k}] } */
export function classify(el, L, api) {
  const order = [...L.items.keys()].sort(() => Math.random() - 0.5);
  el.innerHTML = `
    <p class="qtext">${L.prompt}</p>
    <div class="chips" id="pool">
      ${order.map((i) => `<button class="chip" data-i="${i}">${L.items[i].t}</button>`).join('')}
    </div>
    <div class="buckets">
      ${L.buckets.map((b) => `
        <div class="bucket" data-k="${b.k}">
          <button class="bucket-head">${b.label}<small>${b.sub || ''}</small></button>
          <div class="drop"></div>
        </div>`).join('')}
    </div>
    <div class="actions"><button class="btn" id="check" disabled>Periksa</button></div>`;

  let sel = null;
  const placed = {};
  const check = el.querySelector('#check');
  const refresh = () => { check.disabled = Object.keys(placed).length !== L.items.length; };

  el.querySelectorAll('.chip').forEach((c) => {
    c.onclick = () => {
      el.querySelectorAll('.chip.sel').forEach((x) => x.classList.remove('sel'));
      sel = c; c.classList.add('sel'); api.progress();
    };
  });
  el.querySelectorAll('.bucket').forEach((b) => {
    const put = () => {
      if (!sel) return;
      placed[+sel.dataset.i] = b.dataset.k;
      b.querySelector('.drop').appendChild(sel);
      sel.classList.remove('sel'); sel.classList.remove('bad'); sel = null;
      refresh();
    };
    b.querySelector('.bucket-head').onclick = put;
    b.querySelector('.drop').onclick = (e) => { if (e.target === e.currentTarget) put(); };
  });
  check.onclick = () => {
    const wrongIdx = L.items.map((it, i) => (placed[i] !== it.k ? i : -1)).filter((i) => i >= 0);
    if (!wrongIdx.length) {
      el.querySelectorAll('.chip').forEach((c) => (c.disabled = true));
      check.disabled = true;
      api.correct();
    } else {
      wrongIdx.forEach((i) => el.querySelector(`.chip[data-i="${i}"]`).classList.add('bad'));
      api.wrong(`${wrongIdx.length} kartu masih di wadah yang salah.`);
    }
  };
}
