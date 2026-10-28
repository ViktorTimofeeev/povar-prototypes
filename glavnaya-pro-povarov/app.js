/* Переключение вариантов: вкладка сверху, номер в адресе (#v1…#v6). */
const $ = s => document.querySelector(s);
const N = document.querySelectorAll('.scr').length;

function setVariant(v) {
  document.querySelectorAll('.scr').forEach(s => { s.hidden = +s.dataset.screen !== v; });
  document.querySelectorAll('.vtab').forEach(b => b.classList.toggle('on', +b.dataset.v === v));
  $('#scroll').scrollTop = 0;
  history.replaceState(null, '', '#v' + v);
  const tab = document.querySelector(`.vtab[data-v="${v}"]`);
  tab && tab.scrollIntoView({ inline: 'center', block: 'nearest' });
}

document.addEventListener('click', e => {
  const t = e.target.closest('[data-v]');
  if (t) setVariant(+t.dataset.v);
});

const m = location.hash.match(/v(\d)/);
setVariant(m && +m[1] >= 1 && +m[1] <= N ? +m[1] : 1);

/* Точки под слайдами наверху варианта 1. */
document.querySelectorAll('.sk-hero').forEach(h => {
  const box = h.querySelector('.sk-slides'), dots = h.querySelectorAll('.sk-dots i');
  const upd = () => { const i = box.clientWidth ? Math.round(box.scrollLeft / box.clientWidth) : 0; dots.forEach((d, n) => d.classList.toggle('on', n === i)); };
  box.addEventListener('scroll', upd, { passive: true });
  upd();
});
