// ===== VIE (v0.4) : molécules → ADN → cellule → organisme → évolution =====
// Un génome unique (24 bases A/T/G/C = 6 gènes de 4 bases) relie toutes les étapes : ce que tu modifies dans l'ADN
// change la cellule, l'organisme et la population qui évolue.
(function () {
const M = CU.Modes, TAU = 6.2832, clamp = (v, a, b) => v < a ? a : v > b ? b : v, R = Math.random;
const BASES = 'ATGC', BC = ['#ff5d5d', '#ffd24a', '#4dd7ff', '#7dff8a'];
const TRN = ['Taille', 'Teinte', 'Vitesse', 'Membres', 'Vision', 'Métabolisme'];

// ---------- Génome ----------
CU.Gen = {
  N: 24,
  random() { const b = new Uint8Array(24); for (let i = 0; i < 24; i++) b[i] = R() * 4 | 0; return b; },
  val(b, i) { return b[i * 4] * 64 + b[i * 4 + 1] * 16 + b[i * 4 + 2] * 4 + b[i * 4 + 3]; },
  set(b, i, v) { v = clamp(v | 0, 0, 255); b[i * 4] = v >> 6; b[i * 4 + 1] = (v >> 4) & 3; b[i * 4 + 2] = (v >> 2) & 3; b[i * 4 + 3] = v & 3; },
  mutate(b, n) { const out = []; for (let k = 0; k < n; k++) { const j = R() * 24 | 0; b[j] = (b[j] + 1 + (R() * 3 | 0)) & 3; out.push(j); } return out; },
  clone(b) { return Uint8Array.from(b); },
  pheno(b) {
    const v = i => this.val(b, i) / 255, hue = v(1) * 360;
    return { size: 0.6 + 1.2 * v(0), hue, speed: 0.45 + 1.6 * v(2), limbs: 1 + Math.round(v(3) * 5), vision: 45 + 155 * v(4), metab: 0.6 + 1.2 * v(5),
      c1: `hsl(${hue | 0},70%,52%)`, c2: `hsl(${(hue + 25) % 360 | 0},65%,36%)`, c3: `hsl(${hue | 0},85%,75%)` };
  },
  save(b) { try { localStorage.setItem('cu_genome', Array.from(b).join('')); } catch (e) {} },
  load() { try { const s = localStorage.getItem('cu_genome'); if (s && s.length === 24 && /^[0-3]+$/.test(s)) return Uint8Array.from(s.split('').map(Number)); } catch (e) {} return null; }
};
const G = CU.Gen;
let g = null, ph = null;   // génome courant + phénotype

// ---------- Créature (dessin sans état : serpente selon le temps) ----------
const SX = new Float32Array(16), SY = new Float32Array(16);
function creature(ctx, x, y, ang, p, t, sc, lite) {
  const n = lite ? 4 : 3 + p.limbs, L = 9 * p.size * sc, dx = Math.cos(ang), dy = Math.sin(ang), px = -dy, py = dx, amp = L * 0.3 * (0.5 + 0.25 * p.speed);
  for (let k = 0; k < n; k++) { const w = Math.sin(t * 3 * p.speed - k * 0.7) * amp * (k / n + 0.2); SX[k] = x - dx * k * L * 0.9 + px * w; SY[k] = y - dy * k * L * 0.9 + py * w; }
  if (!lite) {
    ctx.strokeStyle = p.c2; ctx.lineWidth = Math.max(1, L * 0.14); ctx.beginPath();
    for (let k = 1; k <= p.limbs && k < n; k++) for (let s = -1; s <= 1; s += 2) {
      const la = ang + s * (1.25 + 0.45 * Math.sin(t * 6 * p.speed + k * 1.3)); ctx.moveTo(SX[k], SY[k]); ctx.lineTo(SX[k] + Math.cos(la) * L * 1.15, SY[k] + Math.sin(la) * L * 1.15);
    } ctx.stroke();
  }
  for (let k = n - 1; k >= 0; k--) { const r = L * (0.55 + 0.45 * Math.sin((k + 0.6) / (n + 0.2) * 3.14)) * (k === 0 ? 1.05 : 1); ctx.fillStyle = k & 1 ? p.c2 : p.c1; ctx.beginPath(); ctx.arc(SX[k], SY[k], r, 0, TAU); ctx.fill(); }
  if (!lite) { const r = L * 0.6, e = r * (0.22 + p.vision / 700);
    for (let s = -1; s <= 1; s += 2) { const ex = SX[0] + dx * r * 0.45 + px * r * 0.5 * s, ey = SY[0] + dy * r * 0.45 + py * r * 0.5 * s;
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(ex, ey, e, 0, TAU); ctx.fill(); ctx.fillStyle = '#102'; ctx.beginPath(); ctx.arc(ex + dx * e * 0.3, ey + dy * e * 0.3, e * 0.5, 0, TAU); ctx.fill(); } }
}

// ---------- État du mode ----------
let S = null;
const STAGES = ['🧪 Molécules', '🧬 ADN', '🔬 Cellule', '🐛 Organisme', '🌍 Évolution'];
const VAL = [1, 4, 3, 2, 5], RAD = [5, 8, 7.5, 7.5, 9.5], ACOL = ['#e8f4ff', '#9aa0a8', '#5d8bff', '#ff5a5a', '#ffae3a'], SYM = ['H', 'C', 'N', 'O', 'P'];
const SUB = { '0': '₀', '1': '', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉' };
const NAMES = { 'H₂O': 'eau', 'CH₄': 'méthane', 'NH₃': 'ammoniac', 'CO₂': 'dioxyde de carbone', 'CH₂O': 'formaldéhyde', 'HCN': 'acide cyanhydrique', 'CH₃N': 'méthylamine' };

CU.Modes.register('life', {
  open(c) {
    g = g || G.load() || (() => { const b = new Uint8Array(24); [140, 150, 120, 140, 120, 110].forEach((v, i) => G.set(b, i, v)); return b; })(); ph = G.pheno(g);
    S = { c, st: -1, t: 0, f: 0 };
    const ui = c.ui; M.el('div', 'tl', '<b>La Vie</b><span id="lfi"></span>', ui); S.info = ui.querySelector('#lfi');
    const strip = M.el('div', 'strip', null, ui); S.sb = STAGES.map((s, i) => { const b = M.el('button', 'chip', s, strip); b.onclick = () => this.stage(i); return b; });
    S.pn = M.el('div', 'pn', null, ui);
    this.stage(0);
  },
  close() { G.save(g); S = null; },
  resize() { if (S && S.st >= 0) this.stage(S.st); },
  stage(i) {
    G.save(g); S.st = i; S.sb.forEach((b, j) => b.classList.toggle('on', j === i)); S.pn.innerHTML = ''; S.c.cv.onpointerdown = null; S.c.cv.onwheel = null; S.c.cv.onpointermove = null; S.c.cv.onpointerup = null; S.c.cv.onpointercancel = null;
    S.W = S.c.size.w; S.H = S.c.size.h; S.sel = null; ph = G.pheno(g);
    [init0, init1, init2, init3, init4][i]();
  },
  frame(dt) {
    S.t += dt / 1000; S.f++; const d = Math.min(dt, 50) / 1000;
    [f0, f1, f2, f3, f4][S.st](d);
  }
});
const next = (label, to) => { const b = M.el('button', 'chip go', label, S.pn); b.onclick = () => CU.Modes.reg.life.stage(to); return b; };
const say = t => { S.info.textContent = t; };

// ===== 0. MOLÉCULES =====
function init0() {
  const W = S.W, H = S.H, N = CU.mobile ? 44 : 60, W8 = [0.42, 0.6, 0.74, 0.94, 1];
  S.A = []; S.fx = []; S.found = {}; S.hi = 0;
  for (let i = 0; i < N; i++) { const r = R(), t = r < W8[0] ? 0 : r < W8[1] ? 1 : r < W8[2] ? 2 : r < W8[3] ? 3 : 4;
    S.A.push({ t, x: 20 + R() * (W - 40), y: 90 + R() * (H * 0.5), vx: (R() - 0.5) * 40, vy: (R() - 0.5) * 40, fr: VAL[t], nb: [] }); }
  M.el('div', 'hint', 'Soupe primordiale : touche pour lancer un éclair, les atomes s\'assemblent en molécules', S.pn);
  S.prog = M.el('div', 'bar', '<i></i>', S.pn); S.list = M.el('div', 'lst', 'Molécules : —', S.pn);
  M.el('button', 'chip', '⚡ Éclair', S.pn).onclick = () => spark(W * (0.2 + R() * 0.6), H * (0.2 + R() * 0.35));
  S.nx = next('Étape suivante : l\'ADN ▸', 1);
  M.gesture(S.c.cv, { up: (x, y, tap) => { if (tap) spark(x, y); } });
  say('Étape 1/5');
}
function spark(x, y) {
  S.fx.push({ x, y, t: 0 });
  for (const a of S.A) { const dx = a.x - x, dy = a.y - y, d = Math.hypot(dx, dy) || 1; if (d < 130) { const k = 260 * (1 - d / 130); a.vx += dx / d * k; a.vy += dy / d * k; } }
  // l'énergie casse les liaisons les plus tendues → réarrangements
  for (const a of S.A) for (let k = a.nb.length - 1; k >= 0; k--) { const b = S.A[a.nb[k]], dd = Math.hypot(a.x - b.x, a.y - b.y); if (a.nb[k] > S.A.indexOf(a) && dd < 140 && Math.hypot(a.x - x, a.y - y) < 110 && R() < 0.35) unbond(a, b); }
}
function unbond(a, b) { const ia = S.A.indexOf(a), ib = S.A.indexOf(b); a.nb = a.nb.filter(v => v !== ib); b.nb = b.nb.filter(v => v !== ia); a.fr++; b.fr++; }
function f0(d) {
  const { c } = S, ctx = c.ctx, W = S.W, H = S.H, A = S.A, hMax = H * 0.66;
  for (let i = 0; i < A.length; i++) {
    const a = A[i]; a.vx += (R() - 0.5) * 60 * d; a.vy += (R() - 0.5) * 60 * d; a.vx *= 0.985; a.vy *= 0.985; a.x += a.vx * d; a.y += a.vy * d;
    if (a.x < 14) { a.x = 14; a.vx = Math.abs(a.vx); } if (a.x > W - 14) { a.x = W - 14; a.vx = -Math.abs(a.vx); }
    if (a.y < 90) { a.y = 90; a.vy = Math.abs(a.vy); } if (a.y > hMax) { a.y = hMax; a.vy = -Math.abs(a.vy); }
  }
  for (let i = 0; i < A.length; i++) for (let j = i + 1; j < A.length; j++) {
    const a = A[i], b = A[j], dx = b.x - a.x, dy = b.y - a.y, d2 = dx * dx + dy * dy, rr = RAD[a.t] + RAD[b.t];
    if (d2 > 4900) continue; const dist = Math.sqrt(d2) || 0.01, bonded = a.nb.indexOf(j) >= 0;
    if (bonded) { const k = (dist - (rr + 2)) * 6 * d; const fx = dx / dist * k, fy = dy / dist * k; a.vx += fx; a.vy += fy; b.vx -= fx; b.vy -= fy; if (dist > (rr + 2) * 3.2) unbond(a, b); }
    else { if (dist < rr) { const k = (rr - dist) * 8 * d; a.vx -= dx / dist * k; a.vy -= dy / dist * k; b.vx += dx / dist * k; b.vy += dy / dist * k; }
      if (dist < rr + 9 && a.fr > 0 && b.fr > 0 && !(a.t === b.t && (a.t === 0 || a.t === 3 || a.t === 4)) && R() < 0.5) { a.nb.push(j); b.nb.push(i); a.fr--; b.fr--; } }
  }
  if (S.f % 20 === 0) scan();
  // dessin
  ctx.fillStyle = '#031018'; ctx.fillRect(0, 0, W, H); const gr = ctx.createLinearGradient(0, 70, 0, hMax + 30); gr.addColorStop(0, 'rgba(30,120,110,.10)'); gr.addColorStop(1, 'rgba(120,60,30,.22)'); ctx.fillStyle = gr; ctx.fillRect(0, 70, W, hMax - 40);
  ctx.strokeStyle = '#9fb4c8'; ctx.lineWidth = 3; ctx.beginPath();
  for (let i = 0; i < A.length; i++) for (const j of A[i].nb) if (j > i) { ctx.moveTo(A[i].x, A[i].y); ctx.lineTo(A[j].x, A[j].y); } ctx.stroke();
  ctx.font = '9px system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  for (const a of A) { ctx.fillStyle = ACOL[a.t]; ctx.beginPath(); ctx.arc(a.x, a.y, RAD[a.t], 0, TAU); ctx.fill(); ctx.fillStyle = a.t === 0 ? '#234' : '#fff'; ctx.fillText(SYM[a.t], a.x, a.y + 0.5); }
  ctx.globalCompositeOperation = 'lighter';
  for (let i = S.fx.length - 1; i >= 0; i--) { const f = S.fx[i]; f.t += d; if (f.t > 0.7) { S.fx.splice(i, 1); continue; } ctx.globalAlpha = 1 - f.t / 0.7; ctx.strokeStyle = '#ffe680'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(f.x, f.y, f.t * 200, 0, TAU); ctx.stroke(); }
  ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
}
function scan() {
  const A = S.A, seen = new Uint8Array(A.length), cnt = {};
  for (let i = 0; i < A.length; i++) { if (seen[i]) continue; const st = [i], m = [0, 0, 0, 0, 0]; let n = 0; seen[i] = 1;
    while (st.length) { const k = st.pop(); m[A[k].t]++; n++; for (const j of A[k].nb) if (!seen[j]) { seen[j] = 1; st.push(j); } }
    if (n < 2) continue;
    let f = '', name; const add = (s, q) => { if (q) f += s + (q > 1 ? String(q).split('').map(x => SUB[x]).join('') : ''); };
    add('C', m[1]); add('H', m[0]); add('N', m[2]); add('O', m[3]); add('P', m[4]);
    if (n >= 12 && m[4] && m[2] && m[1]) name = 'nucléotide (brique de l\'ADN)'; else if (n >= 8 && m[1] && m[2] && m[3]) name = 'acide aminé (brique des protéines)'; else if (n >= 6 && m[1]) name = 'molécule organique'; else name = NAMES[f] || f;
    cnt[name] = (cnt[name] || 0) + 1; }
  S.found = Object.assign(S.found, Object.keys(cnt).reduce((o, k) => (o[k] = 1, o), {})); const ks = Object.keys(cnt);
  S.list.textContent = ks.length ? 'Molécules : ' + ks.map(k => cnt[k] + '× ' + k).join(' · ') : 'Molécules : —';
  const nf = Object.keys(S.found).length; S.prog.firstChild.style.width = Math.min(100, nf / 4 * 100) + '%'; S.nx.classList.toggle('on', nf >= 4);
  say('Étape 1/5 · ' + nf + ' types découverts' + (nf >= 4 ? ' · prêt pour l\'ADN' : ''));
}

// ===== 1. ADN =====
function init1() {
  S.fl = new Float32Array(24); S.sl = []; S.ang = 0;
  M.el('div', 'hint', 'Touche une base pour la muter · les curseurs réécrivent les gènes', S.pn);
  const row = M.el('div', 'row', null, S.pn);
  M.el('button', 'chip', '🧬 Mutation', row).onclick = () => mut(1);
  M.el('button', 'chip', '☢ Forte', row).onclick = () => mut(6);
  M.el('button', 'chip', '🎲 Hasard', row).onclick = () => { g = G.random(); S.fl.fill(1); sync(); };
  for (let i = 0; i < 6; i++) S.sl.push(M.slider(S.pn, TRN[i], 0, 255, G.val(g, i), v => { G.set(g, i, v); for (let k = 0; k < 4; k++) S.fl[i * 4 + k] = Math.max(S.fl[i * 4 + k], 0.6); ph = G.pheno(g); }));
  S.nx = next('Étape suivante : la cellule ▸', 2);
  M.gesture(S.c.cv, { up: (x, y, tap) => { if (!tap) return; const i = Math.round((y - S.y0) / S.dy); if (i >= 0 && i < 24) { g[i] = (g[i] + 1) & 3; S.fl[i] = 1; ph = G.pheno(g); sync(); } } });
  say('Étape 2/5 · double hélice');
}
function mut(n) { const ix = G.mutate(g, n); ix.forEach(i => { S.fl[i] = 1; }); ph = G.pheno(g); sync(); }
function sync() { for (let i = 0; i < 6; i++) S.sl[i].value = G.val(g, i); ph = G.pheno(g); }
function f1(d) {
  const { c } = S, ctx = c.ctx, W = S.W, H = S.H, cx = W * 0.42, Rr = Math.min(W * 0.22, 70), top = 112, bot = H * 0.5; S.y0 = top; S.dy = (bot - top) / 23; const dy = S.dy;
  S.ang += d * 1.1;
  ctx.fillStyle = '#04030f'; ctx.fillRect(0, 0, W, H); const gr = ctx.createRadialGradient(cx, (top + bot) / 2, 10, cx, (top + bot) / 2, H * 0.45); gr.addColorStop(0, 'rgba(90,40,200,.25)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H);
  const X1 = [], Z1 = [];
  for (let i = 0; i < 24; i++) { const a = S.ang + i * 0.55; X1[i] = Math.cos(a) * Rr; Z1[i] = Math.sin(a); S.fl[i] = Math.max(0, S.fl[i] - d * 1.4); }
  const backbone = (back) => { for (const s of [1, -1]) { ctx.strokeStyle = s > 0 ? '#7a8cff' : '#ff7ad9'; ctx.lineWidth = back ? 2 : 3.4; ctx.globalAlpha = back ? 0.45 : 1;
    for (let i = 0; i < 23; i++) { const z = (Z1[i] + Z1[i + 1]) * 0.5 * s; if ((z < 0) !== back) continue; ctx.beginPath(); ctx.moveTo(cx + X1[i] * s, top + i * dy); ctx.lineTo(cx + X1[i + 1] * s, top + (i + 1) * dy); ctx.stroke(); } } ctx.globalAlpha = 1; };
  const sphere = (i, s, back) => { const z = Z1[i] * s; if ((z < 0) !== back) return; const x = cx + X1[i] * s, y = top + i * dy, r = (3.6 + 2.2 * (z + 1) / 2) * (back ? 0.85 : 1);
    ctx.globalAlpha = back ? 0.6 : 1; ctx.fillStyle = s > 0 ? '#9aa8ff' : '#ffa0e8'; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.globalAlpha = 1; };
  const rung = i => { const y = top + i * dy, xa = cx + X1[i], xb = cx - X1[i], xm = (xa + xb) / 2, b1 = g[i], b2 = b1 ^ 1, w = Math.abs(X1[i]);
    ctx.lineWidth = 4.5; ctx.lineCap = 'round'; ctx.strokeStyle = BC[b1]; ctx.beginPath(); ctx.moveTo(xa, y); ctx.lineTo(xm, y); ctx.stroke(); ctx.strokeStyle = BC[b2]; ctx.beginPath(); ctx.moveTo(xm, y); ctx.lineTo(xb, y); ctx.stroke(); ctx.lineCap = 'butt';
    if (S.fl[i] > 0) { ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = S.fl[i]; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(xm, y, 8 + 14 * (1 - S.fl[i]), 0, TAU); ctx.fill(); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; }
    if (w > Rr * 0.55) { ctx.fillStyle = '#10121c'; ctx.font = '700 8px system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(BASES[b1], (xa + xm) / 2, y + 0.5); ctx.fillText(BASES[b2], (xb + xm) / 2, y + 0.5); } };
  backbone(true); for (let i = 0; i < 24; i++) { sphere(i, 1, true); sphere(i, -1, true); } for (let i = 0; i < 24; i++) rung(i); backbone(false); for (let i = 0; i < 24; i++) { sphere(i, 1, false); sphere(i, -1, false); }
  // étiquettes des gènes
  ctx.font = '600 10px system-ui'; ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
  for (let k = 0; k < 6; k++) { const y0 = top + k * 4 * dy, y1 = top + (k * 4 + 3) * dy, xl = cx - Rr - 14; ctx.strokeStyle = 'rgba(0,240,255,.5)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(xl + 6, y0 - 3); ctx.lineTo(xl + 10, y0 - 3); ctx.lineTo(xl + 10, y1 + 3); ctx.lineTo(xl + 6, y1 + 3); ctx.stroke(); ctx.fillStyle = '#7fe8ff'; ctx.fillText(TRN[k], xl + 2, (y0 + y1) / 2); }
  // aperçu de la créature
  const pr = Math.min(W * 0.17, 60), px = W - pr - 16, py = top + 60; ctx.fillStyle = 'rgba(10,0,40,.55)'; ctx.strokeStyle = 'rgba(0,240,255,.4)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(px, py, pr + 8, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.save(); ctx.beginPath(); ctx.arc(px, py, pr + 8, 0, TAU); ctx.clip(); creature(ctx, px + pr * 0.6, py, Math.PI, ph, S.t, 0.85); ctx.restore();
  ctx.fillStyle = '#9fdcff'; ctx.font = '10px system-ui'; ctx.textAlign = 'center'; ctx.fillText('phénotype', px, py + pr + 22);
}

// ===== 2. CELLULE =====
function init2() {
  const W = S.W, H = S.H; S.cells = [{ x: W / 2, y: H * 0.3, r: Math.min(W, H) * 0.2 * (0.75 + 0.22 * ph.size), g: G.clone(g), div: -1, vx: 0, vy: 0, ph: 0 }];
  S.rib = []; for (let i = 0; i < 40; i++) S.rib.push({ a: R() * TAU, r: R(), s: R() * 2 - 1, w: 0.3 + R() }); S.msg = ''; S.mt = 0;
  M.el('div', 'hint', 'Touche une cellule pour la diviser : chaque division peut muter l\'ADN', S.pn);
  S.nx = next('Étape suivante : l\'organisme ▸', 3);
  M.gesture(S.c.cv, { up: (x, y, tap) => { if (!tap) return; let b = null, bd = 1e9; for (const k of S.cells) { const dd = Math.hypot(k.x - x, k.y - y); if (dd < k.r * 1.1 && dd < bd && k.div < 0 && k.r > 14 && S.cells.length < 14) { b = k; bd = dd; } } if (b) b.div = 0; } });
  say('Étape 3/5 · 1 cellule');
}
function divide(k) {
  const a = R() * TAU, sp = k.r * 0.75, mk = (s) => { const gg = G.clone(k.g); let m = 0; if (R() < 0.35) { G.mutate(gg, 1); m = 1; } return { x: k.x + Math.cos(a) * s * k.r * 0.45, y: k.y + Math.sin(a) * s * k.r * 0.45, r: sp, g: gg, div: -1, vx: Math.cos(a) * s * 12, vy: Math.sin(a) * s * 12, ph: 0, m }; };
  const c1 = mk(1), c2 = mk(-1); const i = S.cells.indexOf(k); S.cells.splice(i, 1, c1, c2);
  if (c1.m || c2.m) { S.msg = '🧬 Mutation pendant la division !'; S.mt = 2.5; }
  say('Étape 3/5 · ' + S.cells.length + ' cellules');
}
function f2(d) {
  const { c } = S, ctx = c.ctx, W = S.W, H = S.H, C = S.cells;
  ctx.fillStyle = '#031218'; ctx.fillRect(0, 0, W, H); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 14; i++) { const x = (i * 97 + S.t * 6 * (i % 3 + 1)) % (W + 40) - 20, y = (i * 61 + S.t * 4) % (H * 0.65) + 70; ctx.fillStyle = 'rgba(80,220,200,.05)'; ctx.beginPath(); ctx.arc(x, y, 14 + i % 4 * 8, 0, TAU); ctx.fill(); } ctx.globalCompositeOperation = 'source-over';
  for (let i = 0; i < C.length; i++) { const k = C[i];
    if (k.div >= 0) { k.div += d / 2.2; if (k.div >= 1) { divide(k); i--; continue; } }
    for (let j = i + 1; j < C.length; j++) { const o = C[j], dx = o.x - k.x, dy = o.y - k.y, dd = Math.hypot(dx, dy) || 1, m = (k.r + o.r) * 0.92; if (dd < m) { const f = (m - dd) * 0.5; k.x -= dx / dd * f; k.y -= dy / dd * f; o.x += dx / dd * f; o.y += dy / dd * f; } }
    k.vx *= 0.96; k.vy *= 0.96; k.x += k.vx * d + Math.sin(S.t + i) * 4 * d; k.y += k.vy * d + Math.cos(S.t * 0.8 + i) * 4 * d; k.x = clamp(k.x, k.r, W - k.r); k.y = clamp(k.y, 90 + k.r, H * 0.66 - k.r * 0.4); }
  for (const k of C) drawCell(ctx, k);
  if (S.mt > 0) { S.mt -= d; ctx.globalAlpha = Math.min(1, S.mt); ctx.fillStyle = '#ffe680'; ctx.font = '600 14px system-ui'; ctx.textAlign = 'center'; ctx.fillText(S.msg, W / 2, H * 0.62); ctx.globalAlpha = 1; }
}
function drawCell(ctx, k) {
  const p = G.pheno(k.g), r = k.r, e = k.div >= 0 ? k.div : 0, st = 1 + e * 0.55, n = 40; ctx.save(); ctx.translate(k.x, k.y); ctx.scale(st, 1 / Math.sqrt(st));
  ctx.beginPath(); for (let i = 0; i <= n; i++) { const a = i / n * TAU, rr = r * (1 + 0.03 * Math.sin(a * 3 + S.t * 1.5) + 0.02 * Math.sin(a * 5 - S.t * 2) - e * 0.25 * Math.pow(Math.cos(a * 2 + 0), 2) * (1 - Math.abs(Math.cos(a)))); i ? ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : ctx.moveTo(rr, 0); }
  const gr = ctx.createRadialGradient(0, 0, r * 0.1, 0, 0, r); gr.addColorStop(0, `hsla(${p.hue | 0},60%,55%,.35)`); gr.addColorStop(1, `hsla(${p.hue | 0},70%,45%,.6)`); ctx.fillStyle = gr; ctx.fill(); ctx.strokeStyle = p.c3; ctx.lineWidth = 2.2; ctx.stroke();
  ctx.save(); ctx.clip();
  ctx.fillStyle = 'rgba(255,255,255,.75)'; for (const b of S.rib) { const a = b.a + S.t * b.w * b.s * 0.3, rr = (0.35 + b.r * 0.6) * r; ctx.fillRect(Math.cos(a) * rr, Math.sin(a) * rr, 1.6, 1.6); }
  const mt = 2 + Math.round(p.metab * 2); ctx.fillStyle = 'rgba(255,170,90,.75)'; ctx.strokeStyle = 'rgba(255,220,160,.9)'; ctx.lineWidth = 1;
  for (let i = 0; i < mt; i++) { const a = i / mt * TAU + S.t * 0.15 + 1, rr = r * 0.62; ctx.beginPath(); ctx.ellipse(Math.cos(a) * rr, Math.sin(a) * rr, r * 0.12, r * 0.06, a + 1.2, 0, TAU); ctx.fill(); ctx.stroke(); }
  const nr = r * 0.32; const ng = ctx.createRadialGradient(0, 0, 0, 0, 0, nr); ng.addColorStop(0, 'rgba(160,120,255,.95)'); ng.addColorStop(1, 'rgba(70,40,160,.9)'); ctx.fillStyle = ng; ctx.beginPath(); ctx.arc(0, 0, nr, 0, TAU); ctx.fill(); ctx.strokeStyle = '#d9c8ff'; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 1.2; ctx.beginPath(); for (let i = 0; i < 14; i++) { const y = (i / 13 - 0.5) * nr * 1.5, x = Math.sin(S.t * 2 + i * 0.6) * nr * 0.45; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
  ctx.restore(); ctx.restore();
}

// ===== 3. ORGANISME =====
function init3() {
  const W = S.W, H = S.H; S.o = { x: W / 2, y: H * 0.3, ang: 0, sc: 0, tx: W / 2, ty: H * 0.3, eat: 0 }; S.food = [];
  M.el('div', 'hint', 'Ton génome prend vie : touche pour déposer de la nourriture', S.pn);
  S.nx = next('Étape suivante : l\'évolution ▸', 4);
  M.gesture(S.c.cv, { up: (x, y, tap) => { if (tap && y > 90 && y < H * 0.66 && S.food.length < 12) S.food.push({ x, y }); } });
  say('Étape 4/5 · organisme · ' + (ph.limbs * 2) + ' pattes');
}
function f3(d) {
  const { c } = S, ctx = c.ctx, W = S.W, H = S.H, o = S.o; o.sc = Math.min(1, o.sc + d / 2.5);
  let tx = o.tx, ty = o.ty; if (S.food.length) { let bd = 1e9; for (const f of S.food) { const dd = Math.hypot(f.x - o.x, f.y - o.y); if (dd < bd) { bd = dd; tx = f.x; ty = f.y; } } } else if (Math.hypot(o.tx - o.x, o.ty - o.y) < 20) { o.tx = 40 + R() * (W - 80); o.ty = 110 + R() * (H * 0.66 - 130); }
  let da = Math.atan2(ty - o.y, tx - o.x) - o.ang; da = Math.atan2(Math.sin(da), Math.cos(da)); o.ang += clamp(da, -d * 3, d * 3);
  const sp = 35 * ph.speed * o.sc; o.x += Math.cos(o.ang) * sp * d; o.y += Math.sin(o.ang) * sp * d; o.x = clamp(o.x, 20, W - 20); o.y = clamp(o.y, 100, H * 0.66);
  for (let i = S.food.length - 1; i >= 0; i--) if (Math.hypot(S.food[i].x - o.x, S.food[i].y - o.y) < 12 * ph.size) { S.food.splice(i, 1); o.eat++; say('Étape 4/5 · nourri ' + o.eat + ' fois'); }
  ctx.fillStyle = '#041a14'; ctx.fillRect(0, 0, W, H); const gr = ctx.createLinearGradient(0, 70, 0, H * 0.7); gr.addColorStop(0, 'rgba(20,110,90,.15)'); gr.addColorStop(1, 'rgba(120,200,120,.2)'); ctx.fillStyle = gr; ctx.fillRect(0, 70, W, H * 0.66);
  ctx.fillStyle = '#9dffc0'; for (const f of S.food) { ctx.globalAlpha = 0.7 + 0.3 * Math.sin(S.t * 5 + f.x); ctx.beginPath(); ctx.arc(f.x, f.y, 4, 0, TAU); ctx.fill(); } ctx.globalAlpha = 1;
  creature(ctx, o.x, o.y, o.ang, ph, S.t, 1.6 * (0.3 + 0.7 * o.sc));
  if (o.sc < 1) { ctx.fillStyle = '#ffe680'; ctx.font = '12px system-ui'; ctx.textAlign = 'center'; ctx.fillText('Développement de l\'embryon…', W / 2, 96); }
}

// ===== 4. ÉVOLUTION =====
function mkAg(gg, gen, x, y) { return { x, y, vx: 0, vy: 0, ang: R() * TAU, g: gg, p: G.pheno(gg), en: 20, gen, age: 0 }; }
function init4() {
  const W = S.W, H = S.H; S.E = []; S.food = []; S.env = 0; S.hist = []; S.ht = 0; S.born = 0; S.maxGen = 1; S.dead = 0; S.pred = null; S.ft = 0; S.ph = H * 0.6;
  for (let i = 0; i < 14; i++) { const gg = G.clone(g); if (i > 0 && R() < 0.6) G.mutate(gg, 1); S.E.push(mkAg(gg, 1, 30 + R() * (W - 60), 110 + R() * (S.ph - 120))); }
  for (let i = 0; i < 20; i++) S.food.push({ x: 20 + R() * (W - 40), y: 100 + R() * (S.ph - 110) });
  M.el('div', 'hint', 'Population : la sélection naturelle agit. Touche pour déposer de la nourriture', S.pn);
  S.set = M.chips(S.pn, ['🌿 Abondance', '🏜 Rareté', '🦈 Prédateur'], 0, i => { S.env = i; S.pred = i === 2 ? { x: W / 2, y: S.ph / 2, ang: 0 } : null; });
  const row = M.el('div', 'row', null, S.pn); M.el('button', 'chip', '☢ Mutations +', row).onclick = () => { S.mr = S.mr ? 0 : 1; say('Étape 5/5 · mutations ' + (S.mr ? 'fortes' : 'normales')); };
  M.el('button', 'chip', '↺ Recommencer', row).onclick = () => init4Again();
  M.gesture(S.c.cv, { up: (x, y, tap) => { if (tap && y > 90 && y < S.ph) for (let i = 0; i < 5; i++) S.food.push({ x: x + (R() - 0.5) * 40, y: y + (R() - 0.5) * 40 }); } });
  S.mr = 0; say('Étape 5/5 · évolution');
}
function init4Again() { CU.Modes.reg.life.stage(4); }
function f4(d) {
  const { c } = S, ctx = c.ctx, W = S.W, H = S.H, E = S.E, F = S.food, ph0 = S.ph, cap = CU.mobile ? 55 : 80;
  S.ft += d; const rate = S.env === 1 ? 0.8 : S.env === 2 ? 1.6 : 3.2; while (S.ft > 1 / rate) { S.ft -= 1 / rate; if (F.length < 70) F.push({ x: 20 + R() * (W - 40), y: 100 + R() * (ph0 - 110) }); }
  for (let i = E.length - 1; i >= 0; i--) {
    const a = E[i], p = a.p; a.age += d; let tx = null, ty = 0, bd = p.vision * p.vision;
    for (const f of F) { const dx = f.x - a.x, dy = f.y - a.y, dd = dx * dx + dy * dy; if (dd < bd) { bd = dd; tx = f.x; ty = f.y; } }
    if (tx !== null) { let da = Math.atan2(ty - a.y, tx - a.x) - a.ang; da = Math.atan2(Math.sin(da), Math.cos(da)); a.ang += clamp(da, -d * 4, d * 4); } else a.ang += (R() - 0.5) * 4 * d;
    if (S.pred) { const dx = a.x - S.pred.x, dy = a.y - S.pred.y; if (dx * dx + dy * dy < 4900) { a.ang = Math.atan2(dy, dx) + 0.3; } }
    const sp = 28 * p.speed; a.x += Math.cos(a.ang) * sp * d; a.y += Math.sin(a.ang) * sp * d;
    if (a.x < 10) { a.x = 10; a.ang = Math.PI - a.ang; } if (a.x > W - 10) { a.x = W - 10; a.ang = Math.PI - a.ang; } if (a.y < 100) { a.y = 100; a.ang = -a.ang; } if (a.y > ph0) { a.y = ph0; a.ang = -a.ang; }
    a.en -= d * (0.5 + 0.35 * p.speed * p.speed * (0.6 + p.metab * 0.4) + 0.45 * p.size + p.vision / 400);
    for (let k = F.length - 1; k >= 0; k--) { const dx = F[k].x - a.x, dy = F[k].y - a.y; if (dx * dx + dy * dy < (6 + 4 * p.size) * (6 + 4 * p.size)) { F.splice(k, 1); a.en += 9 * (0.7 + 0.5 * p.metab * 0.6); } }
    if (a.en > 34 && E.length < cap) { a.en -= 16; const gg = G.clone(a.g); let mm = 0; if (R() < (S.mr ? 1 : 0.4)) { mm = S.mr ? 3 : 1; G.mutate(gg, mm); } const ch = mkAg(gg, a.gen + 1, a.x, a.y); ch.en = 14; E.push(ch); S.born++; if (ch.gen > S.maxGen) S.maxGen = ch.gen; }
    if (S.pred && Math.hypot(a.x - S.pred.x, a.y - S.pred.y) < 11 + 4 * p.size) { E.splice(i, 1); S.dead++; continue; }
    if (a.en <= 0 || a.age > 70) { E.splice(i, 1); S.dead++; }
  }
  if (S.pred) { const P = S.pred; let b = null, bd = 1e9; for (const a of E) { const dd = Math.hypot(a.x - P.x, a.y - P.y); if (dd < bd) { bd = dd; b = a; } } if (b) { let da = Math.atan2(b.y - P.y, b.x - P.x) - P.ang; da = Math.atan2(Math.sin(da), Math.cos(da)); P.ang += clamp(da, -d * 2, d * 2); } P.x += Math.cos(P.ang) * 50 * d; P.y += Math.sin(P.ang) * 50 * d; if (P.x < 10 || P.x > W - 10) { P.ang = Math.PI - P.ang; P.x = clamp(P.x, 10, W - 10); } if (P.y < 100 || P.y > ph0) { P.ang = -P.ang; P.y = clamp(P.y, 100, ph0); } }
  if (!E.length) { const gg = G.clone(g); E.push(mkAg(gg, 1, W / 2, ph0 / 2)); }   // extinction évitée : un survivant réapparaît
  // historique des moyennes (taille / vitesse / vision)
  S.ht += d; if (S.ht > 1) { S.ht = 0; let a = 0, b = 0, v = 0; for (const e of E) { a += e.p.size; b += e.p.speed; v += e.p.vision; } const n = E.length; S.hist.push([a / n, b / n, v / n]); if (S.hist.length > 60) S.hist.shift(); }
  ctx.fillStyle = '#041410'; ctx.fillRect(0, 0, W, H); const gr = ctx.createLinearGradient(0, 70, 0, ph0 + 10); gr.addColorStop(0, 'rgba(20,100,80,.12)'); gr.addColorStop(1, S.env === 1 ? 'rgba(200,150,60,.22)' : 'rgba(90,200,120,.2)'); ctx.fillStyle = gr; ctx.fillRect(0, 70, W, ph0 - 60);
  ctx.fillStyle = '#9dffc0'; for (const f of F) ctx.fillRect(f.x - 2, f.y - 2, 4, 4);
  for (const a of E) creature(ctx, a.x, a.y, a.ang, a.p, S.t + a.age, 0.75, true);
  if (S.pred) { const P = S.pred; ctx.fillStyle = '#ff3b4a'; ctx.beginPath(); ctx.arc(P.x, P.y, 11, 0, TAU); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(P.x + Math.cos(P.ang) * 5, P.y + Math.sin(P.ang) * 5, 3, 0, TAU); ctx.fill(); }
  // courbes
  const gx = 14, gw = W - 28, gy = ph0 + 26, gh = 70; ctx.fillStyle = 'rgba(10,0,40,.5)'; ctx.fillRect(gx, gy, gw, gh); const H2 = S.hist, cols = ['#ffd24a', '#4dd7ff', '#7dff8a'], rg = [[0.6, 1.8], [0.45, 2.05], [45, 200]];
  for (let k = 0; k < 3; k++) { ctx.strokeStyle = cols[k]; ctx.lineWidth = 1.5; ctx.beginPath(); for (let i = 0; i < H2.length; i++) { const x = gx + i / 59 * gw, y = gy + gh - (H2[i][k] - rg[k][0]) / (rg[k][1] - rg[k][0]) * (gh - 6) - 3; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); }
  ctx.font = '10px system-ui'; ctx.textAlign = 'left'; ctx.fillStyle = cols[0]; ctx.fillText('taille', gx + 4, gy + 11); ctx.fillStyle = cols[1]; ctx.fillText('vitesse', gx + 46, gy + 11); ctx.fillStyle = cols[2]; ctx.fillText('vision', gx + 96, gy + 11);
  if (S.f % 15 === 0) say('Génération ' + S.maxGen + ' · population ' + E.length + ' · ' + S.dead + ' morts');
}
})();
