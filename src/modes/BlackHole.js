// ===== TROUS NOIRS (v0.4) : disque d'accrétion, gravité, objets attirés, lentille gravitationnelle, zoom =====
// Rendu Android-friendly : fond déformé calculé en basse résolution (auto-ajusté au FPS), disque = particules sans allocation.
(function () {
const M = CU.Modes, TAU = 6.2832, clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const KINDS = [{ fr: 'astéroïde', m: 0.002 }, { fr: 'planète', m: 0.01 }, { fr: 'étoile', m: 0.05 }];
const TEMP = [[205, 222, 255], [255, 248, 232], [255, 216, 150], [255, 172, 82], [255, 124, 48], [228, 84, 32], [192, 58, 24], [150, 42, 20]];
let S = null, bgc, bgx, bgd, bg32, tex, pal, glow; const LO = new Float32Array(6);

function mkTex() {
  const c = document.createElement('canvas'); c.width = c.height = 512; const x = c.getContext('2d'), R = Math.random;
  x.fillStyle = '#02000a'; x.fillRect(0, 0, 512, 512);
  const cols = ['120,60,255', '0,200,255', '255,60,200', '60,100,255'];
  for (let i = 0; i < 8; i++) { const px = R() * 512, py = R() * 512, r = 90 + R() * 120, col = cols[i % 4];
    for (let ox = -512; ox <= 512; ox += 512) for (let oy = -512; oy <= 512; oy += 512) {
      const X = px + ox, Y = py + oy; if (X + r < 0 || X - r > 512 || Y + r < 0 || Y - r > 512) continue;
      const g = x.createRadialGradient(X, Y, 0, X, Y, r); g.addColorStop(0, `rgba(${col},.15)`); g.addColorStop(1, `rgba(${col},0)`); x.fillStyle = g; x.fillRect(X - r, Y - r, r * 2, r * 2); } }
  for (let i = 0; i < 620; i++) { const b = 120 + R() * 135 | 0, t = R(), s = R() < 0.08 ? 3 : 2;
    x.fillStyle = t < 0.25 ? `rgb(${b * 0.7 | 0},${b * 0.85 | 0},${b})` : t < 0.4 ? `rgb(${b},${b * 0.88 | 0},${b * 0.6 | 0})` : `rgb(${b},${b},${b})`; x.fillRect(R() * 512 | 0, R() * 512 | 0, s, s); }
  tex = new Uint32Array(x.getImageData(0, 0, 512, 512).data.buffer);
}
function mkPal() {
  pal = []; for (let t = 0; t < 8; t++) for (let d = 0; d < 5; d++) { const T = TEMP[t], k = 0.5 + 0.7 * d / 4, a = clamp(0.22 + 0.5 * d / 4 + (t < 3 ? 0.1 : 0), 0, 0.95);
    pal.push(`rgba(${Math.min(255, T[0] * k) | 0},${Math.min(255, T[1] * k) | 0},${Math.min(255, T[2] * k) | 0},${a.toFixed(2)})`); }
  glow = document.createElement('canvas'); glow.width = glow.height = 256; const x = glow.getContext('2d'), g = x.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.36, 'rgba(255,245,225,0)'); g.addColorStop(0.4, 'rgba(255,240,210,.85)'); g.addColorStop(0.55, 'rgba(255,170,70,.5)'); g.addColorStop(0.8, 'rgba(200,62,22,.2)'); g.addColorStop(1, 'rgba(120,20,10,0)');
  x.fillStyle = g; x.fillRect(0, 0, 256, 256);
}
const mkP = out => ({ a: Math.random() * TAU, u: out ? 6 + 1.5 * Math.random() : 3 + 4.2 * Math.pow(Math.random(), 1.5), b: Math.random(), sp: 0.9 + Math.random() * 0.2, deb: 0 });
// Lentille (masse ponctuelle) : position apparente primaire (LO[0..1]) et secondaire (LO[2..3]) d'une source derrière le trou noir
function lens(px, py, te) {
  const b = Math.hypot(px, py) || 1e-3, q = Math.sqrt(b * b + 4 * te * te), ux = px / b, uy = py / b, rp = (b + q) / 2, rn = (b - q) / 2;
  LO[0] = ux * rp; LO[1] = uy * rp; LO[2] = ux * rn; LO[3] = uy * rn;
}
function fmt(n) { return n >= 1e6 ? (n / 1e6).toFixed(1).replace('.', ',') + ' millions' : n >= 1e3 ? Math.round(n).toLocaleString('fr-FR') : n.toFixed(n < 100 ? 1 : 0).replace('.', ','); }

CU.Modes.register('bh', {
  open(c) {
    const ui = c.ui;
    S = { c, Z: 1, m: 0.35, incl: 1.15, P: [], O: [], fx: [], kind: 2, dive: 0, sc: CU.mobile ? 3 : 2, ema: 16, slow: 0, t: 0, f: 0, ox: 0, oy: 0, eaten: 0, info: 0 };
    if (!tex) mkTex(); if (!pal) mkPal(); bgc = document.createElement('canvas'); bgx = bgc.getContext('2d');
    this.resize(); const n = CU.mobile ? 1100 : 1800; for (let i = 0; i < n; i++) S.P.push(mkP(false));
    M.el('div', 'tl', '<b>Trou noir</b><span id="bhi"></span>', ui); S.i = ui.querySelector('#bhi');
    const zb = M.el('div', 'zc', null, ui); M.el('button', 'chip', '＋', zb).onclick = () => this.zoom(1.35); M.el('button', 'chip', '－', zb).onclick = () => this.zoom(1 / 1.35);
    const pn = M.el('div', 'pn', null, ui);
    M.el('div', 'hint', 'Touche l\'espace pour lancer un objet · glisse ↕ pour incliner · pince pour zoomer', pn);
    M.chips(pn, ['☄ Astéroïde', '🪐 Planète', '⭐ Étoile'], 2, i => { S.kind = i; });
    M.chips(pn, ['↘ Plonger', '◯ Orbiter'], 0, i => { S.dive = i; });
    S.ms = M.slider(pn, 'Masse', 0, 1, S.m, v => { S.m = v; this.setMass(); });
    M.gesture(c.cv, {
      move: (x, y, dx, dy) => { S.incl = clamp(S.incl + dy * 0.004, 0.14, 1.5); },
      up: (x, y, tap) => { if (tap) this.spawn(x, y); },
      pinch: k => this.zoom(k)
    });
    this.setMass(); this.upInfo();
  },
  resize() {
    if (!S) return; const { w, h } = S.c.size; S.cx = w / 2; S.cy = h * 0.4; this.buf(); this.setMass();
  },
  buf() { const { w, h } = S.c.size; bgc.width = Math.ceil(w / S.sc); bgc.height = Math.ceil(h / S.sc); bgd = bgx.createImageData(bgc.width, bgc.height); bg32 = new Uint32Array(bgd.data.buffer); },
  setMass() { const { w, h } = S.c.size; S.rs = Math.min(w, h) * 0.045 * (0.6 + 0.8 * S.m); S.GM = 1800 * S.rs * S.rs; this.upInfo(); },
  zoom(k) { S.Z = clamp(S.Z * k, 0.35, 8); },
  upInfo() {
    if (!S.i) return;
    const Msun = Math.pow(10, 1 + S.m * 5.6), rs = 2.95 * Msun;
    const z = S.Z > 3 ? ' · anneau de photons visible' : S.Z > 1.6 ? ' · zoom : le disque se déforme' : '';
    S.i.textContent = fmt(Msun) + ' M☉ · horizon ' + fmt(rs) + ' km · engloutis : ' + S.eaten + z;
  },
  spawn(sx, sy) {
    if (S.O.length >= 36) S.O.shift();
    const { Z, cx, cy, rs, incl } = S, sI = Math.sin(incl);
    let x = (sx - cx) / Z, z = (sy - cy) / (Z * sI), r = Math.hypot(x, z);
    if (r < 4 * rs) { const k = (4 * rs + 1) / (r || 1); x *= k; z *= k; if (r === 0) { x = 4 * rs; z = 0; } r = Math.hypot(x, z); }
    const vc = Math.sqrt(S.GM / r), f = S.dive ? 1 : 0.97, fac = S.dive ? 0.3 + Math.random() * 0.22 : f;
    S.O.push({ k: S.kind, x, z, vx: -z / r * vc * fac, vz: x / r * vc * fac, tr: [], dead: 0, fade: 1, n: 0 });
  },
  close() { S = null; },
  frame(dt) {
    const ctx = S.c.ctx, { w, h } = S.c.size, d = Math.min(dt, 50) / 1000, cx = S.cx, cy = S.cy, Z = S.Z, rs = S.rs, sI = Math.sin(S.incl);
    S.t += d; S.f++; S.ox += 5 * d; S.oy += 2 * d;
    // auto-réglage de la qualité du fond déformé
    S.ema += (dt - S.ema) * 0.05;
    if (S.ema > 26 && S.sc < 5) { if (++S.slow > 40) { S.sc++; S.slow = 0; this.buf(); } } else S.slow = 0;
    // --- physique : disque ---
    const w0 = 42 / Math.sqrt(rs), P = S.P;
    for (let i = 0; i < P.length; i++) {
      const p = P[i]; p.a += w0 / (p.u * Math.sqrt(p.u)) * d * p.sp; p.u -= (0.03 + p.deb * 0.4) * d; if (p.deb > 0) p.deb = Math.max(0, p.deb - d * 0.25);
      if (p.u < 2.7) { p.u = 6.2 + Math.random() * 1.4; p.deb = 0; p.a = Math.random() * TAU; }
    }
    // --- physique : objets (gravité newtonienne + dilatation du temps près de l'horizon) ---
    const O = S.O, GM = S.GM;
    for (let i = O.length - 1; i >= 0; i--) {
      const o = O[i]; let r = Math.hypot(o.x, o.z);
      for (let s = 0; s < 3; s++) {
        r = Math.hypot(o.x, o.z) || 1; const dil = Math.max(0.05, Math.sqrt(Math.max(0, 1 - rs / r))), dts = d / 3 * dil, a = GM / (r * r);
        o.vx -= a * o.x / r * dts; o.vz -= a * o.z / r * dts; o.x += o.vx * dts; o.z += o.vz * dts;
      }
      r = Math.hypot(o.x, o.z); o.fade = clamp((r - 1.2 * rs) / (2.2 * rs), 0, 1);
      if (S.f % 3 === 0) { o.tr.push(o.x, o.z); if (o.tr.length > 28) o.tr.splice(0, 2); }
      const tidal = o.k === 2 ? 3.6 : o.k === 1 ? 2.7 : 0;
      if (tidal && r < tidal * rs) {       // déchiquetage par les forces de marée → matière ajoutée au disque
        const a0 = Math.atan2(o.z, o.x), n = o.k === 2 ? 46 : 18;
        for (let j = 0; j < n; j++) { const q = P[Math.random() * P.length | 0]; q.a = a0 + (Math.random() - 0.5) * 0.7; q.u = clamp(r / rs, 3, 6) + Math.random() * 0.6; q.b = 1; q.deb = 1; }
        this.eat(o, i, 1); continue;
      }
      if (r < 1.2 * rs) this.eat(o, i, 0);
    }
    // --- rendu ---
    if (S.f & 1) this.lensBG();
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; ctx.drawImage(bgc, 0, 0, w, h);
    // halo lumineux du disque (plan incliné)
    const gw = 2 * 7.6 * rs * Z; ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 0.5; ctx.drawImage(glow, cx - gw / 2, cy - gw * sI / 2, gw, gw * sI);
    // halo d'arche (image déformée du disque lointain)
    const te = rs * 2.9, sh = rs * 2.4 * Z, ha = (0.22 + 0.25 * (1 - sI)) , hg = ctx.createRadialGradient(cx, cy, sh, cx, cy, te * 2.1 * Z);
    hg.addColorStop(0, `rgba(255,190,110,${ha})`); hg.addColorStop(1, 'rgba(255,120,40,0)'); ctx.globalAlpha = 1; ctx.fillStyle = hg; ctx.fillRect(cx - te * 2.2 * Z, cy - te * 2.2 * Z, te * 4.4 * Z, te * 4.4 * Z);
    // derrière le trou noir (image lentillée)
    this.parts(ctx, true); this.objs(ctx, true);
    // ombre (horizon)
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(cx, cy, sh, 0, TAU); ctx.fill();
    // anneau de photons : plus net en zoomant
    ctx.globalCompositeOperation = 'lighter'; const lw = Math.max(1.4, 0.1 * rs * Z), za = clamp(0.45 + Z * 0.12, 0.45, 1);
    ctx.strokeStyle = '#ffe2b8'; [[3, 0.1], [1.7, 0.22], [0.8, 0.85]].forEach(([k, a]) => { ctx.globalAlpha = a * za; ctx.lineWidth = lw * k; ctx.beginPath(); ctx.arc(cx, cy, sh * 1.015, 0, TAU); ctx.stroke(); });
    if (Z > 2.4) { ctx.globalAlpha = clamp((Z - 2.4) / 3, 0, 0.6); ctx.lineWidth = Math.max(1, lw * 0.4); ctx.beginPath(); ctx.arc(cx, cy, sh * 1.085, 0, TAU); ctx.stroke(); }
    // devant
    this.parts(ctx, false); this.objs(ctx, false);
    // flashs d'engloutissement
    ctx.globalCompositeOperation = 'lighter';
    for (let i = S.fx.length - 1; i >= 0; i--) { const f = S.fx[i]; f.t += d; if (f.t > 1.2) { S.fx.splice(i, 1); continue; }
      const k = f.t / 1.2; ctx.globalAlpha = (1 - k) * 0.8; ctx.strokeStyle = f.c; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(f.x, f.y, 6 + k * 50, 0, TAU); ctx.stroke(); }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    if (S.f % 20 === 0) this.upInfo();
  },
  eat(o, i, shred) {
    const { Z, cx, cy, incl } = S, sI = Math.sin(incl);
    S.fx.push({ x: cx + o.x * Z, y: cy + o.z * sI * Z, t: 0, c: shred ? '#ffd27a' : '#ffffff' });
    S.eaten++; S.m = clamp(S.m + KINDS[o.k].m * 0.02, 0, 1); S.ms.value = S.m; this.setMass(); S.O.splice(i, 1);
  },
  // fond étoilé déformé (Einstein) en basse résolution, dérivé de la position des pixels
  lensBG() {
    const sc = S.sc, bw = bgc.width, bh = bgc.height, k = sc / S.Z, te = S.rs * 2.9, te2 = te * te, sh = S.rs * 2.4, sh2 = sh * sh, cx = S.cx / sc, cy = S.cy / sc, ox = S.ox, oy = S.oy, out = bg32, B = 0.8;
    let i = 0;
    for (let y = 0; y < bh; y++) {
      const wy = (y - cy) * k, wy2 = wy * wy;
      for (let x = 0; x < bw; x++, i++) {
        const wx = (x - cx) * k, r2 = wx * wx + wy2;
        if (r2 < sh2) { out[i] = 0xff000000; continue; }
        const t = te2 / r2, f = 1 - t, sw = 0.6 * t, cs = 1 - sw * sw * 0.5, sn = sw * (1 - sw * sw * 0.1667);
        const sx = (wx * cs - wy * sn) * f * B + ox, sy = (wx * sn + wy * cs) * f * B + oy;
        out[i] = tex[((sy | 0) & 511) * 512 + ((sx | 0) & 511)];
      }
    }
    bgx.putImageData(bgd, 0, 0);
  },
  parts(ctx, back) {
    const { cx, cy, Z, rs, incl } = S, sI = Math.sin(incl), te = rs * 2.9, P = S.P, ps = Math.pow(Z, 0.4), min2 = (rs * 2.4) * (rs * 2.4);
    ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 1;
    for (let i = 0; i < P.length; i++) {
      const p = P[i], ca = Math.cos(p.a), sa = Math.sin(p.a); if ((sa < 0) !== back) continue;
      const x = ca * p.u * rs, y = sa * p.u * rs * sI, tb = clamp(((p.u - 3) / 4.4 * 7.99) | 0, 0, 7), db = ((ca * 0.5 + 0.5) * 4.99) | 0, s = (1.1 + p.b * 1.3 + p.deb * 2.2) * ps;
      ctx.fillStyle = pal[tb * 5 + db];
      if (back) {
        lens(x, y, te); ctx.fillRect(cx + LO[0] * Z - s / 2, cy + LO[1] * Z - s / 2, s, s);
        if (LO[2] * LO[2] + LO[3] * LO[3] > min2) ctx.fillRect(cx + LO[2] * Z - s / 3, cy + LO[3] * Z - s / 3, s * 0.66, s * 0.66);
      } else ctx.fillRect(cx + x * Z - s / 2, cy + y * Z - s / 2, s, s);
    }
  },
  objs(ctx, back) {
    const { cx, cy, Z, rs, incl } = S, sI = Math.sin(incl), te = rs * 2.9, O = S.O;
    ctx.globalCompositeOperation = 'source-over';
    for (let i = 0; i < O.length; i++) {
      const o = O[i], isBack = o.z < 0; if (isBack !== back) continue;
      const r = Math.hypot(o.x, o.z), y = o.z * sI; let X, Y;
      if (back) { lens(o.x, y, te); X = cx + LO[0] * Z; Y = cy + LO[1] * Z; } else { X = cx + o.x * Z; Y = cy + y * Z; }
      // traînée
      const tr = o.tr; if (tr.length > 3) { ctx.globalAlpha = 0.35 * o.fade; ctx.strokeStyle = o.k === 2 ? '#ffe9a0' : o.k === 1 ? '#7fb8ff' : '#c8c8d0'; ctx.lineWidth = 1; ctx.beginPath();
        for (let j = 0; j < tr.length; j += 2) { const ty = tr[j + 1] * sI; let tx, tyy; if (tr[j + 1] < 0) { lens(tr[j], ty, te); tx = cx + LO[0] * Z; tyy = cy + LO[1] * Z; } else { tx = cx + tr[j] * Z; tyy = cy + ty * Z; } j ? ctx.lineTo(tx, tyy) : ctx.moveTo(tx, tyy); }
        ctx.lineTo(X, Y); ctx.stroke(); }
      // étirement (spaghettification) le long de la direction radiale
      const near = clamp((4.5 * rs - r) / (3.2 * rs), 0, 1), st = 1 + near * 3.5, base = (o.k === 0 ? 2.6 : o.k === 1 ? 5.5 : 8) * Math.pow(Z, 0.5), ang = Math.atan2(Y - cy, X - cx);
      ctx.save(); ctx.translate(X, Y); ctx.rotate(ang); ctx.scale(st, 1 / Math.sqrt(st)); ctx.globalAlpha = o.fade;
      const red = 1 - o.fade;   // décalage vers le rouge près de l'horizon
      if (o.k === 2) { ctx.fillStyle = `rgb(255,${225 - 150 * red | 0},${140 - 110 * red | 0})`; ctx.beginPath(); ctx.arc(0, 0, base, 0, TAU); ctx.fill(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = o.fade * 0.35; ctx.beginPath(); ctx.arc(0, 0, base * 2, 0, TAU); ctx.fill(); ctx.globalCompositeOperation = 'source-over'; }
      else if (o.k === 1) { ctx.fillStyle = `rgb(${70 + 150 * red | 0},${140 - 70 * red | 0},${230 - 180 * red | 0})`; ctx.beginPath(); ctx.arc(0, 0, base, 0, TAU); ctx.fill(); }
      else { ctx.fillStyle = `rgb(${190 + 40 * red | 0},${190 - 100 * red | 0},${195 - 130 * red | 0})`; ctx.fillRect(-base, -base * 0.7, base * 2, base * 1.4); }
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }
});
})();
