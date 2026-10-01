// ===== TIMELINE (v0.4) : Big Bang → matière → étoiles → galaxies → planètes → vie =====
(function () {
const M = CU.Modes, TAU = 6.2832, clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const ERAS = [
  { e: '💥', n: 'BIG BANG', d: 'Il y a 13,8 milliards d\'années', t: 'Une singularité infiniment chaude et dense se dilate. Espace, temps et énergie apparaissent.' },
  { e: '⚛', n: 'MATIÈRE', d: 'De 1 µs à 380 000 ans', t: 'Les quarks forment protons et neutrons, puis les premiers noyaux. En refroidissant, l\'univers crée les atomes d\'hydrogène et d\'hélium.' },
  { e: '⭐', n: 'ÉTOILES', d: 'Il y a ~13,6 milliards d\'années', t: 'Des nuages de gaz s\'effondrent sous leur gravité. La fusion nucléaire s\'allume : les premières étoiles brillent.' },
  { e: '🌀', n: 'GALAXIES', d: 'Il y a ~13,5 → 10 milliards d\'années', t: 'Étoiles, gaz et matière noire s\'assemblent en galaxies qui tournent, fusionnent et s\'organisent en amas.' },
  { e: '🪐', n: 'PLANÈTES', d: 'Il y a ~4,6 milliards d\'années', t: 'Dans le disque de poussière autour d\'une jeune étoile, des grains s\'agglomèrent : planètes, lunes et astéroïdes naissent.' },
  { e: '🧬', n: 'VIE', d: 'Il y a ~3,8 milliards d\'années', t: 'Sur une planète aux océans tièdes, des molécules s\'assemblent, se copient et forment les premières cellules.' }
];
const SC = [[150, 200, 255], [255, 255, 255], [255, 225, 140], [255, 130, 90]]; // bleue, blanche, jaune, rouge
let S = null;

function sprite(c) { const k = document.createElement('canvas'); k.width = k.height = 32; const x = k.getContext('2d'), g = x.createRadialGradient(16, 16, 0, 16, 16, 16);
  g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.25, `rgba(${c[0]},${c[1]},${c[2]},.6)`); g.addColorStop(1, `rgba(${c[0]},${c[1]},${c[2]},0)`); x.fillStyle = g; x.fillRect(0, 0, 32, 32); return k; }

CU.Modes.register('tl', {
  open(c) {
    const ui = c.ui, N = CU.mobile ? 190 : 320;
    S = { c, v: 0, tv: 0, play: false, t: 0, P: [], spr: SC.map(sprite), era: -1 };
    for (let i = 0; i < N; i++) S.P.push({ a: Math.random() * TAU, r: Math.pow(Math.random(), 0.7), k: Math.random() * 4 | 0, big: Math.random(), ph: Math.random() * TAU, w: 1 + Math.random() * 2 });
    M.el('div', 'tl', '<b>Timeline</b><span>Glisse la frise pour voyager dans le temps</span>', ui);
    const pn = M.el('div', 'pn', null, ui);
    S.n = M.el('div', 'etn', '', pn); S.d = M.el('div', 'etd', '', pn); S.x = M.el('div', 'ett', '', pn);
    S.sl = M.el('input', 'tls', null, pn); S.sl.type = 'range'; S.sl.min = 0; S.sl.max = 1000; S.sl.value = 0;
    S.sl.oninput = () => { S.play = false; S.pb.textContent = '▶'; S.tv = S.sl.value / 1000; };
    const row = M.el('div', 'row', null, pn);
    S.pb = M.el('button', 'chip', '▶', row); S.pb.onclick = () => { if (S.tv >= 0.999) S.tv = 0; S.play = !S.play; S.pb.textContent = S.play ? '❚❚' : '▶'; };
    S.ebs = ERAS.map((E, i) => { const b = M.el('button', 'chip', E.e, row); b.onclick = () => { S.play = false; S.pb.textContent = '▶'; S.tv = i / 5; }; return b; });
    S.lk = M.el('button', 'chip go', '', pn); S.lk.onclick = () => { const t = S.lkTo; if (t) M.go(t); };
    this.setEra(0);
  },
  setEra(i) {
    S.era = i; const E = ERAS[i]; S.n.textContent = E.e + ' ' + E.n; S.d.textContent = E.d; S.x.textContent = E.t;
    S.ebs.forEach((b, j) => b.classList.toggle('on', j === i));
    S.lkTo = i === 2 ? 'bh' : i === 5 ? 'life' : ''; S.lk.style.display = S.lkTo ? 'block' : 'none';
    S.lk.textContent = i === 2 ? '⚫ Explorer les trous noirs nés des étoiles massives' : '🧬 Explorer la vie : ADN, cellule, évolution';
  },
  resize() {},
  close() { S = null; },
  frame(dt) {
    const { c } = S, ctx = c.ctx, w = c.size.w, h = c.size.h, cx = w / 2, cy = h * 0.34, m = Math.min(w, h * 0.7), d = dt / 1000;
    S.t += d;
    if (S.play) { S.tv = Math.min(1, S.tv + d / 30); if (S.tv >= 1) { S.play = false; S.pb.textContent = '▶'; } }
    S.v += (S.tv - S.v) * 0.1; S.sl.value = S.v * 1000;
    const f = S.v * 5, era = Math.min(5, Math.round(f)); if (era !== S.era) this.setEra(era);
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; ctx.fillStyle = '#02000c'; ctx.fillRect(0, 0, w, h);
    // lueur centrale du Big Bang
    const bang = clamp(1 - f / 1.4, 0, 1), cr = m * (0.1 + 0.55 * bang);
    if (bang > 0.01) { const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr); g.addColorStop(0, `rgba(255,255,255,${0.95 * bang})`); g.addColorStop(0.35, `rgba(255,200,120,${0.6 * bang})`); g.addColorStop(1, 'rgba(255,80,160,0)'); ctx.fillStyle = g; ctx.fillRect(cx - cr, cy - cr, cr * 2, cr * 2); }
    // expansion, spirale, aplatissement
    const ex = m * (0.16 + 0.42 * Math.pow(S.v, 0.45)) * (f < 1 ? 0.45 + 0.55 * f : 1), tw = clamp((f - 2.3) / 1.2, 0, 1), flat = clamp((f - 2.6) / 1.4, 0, 1) * 0.62;
    const galA = 1 - clamp((f - 3.6) / 0.6, 0, 1), sysA = clamp((f - 3.7) / 0.6, 0, 1), life = clamp((f - 4.7) / 0.3, 0, 1);
    ctx.globalCompositeOperation = 'lighter';
    if (galA > 0.01) {
      const P = S.P, tilt = 1 - flat;
      for (let i = 0; i < P.length; i++) {
        const p = P[i], a = p.a + tw * p.r * 5 + S.t * 0.06 * (1 - p.r) * clamp(f - 2.5, 0, 1), r = p.r * ex;
        const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r * tilt, tl = 0.55 + 0.45 * Math.sin(S.t * p.w + p.ph);
        let k = f < 1 ? 1 : f < 2 ? (p.k & 1) * 2 : p.k, sz = 1.4;
        if (f >= 2) sz += p.big * 2.4 * clamp((f - 2) * 1.5, 0, 1);
        ctx.globalAlpha = tl * galA * (f < 2 ? 0.75 : 0.9);
        const img = S.spr[k], g = sz * (f < 1 ? 3 : 4);
        ctx.drawImage(img, x - g, y - g, g * 2, g * 2);
      }
      // noyau galactique
      if (f > 2.6) { const a = clamp((f - 2.6) / 1, 0, 1) * galA, g = ctx.createRadialGradient(cx, cy, 0, cx, cy, m * 0.16); g.addColorStop(0, `rgba(255,225,170,${0.7 * a})`); g.addColorStop(1, 'rgba(255,180,120,0)'); ctx.globalAlpha = 1; ctx.fillStyle = g; ctx.fillRect(cx - m * 0.16, cy - m * 0.16, m * 0.32, m * 0.32); }
    }
    // système planétaire puis vie
    if (sysA > 0.01) {
      ctx.globalAlpha = sysA; const R = m * 0.44, s0 = m * 0.07;
      ctx.drawImage(S.spr[2], cx - s0 * 2, cy - s0 * 2, s0 * 4, s0 * 4); ctx.drawImage(S.spr[1], cx - s0, cy - s0, s0 * 2, s0 * 2);
      const O = [[0.3, 4, '#c8a070', 1.6], [0.5, 6, '#ffb060', 1.1], [0.72, 7, '#3a8cff', 0.8], [1, 9, '#d06a4a', 0.55]];
      ctx.globalCompositeOperation = 'source-over';
      for (let i = 0; i < O.length; i++) {
        const o = O[i], rr = R * o[0], a = S.t * o[3] * 0.5 + i * 1.7, px = cx + Math.cos(a) * rr, py = cy + Math.sin(a) * rr * 0.45;
        ctx.globalAlpha = sysA * 0.25; ctx.strokeStyle = '#7fe8ff'; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(cx, cy, rr, rr * 0.45, 0, 0, TAU); ctx.stroke();
        ctx.globalAlpha = sysA; ctx.fillStyle = o[2]; ctx.beginPath(); ctx.arc(px, py, o[1], 0, TAU); ctx.fill();
        if (i === 2 && life > 0) {   // la Terre : taches vertes + étincelles de vie
          ctx.globalAlpha = life; ctx.fillStyle = '#4fdc7a';
          ctx.beginPath(); ctx.arc(px - 2, py - 1, 3.2, 0, TAU); ctx.arc(px + 3, py + 2, 2.2, 0, TAU); ctx.fill();
          ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = '#7dffb0'; ctx.globalAlpha = life * (0.4 + 0.3 * Math.sin(S.t * 3)); ctx.beginPath(); ctx.arc(px, py, 14 + Math.sin(S.t * 3) * 3, 0, TAU); ctx.stroke();
          for (let k = 0; k < 6; k++) { const q = S.t * 1.3 + k * 1.05, rr2 = 18 + 8 * Math.sin(q * 1.7 + k); ctx.globalAlpha = life * 0.8; ctx.fillStyle = '#9dffc0'; ctx.fillRect(px + Math.cos(q) * rr2, py + Math.sin(q) * rr2, 2, 2); }
          ctx.globalCompositeOperation = 'source-over';
        }
      }
    }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  }
});
})();
