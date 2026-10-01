// ===== MODES (v0.4) : écrans plein écran Timeline / Trous noirs / Vie, par-dessus la scène Phaser =====
// Un seul mode actif à la fois. Pendant un mode, la boucle Phaser est mise en veille (économie de batterie Android).
window.CU = window.CU || {};
CU.Modes = (function () {
  const reg = {}; let cur = null, raf = 0, last = 0;
  const $ = id => document.getElementById(id);
  const M = {
    size: { w: 0, h: 0, dpr: 1 }, reg,
    register(n, m) { reg[n] = m; },
    el(tag, cls, html, p) { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; if (p) p.appendChild(e); return e; },
    chips(p, labs, sel, cb) {
      const row = M.el('div', 'row', null, p);
      const bs = labs.map((l, i) => { const b = M.el('button', 'chip' + (i === sel ? ' on' : ''), l, row); b.onclick = () => { set(i); cb(i); }; return b; });
      const set = i => bs.forEach((x, j) => x.classList.toggle('on', j === i));
      return set;
    },
    slider(p, lab, min, max, val, cb) {
      const row = M.el('label', 'sl', '<span>' + lab + '</span>', p), r = M.el('input', '', null, row);
      r.type = 'range'; r.min = min; r.max = max; r.step = (max - min) / 255; r.value = val; r.oninput = () => cb(+r.value); return r;
    },
    // Gestes : 1 doigt (down/move/up) · 2 doigts (pinch) · molette
    gesture(cv, h) {
      const P = new Map(); let pd = 0, moved = 0;
      const pos = e => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
      const dist = () => { const a = [...P.values()]; return Math.hypot(a[0][0] - a[1][0], a[0][1] - a[1][1]); };
      cv.onpointerdown = e => {
        try { cv.setPointerCapture(e.pointerId); } catch (x) {}
        const p = pos(e); P.set(e.pointerId, p);
        if (P.size === 2) { pd = dist(); moved = 99; } else { moved = 0; h.down && h.down(p[0], p[1]); }
      };
      cv.onpointermove = e => {
        if (!P.has(e.pointerId)) return;
        const o = P.get(e.pointerId), p = pos(e); P.set(e.pointerId, p);
        if (P.size === 2) { const d = dist(); if (pd && h.pinch) h.pinch(d / pd); pd = d; }
        else { moved += Math.abs(p[0] - o[0]) + Math.abs(p[1] - o[1]); h.move && h.move(p[0], p[1], p[0] - o[0], p[1] - o[1]); }
      };
      const up = e => {
        if (!P.has(e.pointerId)) return; const p = P.get(e.pointerId); P.delete(e.pointerId);
        if (P.size === 0) { pd = 0; h.up && h.up(p[0], p[1], moved < 10); } else pd = 0;
      };
      cv.onpointerup = up; cv.onpointercancel = up;
      cv.onwheel = e => { e.preventDefault(); h.pinch && h.pinch(e.deltaY > 0 ? 0.9 : 1.1); };
    },
    fit() {
      const cv = $('mc'), w = innerWidth, h = innerHeight, d = Math.min(window.devicePixelRatio || 1, CU.Q ? CU.Q.dpr + 0.5 : (CU.mobile ? 1.5 : 2));
      M.size.w = w; M.size.h = h; M.size.dpr = d;
      cv.width = (w * d) | 0; cv.height = (h * d) | 0; cv.style.width = w + 'px'; cv.style.height = h + 'px';
      cv.getContext('2d').setTransform(d, 0, 0, d, 0, 0);
      if (cur && cur.resize) cur.resize();
    },
    open(n) {
      if (cur || !reg[n]) return;
      $('mode').hidden = false; $('mode').dataset.m = n;
      if (CU.game && CU.game.loop) CU.game.loop.sleep();
      $('mui').innerHTML = ''; M.fit();
      cur = reg[n];
      try { cur.open({ cv: $('mc'), ctx: $('mc').getContext('2d'), ui: $('mui'), size: M.size }); }
      catch (e) { console.error(e); M.close(); return; }
      last = performance.now(); raf = requestAnimationFrame(loop);
    },
    close() {
      if (!cur) return;
      cancelAnimationFrame(raf); if (cur.close) cur.close(); cur = null;
      const cv = $('mc'); cv.onpointerdown = cv.onpointermove = cv.onpointerup = cv.onpointercancel = cv.onwheel = null;
      $('mui').innerHTML = ''; $('mode').hidden = true;
      if (CU.game && CU.game.loop) CU.game.loop.wake();
    },
    go(n) { M.close(); M.open(n); }
  };
  function loop(t) { if (!cur) return; raf = requestAnimationFrame(loop); const dt = Math.min(50, t - last); last = t; try { cur.frame(dt, t); } catch (e) { console.error(e); M.close(); } }
  addEventListener('resize', () => { if (cur) M.fit(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !document.body.classList.contains('open')) M.close(); });
  [['m-tl', 'tl'], ['m-bh', 'bh'], ['m-life', 'life'], ['m-ex', 'ex']].forEach(([id, n]) => { const b = $(id); if (b) b.onclick = () => M.open(n); });
  if ($('mx')) $('mx').onclick = () => M.close();
  return M;
})();
