// ===== EXPLORATION 3D LIBRE (v0.5) : univers → galaxie → système → planète, zoom continu, caméra 3D réelle =====
// Moteur 3D maison sur Canvas2D (projection perspective, tampons typés préalloués = pooling). Aucun asset externe.
(function () {
  const TAU = 6.2832, M = () => CU.Modes;
  const LV = [{ R: 1000, d: 1900, min: 420, max: 4200, n: 'Univers' }, { R: 300, d: 560, min: 130, max: 1100, n: 'Galaxie' },
    { R: 230, d: 430, min: 70, max: 950, n: 'Système' }, { R: 40, d: 200, min: 75, max: 520, n: 'Planète' }];
  const SC = [[255, 122, 74], [255, 168, 88], [255, 227, 138], [255, 244, 224], [168, 200, 255], [255, 90, 58]];
  const PT = ['océanique', 'désertique', 'glacé', 'volcanique', 'géante gazeuse'];
  const PAL = [[[6, 40, 110], [50, 140, 70], [120, 110, 60]], [[170, 100, 55], [210, 150, 90], [130, 70, 40]], [[150, 200, 235], [235, 245, 255], [120, 160, 200]],
    [[40, 18, 16], [200, 60, 20], [90, 40, 30]], [[220, 180, 130], [180, 120, 80], [240, 220, 180]]];
  const MAXS = CU.mobile ? 6000 : 10000;
  const SX = new Float32Array(MAXS), SY = new Float32Array(MAXS), SZ = new Float32Array(MAXS), SB = new Uint8Array(MAXS); // pool d'étoiles (réutilisé à chaque galaxie)
  const SKY = new Float32Array(360 * 3), P = { x: 0, y: 0, s: 0, z: 0 };
  let W = 0, H = 0, F = 0, cx = null, cv = null, ui = null, E = {}, tm = 0;
  let lv = 0, path = { gi: 0, si: 0, pi: 0 }, yaw = 0.6, pitch = 0.5, dist = 1900, tx = 0, ty = 0, tz = 0, fade = 1, flash = 0, tr = null;
  let auto = false, fly = false, pilot = true, ap = -1, thr = 0, vel = 0, spd = 1, hintT = '', kd = null, ku = null, nS = 0, UNI = null, GAL = null, SYS = null, PLN = null, hint = 0;
  const d = () => CU.Save.d, cl = (v, a, b) => v < a ? a : v > b ? b : v;
  const rgb = (c, a) => 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')';

  function proj(x, y, z) {
    const dx = x - tx, dy = y - ty, dz = z - tz, cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
    const x1 = dx * cy + dz * sy, z1 = -dx * sy + dz * cy, y2 = dy * cp - z1 * sp, zc = dy * sp + z1 * cp + dist;
    if (zc < 2) return false; const s = F / zc; P.x = W / 2 + x1 * s; P.y = H / 2 - y2 * s; P.s = s; P.z = zc; return true;
  }
  // ---------- génération (déterministe par graine, sauvegardée) ----------
  function genUniverse() {
    const r = CU.rng(d().seed), n = 24 + Math.min(12, d().made.galaxy), G = [];
    for (let i = 0; i < n; i++) {
      const g = { i, x: (r() - 0.5) * 1500, y: (r() - 0.5) * 700, z: (r() - 0.5) * 1500, r: 90 + r() * 110, tilt: r() * 3, rot: r() * TAU, arms: 2 + (r() * 3 | 0), hue: r() * 4 | 0, name: CU.nameGen(r), bh: r() < 0.4 };
      if (i === 0) { g.x = g.y = g.z = 0; g.r = 150; g.name = 'Voie Héliora'; g.bh = false; }
      g.spr = sprite(g, r); G.push(g);
    }
    const B = new Float32Array(900 * 3); for (let i = 0; i < B.length; i++) B[i] = (r() - 0.5) * 3000;
    UNI = { G, B };
  }
  function sprite(g, r) {
    const c = document.createElement('canvas'); c.width = c.height = 512; const x = c.getContext('2d'), col = [[150, 190, 255], [150, 230, 255], [255, 160, 230], [255, 215, 140]][g.hue];
    x.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 18000; i++) {
      const u = Math.pow(r(), 0.7) * 210, a = (i % g.arms) * TAU / g.arms + u * 0.045 + (r() - 0.5) * (0.6 - u / 280), px = 256 + Math.cos(a) * u, py = 256 + Math.sin(a) * u * (0.82 + 0.12 * Math.abs(Math.cos(g.tilt))), hot = r() < 0.04;
      x.fillStyle = hot ? 'rgba(255,120,200,.8)' : rgb(col, 0.2 + r() * 0.5); const z = hot ? 3.2 : 1 + r() * 1.3; x.fillRect(px, py, z, z);
    }
    // Bulbe central + poussières et régions HII pour un aspect de vraie galaxie.
    const dust = x.createLinearGradient(40, 90, 470, 420); dust.addColorStop(0, 'rgba(20,30,70,0)'); dust.addColorStop(.5, 'rgba(10,12,30,.5)'); dust.addColorStop(1, 'rgba(20,30,70,0)'); x.fillStyle = dust; x.globalCompositeOperation = 'source-over'; x.fillRect(0, 0, 512, 512); x.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 260; i++) { const a = r() * TAU, rr = Math.pow(r(), 1.8) * 112, px = 256 + Math.cos(a) * rr, py = 256 + Math.sin(a) * rr * .35; const c2 = r() < .5 ? [90,170,255] : [255,110,180]; x.fillStyle = rgb(c2, .12 + r() * .2); x.beginPath(); x.arc(px, py, 2 + r() * 7, 0, TAU); x.fill(); }
    const gr = x.createRadialGradient(256, 256, 0, 256, 256, 150); gr.addColorStop(0, 'rgba(255,250,225,1)'); gr.addColorStop(0.22, 'rgba(255,220,155,.7)'); gr.addColorStop(0.5, 'rgba(255,180,120,.18)'); gr.addColorStop(1, 'rgba(255,190,110,0)'); x.fillStyle = gr; x.fillRect(0, 0, 512, 512);
    return c;
  }
  function nebs(rs) { const R = LV[1].R, C = [[255, 90, 190], [90, 150, 255], [120, 240, 230], [255, 170, 90]], a = []; for (let k = 0; k < 46; k++) { const rr = R * (0.2 + rs() * 0.75), t = rr * 0.022 + rs() * 6.28; a.push({ x: Math.cos(t) * rr, y: (rs() - 0.5) * 8, z: Math.sin(t) * rr, r: 18 + rs() * 34, c: C[rs() * 4 | 0] }); } return a; }
  function genGalaxy(gi) {
    const g = UNI.G[gi], r = CU.rng(d().seed + gi * 977), R = LV[1].R; nS = Math.floor(MAXS * CU.Q.poolMul); const per = nS >> 2;
    for (let b = 0; b < 4; b++) for (let k = 0; k < per; k++) {
      const i = b * per + k, u = r(), rr = b === 0 ? Math.pow(u, 2.2) * R * 0.3 : b === 3 ? R * (0.25 + 0.75 * Math.sqrt(u)) : R * Math.pow(u, 0.75);
      const a = ((r() * g.arms) | 0) * TAU / g.arms + rr * 0.022 + (r() - 0.5) * (b === 0 ? 6 : 0.9 - rr / R * 0.5);
      SX[i] = Math.cos(a) * rr; SZ[i] = Math.sin(a) * rr; SY[i] = (r() + r() + r() - 1.5) * (22 * (1 - rr / R * 0.6)); SB[i] = b;
    }
    const sys = [], rs = CU.rng(d().seed + gi * 31 + 5);
    for (let s = 0, ns = 12 + (gi === 0 ? Math.min(6, d().made.star) : 0); s < ns; s++) { const a = rs() * TAU, rr = R * (0.15 + rs() * 0.7); sys.push({ x: Math.cos(a) * rr, y: (rs() - 0.5) * 16, z: Math.sin(a) * rr, name: CU.nameGen(rs), c: SC[rs() * 6 | 0] }); }
    GAL = { g, sys, nb: nebs(rs), bh: g.bh || (gi === 0 && d().made.bh > 0) };
  }
  function genSystem(gi, si) {
    const r = CU.rng(d().seed + gi * 4099 + si * 131), home = gi === 0 && si === 0, cls = home ? 2 : r() * 6 | 0, np = 3 + (r() * 4 | 0) + (home ? Math.min(4, d().made.planet) : 0), pl = [];
    for (let k = 0; k < np; k++) {
      let t = r() * 5 | 0; if (home && k === 2) t = 0; const gas = t === 4, a = 48 + k * (150 / np) + r() * 12;
      const p = { a, e: 0.04 + r() * 0.12, inc: (r() - 0.5) * 0.12, ph: r() * TAU, sp: 26 / Math.pow(a, 1.5), r: gas ? 11 + r() * 6 : 4 + r() * 5, t, ring: gas ? r() < 0.5 : r() < 0.06, name: CU.nameGen(r),
        life: (home && k === 2) && true || (k >= np - d().made.life && home && d().made.life > 0), moons: [], seed: (r() * 1e9) | 0, home: home && k === 2 };
      for (let m = r() * 3 | 0; m > 0; m--) p.moons.push({ a: 62 + m * 16 + r() * 8, ph: r() * TAU, sp: 0.9 + r() * 0.7, r: 3 + r() * 3 });
      if (p.home) { p.name = 'Monde natal'; p.life = true; }
      pl.push(p);
    }
    SYS = { gi, si, cls, pl, name: home ? 'Héliora' : GAL.sys[si].name };
  }
  function texture(p) { // carte 256×128 (océans, continents, bandes, calottes), générée une seule fois par planète visitée
    const c = document.createElement('canvas'); c.width = 512; c.height = 256; const x = c.getContext('2d'), r = CU.rng(p.seed), pal = PAL[p.t];
    x.fillStyle = rgb(pal[0], 1); x.fillRect(0, 0, 512, 256);
    if (p.t === 4) { for (let y = 0; y < 256; y += 2) { const v = Math.sin(y * 0.11 + r() * 0.6) * 0.5 + 0.5; x.fillStyle = rgb(pal[v > 0.5 ? 1 : 2], 0.35 + v * 0.4); x.fillRect(0, y, 512, 2); } }
    else {
      for (let i = 0; i < 70; i++) {
        const bx = r() * 512, by = 36 + r() * 184, br = 6 + r() * 20, col = pal[1 + (r() * 2 | 0)];
        for (const o of [-512, 0, 512]) { x.fillStyle = rgb(col, p.t === 3 ? 0.6 : 0.85); x.beginPath(); x.ellipse(bx + o, by, br, br * 0.7, r() * 3, 0, TAU); x.fill(); }
      }
      if (p.t === 0 || p.t === 2) { x.fillStyle = 'rgba(255,255,255,.85)'; x.fillRect(0, 0, 512, 14); x.fillRect(0, 242, 512, 14); }
      if (p.t === 0) for (let i = 0; i < 26; i++) { x.fillStyle = 'rgba(255,255,255,.22)'; x.beginPath(); x.ellipse(r() * 512, 20 + r() * 216, 20 + r() * 32, 6 + r() * 8, 0, 0, TAU); x.fill(); }
    }
    return c;
  }
  // ---------- navigation ----------
  function fwd() { const cp = Math.cos(pitch); return [-cp * Math.sin(yaw), Math.sin(pitch), cp * Math.cos(yaw)]; }
  function place(L, keep) { dist = 0; if (keep) return; const f = fwd(), D = LV[L].d * 0.7; tx = -f[0] * D; ty = -f[1] * D; tz = -f[2] * D; vel = 0; }
  // Vol libre : la caméra est le vaisseau. Avancer = se déplacer le long du regard ; s'approcher d'un objet y entre, s'éloigner remonte d'une échelle.
  function flight(ds) {
    const o = LV[lv], L = lv < 3 ? cands() : null; let dn = 1e9, tq = null;
    if (L) for (let i = 0; i < L.length; i++) { const q = L[i], dd = Math.hypot(q[0] - tx, q[1] - ty, q[2] - tz); if (dd < dn) dn = dd; if (i === ap) tq = q; }
    if (tq) { const dx = tq[0] - tx, dy = tq[1] - ty, dz = tq[2] - tz, k = Math.min(1, ds * 3); let da = Math.atan2(-dx, dz) - yaw; da -= Math.round(da / TAU) * TAU; yaw += da * k; pitch += (cl(Math.atan2(dy, Math.hypot(dx, dz)), -1.45, 1.45) - pitch) * k; dn = Math.hypot(dx, dy, dz); }
    const sp = cl(dn * 0.9, o.R * 0.06, o.R * 1.2) * spd, want = (tq || thr > 0) ? sp : thr < 0 ? -sp * 0.5 : 0, f = fwd(); vel += (want - vel) * Math.min(1, ds * 2.5);
    tx += f[0] * vel * ds; ty += f[1] * vel * ds; tz += f[2] * vel * ds;
    let r = Math.hypot(tx, ty, tz); const lo = lv === 2 ? 14 : lv === 3 ? 55 : 0, hi = lv === 0 ? 2600 : 1e9;
    if (r < lo || r > hi) { const k = (r < lo ? lo : hi) / (r || 1); tx *= k; ty *= k; tz *= k; r = Math.hypot(tx, ty, tz); vel *= 0.5; }
    if (lv > 0 && r > o.d * 1.6) { rise(); return; }
    if (lv < 3) { const L = cands(); for (let i = 0; i < L.length; i++) { const q = L[i], th = lv === 0 ? UNI.G[i].r * 0.3 : lv === 1 ? 22 : SYS.pl[i].r * 5; if (Math.hypot(q[0] - tx, q[1] - ty, q[2] - tz) < th) { dive(i); return; } } }
  }
  function reticle() {
    const X = W / 2, Y = H / 2; cx.strokeStyle = 'rgba(0,240,255,.45)'; cx.lineWidth = 1; cx.beginPath(); cx.arc(X, Y, 9, 0, TAU); cx.moveTo(X - 16, Y); cx.lineTo(X - 5, Y); cx.moveTo(X + 5, Y); cx.lineTo(X + 16, Y); cx.stroke();
    hintT = ''; if (lv < 3) { const L = cands(), i = near(L, q => q, Math.min(W, H) * 0.22); if (i >= 0) { const q = L[i]; hintT = (lv === 0 ? UNI.G[i].name : lv === 1 ? GAL.sys[i].name : SYS.pl[i].name) + ' · ' + Math.round(Math.hypot(q[0] - tx, q[1] - ty, q[2] - tz)); } }
    if (hintT) { cx.fillStyle = '#9fdcff'; cx.font = '12px system-ui'; cx.textAlign = 'center'; cx.fillText(hintT, X, Y + 32); }
  }
  function label() { return lv === 0 ? "Univers · " + UNI.G.length + " galaxies · Âge 13,80 milliards d'années" : lv === 1 ? 'Galaxie ' + GAL.g.name : lv === 2 ? 'Système ' + SYS.name : 'Planète ' + PLN.name + ' · monde ' + PT[PLN.t]; }
  function enter(L, keepT) {
    lv = L; const o = LV[L]; if (L === 1) genGalaxy(path.gi); else if (L === 2) genSystem(path.gi, path.si); else if (L === 3) { PLN = SYS.pl[path.pi]; if (!PLN.tex) PLN.tex = texture(PLN); }
    dist = o.d * (keepT ? 0.6 : 1); if (!keepT) tx = ty = tz = 0; if (pilot) place(L, keepT); ap = -1; fade = 0; flash = 0.5; tr = null; CU.Sound.zoom();
    const s = d(); s.ex = { lv: L, gi: path.gi, si: path.si, pi: path.pi }; CU.Save.mark(); hud();
  }
  function near(list, getp, maxpx) { let best = -1, bd = maxpx || 1e9; for (let i = 0; i < list.length; i++) { const q = getp(list[i]); if (!proj(q[0], q[1], q[2])) continue; const dd = Math.hypot(P.x - W / 2, P.y - H / 2); if (dd < bd) { bd = dd; best = i; } } return best; }
  function pick(px, py) { let best = -1, bd = 46; const list = cands(); for (let i = 0; i < list.length; i++) { const q = list[i]; if (!proj(q[0], q[1], q[2])) continue; const dd = Math.hypot(P.x - px, P.y - py); if (dd < bd) { bd = dd; best = i; } } return best; }
  function cands() {
    if (lv === 0) return UNI.G.map(g => [g.x, g.y, g.z]); if (lv === 1) return GAL.sys.map(s => [s.x, s.y, s.z]);
    if (lv === 2) { const t = tm; return SYS.pl.map(p => ppos(p, t)); } return [];
  }
  function ppos(p, t) { const a = p.ph + t * p.sp, rr = p.a * (1 - p.e * Math.cos(a)); return [Math.cos(a) * rr, Math.sin(a) * rr * p.inc * 2, Math.sin(a) * rr]; }
  function dive(i) { // plonge vers l'enfant i : la caméra file vers lui, puis le niveau suivant se fond en douceur
    if (tr || lv >= 3 || i < 0) return; const q = cands()[i];
    if (lv === 0) path.gi = i; else if (lv === 1) path.si = i; else path.pi = i;
    tr = { t: 0, from: [tx, ty, tz, dist], to: [q[0], q[1], q[2], Math.max(8, LV[lv].min * 0.2)], up: true }; CU.Sound.create();
  }
  function rise() { if (tr || lv <= 0) return; const L = lv - 1, child = lv === 1 ? path.gi : lv === 2 ? path.si : path.pi; lv = L; enter(L, true);
    const q = cands()[child]; if (pilot) { const f = fwd(), D = LV[L].d * 0.35; if (q) { tx = q[0] - f[0] * D; ty = q[1] - f[1] * D; tz = q[2] - f[2] * D; } dist = 0; } else { if (q) { tx = q[0]; ty = q[1]; tz = q[2]; } dist = LV[L].min * 1.4; } }
  function go(L) { if (L === lv && !tr) return; tr = null; if (L > 0 && lv === 0) path.gi = path.gi; if (L >= 1 && !GAL) genGalaxy(path.gi); if (L >= 2 && (!SYS || SYS.gi !== path.gi || SYS.si !== path.si)) { if (!GAL || GAL.g.i !== path.gi) genGalaxy(path.gi); genSystem(path.gi, path.si); }
    if (L === 3 && (!SYS || !SYS.pl[path.pi])) path.pi = 0; if (L === 1 && (!GAL || GAL.g.i !== path.gi)) genGalaxy(path.gi); enter(L); }
  // ---------- rendu ----------
  const PM = new Uint8Array(512), VL = new Float32Array(256), lp = (a, b, t) => a + (b - a) * t; let PIN = 0; const pinit = () => { if (PIN) return; PIN = 1; const r = CU.rng(7), a = []; for (let i = 0; i < 256; i++) { a.push(i); VL[i] = r(); } for (let i = 255; i > 0; i--) { const j = (r() * (i + 1)) | 0, t = a[i]; a[i] = a[j]; a[j] = t; } for (let i = 0; i < 512; i++) PM[i] = a[i & 255]; };
  const HS = (x, y, z) => VL[PM[PM[PM[x & 255] + (y & 255)] + (z & 255)]];
  function n3(x, y, z) { const X = Math.floor(x), Y = Math.floor(y), Z = Math.floor(z), u = x - X, v = y - Y, w = z - Z, a = u * u * (3 - 2 * u), b = v * v * (3 - 2 * v), c = w * w * (3 - 2 * w);
    return lp(lp(lp(HS(X, Y, Z), HS(X + 1, Y, Z), a), lp(HS(X, Y + 1, Z), HS(X + 1, Y + 1, Z), a), b), lp(lp(HS(X, Y, Z + 1), HS(X + 1, Y, Z + 1), a), lp(HS(X, Y + 1, Z + 1), HS(X + 1, Y + 1, Z + 1), a), b), c); }
  function fbm(x, y, z, o) { let s = 0, a = 0.5; for (let i = 0; i < o; i++) { s += a * n3(x, y, z); x *= 2.03; y *= 2.03; z *= 2.03; a *= 0.5; } return s; }
  const ATM = [[90, 160, 255], [255, 170, 110], [170, 220, 255], [255, 110, 60], [235, 195, 140]];
  function ptex(p, w) { // texture sphérique : relief fractal 3D (sans couture), océans, glaces, lave, bandes gazeuses, nuages séparés
    pinit(); const h = w >> 1, d = new Uint8ClampedArray(w * h * 4), cl = new Uint8Array(w * h), t = p.t, pal = PAL[t], o = (p.seed % 997) * 1.7, sl = [0.5, 0.42, 0.44, 0.4, 0][t];
    const pc = (k, a, b, f, s) => { f = f < 0 ? 0 : f > 1 ? 1 : f; d[k] = (a[0] + (b[0] - a[0]) * f) * s; d[k + 1] = (a[1] + (b[1] - a[1]) * f) * s; d[k + 2] = (a[2] + (b[2] - a[2]) * f) * s; };
    for (let j = 0; j < h; j++) { const lat = (j + 0.5) / h * 3.1416 - 1.5708, cy = Math.cos(lat), sy = Math.sin(lat);
      for (let i = 0; i < w; i++) { const lon = i / w * TAU, x = Math.cos(lon) * cy * 2.2 + o, y = sy * 2.2 + o, z = Math.sin(lon) * cy * 2.2 + o, k = (j * w + i) * 4; let a = 0;
        if (t === 4) { const v = fbm(x * 0.5, y * 4 + fbm(x, y, z, 3) * 1.8, z * 0.5, 4); { const f = (v - 0.5) * 4.5 + 0.5; pc(k, pal[2], pal[1], f, 0.6 + Math.max(0, Math.min(1, f)) * 0.55); } }
        else { const e = fbm(x, y, z, 4), hh = (e - sl) / (1 - sl);
          if (e < sl) { if (t === 0) { pc(k, pal[0], pal[0], 0, 0.45 + e / sl * 0.75); a = 255; } else if (t === 2) pc(k, pal[0], pal[1], e / sl, 1); else if (t === 3) pc(k, pal[0], pal[0], 0, 0.7 + e); else pc(k, pal[2], pal[0], e / sl, 0.8); }
          else if (t === 0 && hh > 0.6) pc(k, pal[2], [250, 250, 255], (hh - 0.6) * 5, 1); else pc(k, pal[1], pal[2], hh * 2.2, 0.7 + hh * 0.6);
          if (t === 3) { const rg = Math.abs(fbm(x * 1.7 + 5, y * 1.7, z * 1.7, 3) - 0.5); if (rg < 0.028) { pc(k, pal[1], [255, 225, 130], 1 - rg / 0.028, 1); a = 128; } }
          if ((t === 0 || t === 2) && Math.abs(sy) > 0.86 - (e - 0.5) * 0.3) { d[k] = 240; d[k + 1] = 248; d[k + 2] = 255; a = 0; }
          if (t === 0 || t === 2) { const c2 = fbm(x * 1.1 + 11, y * 1.7 + 11, z * 1.1 + 11, 3); cl[j * w + i] = c2 > 0.5 ? Math.min(255, (c2 - 0.5) * 1275 * (t === 0 ? 1 : 0.6)) : 0; } }
        d[k + 3] = a; } }
    return { d, cl, w, h };
  }
  function dsphere(p, X, Y, r, q) { // sphère rendue pixel par pixel : éclairage selon l'étoile, terminateur doux, reflet sur l'océan, atmosphère, nuages, lumières de vie
    const S = Math.max(24, Math.min(CU.mobile ? 320 : 512, (r * 2 * M().size.dpr) | 0)), T = S > 64 ? (p.th || (p.th = ptex(p, CU.mobile ? 768 : 1024))) : (p.tl || (p.tl = ptex(p, 128)));
    if (!p.sc) p.sc = document.createElement('canvas'); if (p.sc.width !== S) { p.sc.width = p.sc.height = S; p.sx = p.sc.getContext('2d'); p.si = p.sx.createImageData(S, S); p.sk = null; }
    const kk = p.sk; if (kk && Math.abs(yaw - kk[0]) + Math.abs(pitch - kk[1]) < 0.004 && Math.abs(tm - kk[2]) < 0.35) { cx.globalCompositeOperation = 'lighter'; glow(X, Y, r * 1.3, ATM[p.t], 0.22); cx.globalCompositeOperation = 'source-over'; cx.drawImage(p.sc, X - r, Y - r, r * 2, r * 2); return; } p.sk = [yaw, pitch, tm];
    const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch), Ux = sy * sp, Uz = -cy * sp, Zx = sy * cp, Zy = -sp, Zz = -cy * cp;
    const ql = Math.hypot(q[0], q[1], q[2]) || 1, Lx = -q[0] / ql, Ly = -q[1] / ql, Lz = -q[2] / ql; let Hx = Lx + Zx, Hy = Ly + Zy, Hz = Lz + Zz; const hl = Math.hypot(Hx, Hy, Hz) || 1; Hx /= hl; Hy /= hl; Hz /= hl;
    const at = ATM[p.t], D = p.si.data, w = T.w, h = T.h, spin = tm * 0.03 * (p.seed % 3 ? 1 : -1), dc = tm * 0.012;
    for (let j = 0, k = 0; j < S; j++) for (let i = 0; i < S; i++, k += 4) {
      const u = (i + 0.5) / S * 2 - 1, v = 1 - (j + 0.5) / S * 2, r2 = u * u + v * v; if (r2 >= 1) { D[k + 3] = 0; continue; }
      const nz = Math.sqrt(1 - r2), nx = u * cy + v * Ux + nz * Zx, ny = v * cp + nz * Zy, nw = u * sy + v * Uz + nz * Zz, lon = Math.atan2(nw, nx) - spin;
      const uu = (lon / TAU % 1 + 1) % 1 * w, vv = Math.min(h - 1, Math.max(0, (Math.asin(ny) / 3.1416 + 0.5) * h - 0.5)), tx = uu | 0, ty = Math.min(h - 1, ((Math.asin(ny) / 3.1416 + 0.5) * h) | 0), c4 = (ty * w + tx) * 4, a0 = T.d[c4 + 3];
      const ux0 = Math.floor(uu - 0.5), wx = uu - 0.5 - ux0, xa = (ux0 + w) % w, xb = (xa + 1) % w, y0 = vv | 0, y1 = Math.min(h - 1, y0 + 1), wy = vv - y0, ia = (y0 * w + xa) * 4, ib = (y0 * w + xb) * 4, ic = (y1 * w + xa) * 4, id = (y1 * w + xb) * 4, w0 = (1 - wx) * (1 - wy), w1 = wx * (1 - wy), w2 = (1 - wx) * wy, w3 = wx * wy, Td = T.d;
      const tr = Td[ia] * w0 + Td[ib] * w1 + Td[ic] * w2 + Td[id] * w3, tg = Td[ia + 1] * w0 + Td[ib + 1] * w1 + Td[ic + 1] * w2 + Td[id + 1] * w3, tb = Td[ia + 2] * w0 + Td[ib + 2] * w1 + Td[ic + 2] * w2 + Td[id + 2] * w3;
      const uc = (((lon + spin - dc) / TAU % 1 + 1) % 1) * w, cx0 = Math.floor(uc - 0.5), cwx = uc - 0.5 - cx0, ca = (cx0 + w) % w, cb = (ca + 1) % w, Tc = T.cl;
      const cc = ((Tc[y0 * w + ca] * (1 - cwx) + Tc[y0 * w + cb] * cwx) * (1 - wy) + (Tc[y1 * w + ca] * (1 - cwx) + Tc[y1 * w + cb] * cwx) * wy) / 255, dl = nx * Lx + ny * Ly + nw * Lz, tt = Math.max(0, Math.min(1, (dl + 0.1) / 0.4)), lit = tt * tt * (3 - 2 * tt);
      let sh = 0.03 + 0.97 * lit; if (a0 === 128) sh = Math.max(sh, 0.9);
      let R = (tr + (255 - tr) * cc * 0.9) * sh, G = (tg + (255 - tg) * cc * 0.9) * sh, B = (tb + (255 - tb) * cc * 0.9) * sh;
      if (a0 === 255 && cc < 0.3) { const s2 = nx * Hx + ny * Hy + nw * Hz; if (s2 > 0.92) { const f = Math.pow((s2 - 0.92) / 0.08, 3) * 210 * lit * (1 - cc); R += f; G += f; B += f * 0.9; } }
      if (p.life && lit < 0.1 && !a0 && HS(tx >> 1, ty >> 1, 9) > 0.965) { R += 255; G += 190; B += 90; }
      const f = Math.pow(1 - nz, 3) * (0.2 + 0.8 * Math.max(0, dl + 0.3)); D[k] = R + at[0] * f * 1.1; D[k + 1] = G + at[1] * f * 1.1; D[k + 2] = B + at[2] * f * 1.1; D[k + 3] = Math.min(255, (1 - Math.sqrt(r2)) * S * 127);
    }
    p.sx.putImageData(p.si, 0, 0); cx.globalCompositeOperation = 'lighter'; glow(X, Y, r * 1.3, at, 0.22); cx.globalCompositeOperation = 'source-over'; cx.drawImage(p.sc, X - r, Y - r, r * 2, r * 2);
  }
  function drawStar(X, Y, r, sc, t) {
    cx.globalCompositeOperation = 'lighter'; glow(X, Y, r * 7, sc, 0.45); glow(X, Y, r * 3, sc, 0.8); cx.strokeStyle = rgb(sc, 0.35); cx.lineWidth = Math.max(1, r * 0.07);
    for (let i = 0; i < 14; i++) { const a = i * TAU / 14 + t * 0.03, l = r * (1.7 + 0.9 * Math.abs(Math.sin(i * 7.3 + t * 0.7))); cx.beginPath(); cx.moveTo(X + Math.cos(a) * r, Y + Math.sin(a) * r); cx.lineTo(X + Math.cos(a) * l, Y + Math.sin(a) * l); cx.stroke(); }
    cx.globalCompositeOperation = 'source-over'; const g = cx.createRadialGradient(X, Y, 0, X, Y, r); g.addColorStop(0, '#fff'); g.addColorStop(0.55, rgb([(255 + sc[0]) >> 1, (255 + sc[1]) >> 1, (255 + sc[2]) >> 1], 1)); g.addColorStop(1, rgb(sc, 1)); cx.fillStyle = g; cx.beginPath(); cx.arc(X, Y, r, 0, TAU); cx.fill();
  }
  function sky() {
    cx.fillStyle = '#fff'; const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
    for (let i = 0; i < SKY.length; i += 3) { const x = SKY[i], y = SKY[i + 1], z = SKY[i + 2], x1 = x * cy + z * sy, z1 = -x * sy + z * cy, y2 = y * cp - z1 * sp, z2 = y * sp + z1 * cp; if (z2 < 0.05) continue; const px = W / 2 + x1 / z2 * F * 0.8, py = H / 2 - y2 / z2 * F * 0.8; if (px < 0 || py < 0 || px > W || py > H) continue; cx.globalAlpha = 0.25 + (i % 7) * 0.08; cx.fillRect(px, py, 1.3, 1.3); }
    cx.globalAlpha = 1;
  }
  function glow(x, y, r, c, a) { const g = cx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgb(c, a)); g.addColorStop(0.4, rgb(c, a * 0.3)); g.addColorStop(1, rgb(c, 0)); cx.fillStyle = g; cx.fillRect(x - r, y - r, r * 2, r * 2); }
  function label2(t, x, y, a) { cx.globalAlpha = a; cx.fillStyle = '#9fdcff'; cx.font = '11px system-ui'; cx.textAlign = 'center'; cx.fillText(t, x, y); cx.globalAlpha = 1; }
  function drawUniverse() {
    cx.fillStyle = '#9fb8ff'; const B = UNI.B; for (let i = 0; i < B.length; i += 3) { if (!proj(B[i], B[i + 1], B[i + 2])) continue; cx.globalAlpha = Math.min(0.6, P.s * 40); cx.fillRect(P.x, P.y, 1.4, 1.4); } cx.globalAlpha = 1;
    cx.globalCompositeOperation = 'lighter';
    for (const g of UNI.G) { if (!proj(g.x, g.y, g.z)) continue; const px = g.r * P.s * 1.25; if (px < 1 || P.x < -px || P.x > W + px || P.y < -px || P.y > H + px) continue;
      cx.save(); cx.translate(P.x, P.y); cx.rotate(g.rot + tm * 0.02); cx.scale(1, 0.3 + 0.7 * Math.abs(Math.cos(pitch + g.tilt))); cx.drawImage(g.spr, -px, -px, px * 2, px * 2); cx.restore();
      if (px > 10) { cx.globalCompositeOperation = 'source-over'; label2(g.name, P.x, P.y + px * 0.5 + 12, Math.min(1, px / 50)); cx.globalCompositeOperation = 'lighter'; } }
    cx.globalCompositeOperation = 'source-over';
  }
  const BC = ['rgb(255,200,140)', 'rgb(255,240,200)', 'rgb(220,230,255)', 'rgb(140,190,255)'];
  function drawGalaxy() {
    cx.globalCompositeOperation = 'lighter'; const n = nS; for (const b of GAL.nb) { if (!proj(b.x, b.y, b.z)) continue; const rr = Math.min(W, b.r * P.s * 1.6); if (rr > 2) glow(P.x, P.y, rr, b.c, 0.16); }
    let lb = -1;
    for (let i = 0; i < n; i++) { if (!proj(SX[i] + 0, SY[i], SZ[i])) continue; if (P.x < 0 || P.y < 0 || P.x > W || P.y > H) continue; const b = SB[i]; if (b !== lb) { cx.fillStyle = BC[b]; lb = b; } cx.globalAlpha = 0.35 + Math.min(0.65, P.s * 12); const z = 1 + Math.min(2.2, P.s * 3); cx.fillRect(P.x, P.y, z, z); }
    cx.globalAlpha = 1; if (proj(0, 0, 0)) glow(P.x, P.y, Math.max(20, 50 * P.s), [255, 220, 170], 0.9);
    cx.globalCompositeOperation = 'source-over';
    if (GAL.bh && proj(0, 0, 0)) { const r = Math.max(4, 7 * P.s); cx.fillStyle = '#000'; cx.beginPath(); cx.arc(P.x, P.y, r, 0, TAU); cx.fill(); cx.strokeStyle = 'rgba(255,170,70,.9)'; cx.lineWidth = Math.max(1, r * 0.25); cx.beginPath(); cx.ellipse(P.x, P.y, r * 2, r * 0.6, yaw, 0, TAU); cx.stroke(); }
    for (let i = 0; i < GAL.sys.length; i++) { const s = GAL.sys[i]; if (!proj(s.x, s.y, s.z)) continue; const a = Math.min(1, P.s * 14); cx.strokeStyle = rgb(s.c, 0.8 * a); cx.lineWidth = 1.2; cx.beginPath(); cx.arc(P.x, P.y, 5 + Math.min(14, P.s * 10), 0, TAU); cx.stroke(); glow(P.x, P.y, 14, s.c, 0.8); label2(s.name, P.x, P.y - 12 - Math.min(14, P.s * 10), a); }
  }
  function drawSystem() {
    const sc = SC[SYS.cls]; if (proj(0, 0, 0)) { const r = Math.max(6, 16 * P.s * (SYS.cls === 5 ? 2.2 : 1)); drawStar(P.x, P.y, r, sc, tm); }
    SYS.pl.forEach((p, k) => {
      cx.strokeStyle = 'rgba(0,240,255,.16)'; cx.lineWidth = 1; cx.beginPath(); let f = 1;
      for (let a = 0; a <= 48; a++) { const t = a / 48 * TAU, rr = p.a * (1 - p.e * Math.cos(t)); if (proj(Math.cos(t) * rr, Math.sin(t) * rr * p.inc * 2, Math.sin(t) * rr)) { if (f) { cx.moveTo(P.x, P.y); f = 0; } else cx.lineTo(P.x, P.y); } }
      cx.stroke();
      const q = ppos(p, tm); if (!proj(q[0], q[1], q[2])) return; const r = Math.max(2.5, p.r * P.s), pal = PAL[p.t];
      if (r < 4) { cx.fillStyle = rgb(pal[1], 1); cx.beginPath(); cx.arc(P.x, P.y, r, 0, TAU); cx.fill(); } else dsphere(p, P.x, P.y, r, q);
      if (p.ring) { cx.strokeStyle = 'rgba(230,210,170,.6)'; cx.lineWidth = Math.max(1, r * 0.18); cx.beginPath(); cx.ellipse(P.x, P.y, r * 1.9, r * 0.5, 0.3, 0, TAU); cx.stroke(); }
      if (p.life) { cx.strokeStyle = 'rgba(80,255,140,.7)'; cx.lineWidth = 1.4; cx.beginPath(); cx.arc(P.x, P.y, r + 3, 0, TAU); cx.stroke(); }
      if (r > 5 || p.home) label2(p.name, P.x, P.y - r - 8, Math.min(1, r / 10));
    });
  }
  function drawPlanet() {
    const p = PLN, R = LV[3].R, pal = PAL[p.t], q = ppos(p, tm); // lumière : direction planète → étoile
    const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch), lx0 = -q[0], ly0 = -q[1], lz0 = -q[2], ln = Math.hypot(lx0, ly0, lz0) || 1;
    const x1 = (lx0 * cy + lz0 * sy) / ln, z1 = (-lx0 * sy + lz0 * cy) / ln, ly = (ly0 / ln * cp - z1 * sp);
    if (!proj(0, 0, 0)) return; const X = P.x, Y = P.y, r = R * P.s, z0 = P.z;
    if (r > 6) glow(X, Y, r * 1.9, p.life ? [80, 255, 160] : pal[1], 0.22);
    const ring = (back) => { if (!p.ring) return; const ry = r * (0.1 + 0.9 * Math.abs(Math.sin(pitch))); cx.lineWidth = Math.max(1, r * 0.12); for (let k = 0; k < 3; k++) { cx.strokeStyle = 'rgba(' + (225 - k * 25) + ',' + (205 - k * 25) + ',160,' + (0.55 - k * 0.12) + ')'; cx.beginPath(); cx.ellipse(X, Y, r * (1.5 + k * 0.28), ry * (1.5 + k * 0.28), 0, back ? Math.PI : 0, back ? TAU : Math.PI); cx.stroke(); } };
    const moons = p.moons.map(m => { const a = m.ph + tm * m.sp, mx = Math.cos(a) * m.a, mz = Math.sin(a) * m.a; return { m, mx, mz, back: (-mx * sy + mz * cy) > 0 }; });
    const dm = o => { if (!proj(o.mx, 0, o.mz)) return; const rr = Math.max(2, o.m.r * P.s); const g = cx.createRadialGradient(P.x - rr * 0.3, P.y - rr * 0.3, 0, P.x, P.y, rr); g.addColorStop(0, '#ddd'); g.addColorStop(1, '#222'); cx.fillStyle = g; cx.beginPath(); cx.arc(P.x, P.y, rr, 0, TAU); cx.fill(); };
    ring(true); moons.forEach(o => { if (o.back) dm(o); });
    proj(0, 0, 0); dsphere(p, X, Y, r, q);
    ring(false); moons.forEach(o => { if (!o.back) dm(o); });
  }
  // ---------- interface ----------
  function hud() {
    if (!E.t) return; E.t.textContent = label(); E.s.textContent = ['Touche une galaxie : le vaisseau y va · glisse pour regarder', 'Touche une étoile pour y aller · ⬆ pour remonter', 'Touche une planète pour y aller · ⬆ pour remonter', 'Glisse pour tourner autour · ⬆ pour remonter'][lv];
    (E.lc || []).forEach((b, i) => b.classList.toggle('on', i === lv));
  }
  function doFrame(dt) {
    const ds = Math.min(0.05, dt / 1000); tm += ds * (lv >= 2 ? 6 : 1); fade = Math.min(1, fade + ds * 1.6); flash = Math.max(0, flash - ds * 0.9);
    if (auto && !drag) yaw += ds * 0.08;
    if (tr) { tr.t += ds / 0.9; const e = 1 - Math.pow(1 - Math.min(1, tr.t), 3); tx = tr.from[0] + (tr.to[0] - tr.from[0]) * e; ty = tr.from[1] + (tr.to[1] - tr.from[1]) * e; tz = tr.from[2] + (tr.to[2] - tr.from[2]) * e; dist = tr.from[3] + (tr.to[3] - tr.from[3]) * e; fade = 1 - e * 0.8; if (tr.t >= 1) { tr = null; enter(lv + 1); } }
    if (pilot && !tr) flight(ds);
    cx.setTransform(M().size.dpr, 0, 0, M().size.dpr, 0, 0); cx.imageSmoothingEnabled = true; cx.imageSmoothingQuality = 'high'; cx.globalAlpha = 1; cx.fillStyle = '#02000c'; cx.fillRect(0, 0, W, H);
    cx.globalAlpha = fade; sky(); cx.globalAlpha = fade;
    if (lv === 0) drawUniverse(); else if (lv === 1) drawGalaxy(); else if (lv === 2) drawSystem(); else drawPlanet();
    cx.globalAlpha = 1; if (flash > 0) { const g = cx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.7); g.addColorStop(0, 'rgba(180,240,255,' + flash + ')'); g.addColorStop(1, 'rgba(180,240,255,0)'); cx.fillStyle = g; cx.fillRect(0, 0, W, H); }
    if (pilot) reticle();
    if (E.z) E.z.textContent = pilot ? 'vitesse ' + Math.round(Math.abs(vel) / (LV[lv].R * 0.3) * 100) + ' %' : 'dist ' + Math.round(dist);
  }
  let drag = false;
  function zoom(k) {
    if (tr) return; const o = LV[lv]; dist /= k;
    if (dist < o.min) { dist = o.min; if (k > 1 && lv < 3) { const L = cands(), i = near(L, q => q, Math.min(W, H) * 0.42); if (i >= 0) dive(i); } }
    else if (dist > o.max) { dist = o.max; if (k < 1 && lv > 0) rise(); }
  }
  CU.X3 = { ptex, PAL, ATM };
  CU.Modes.register('ex', {
    open(c) {
      cv = c.cv; cx = c.ctx; ui = c.ui; const s = d(); if (!s.seed) { s.seed = (Math.random() * 1e9) | 0 + 1; CU.Save.mark(); }
      const r = CU.rng(s.seed + 1); for (let i = 0; i < SKY.length; i += 3) { const a = r() * TAU, b = Math.asin(r() * 2 - 1); SKY[i] = Math.cos(b) * Math.cos(a); SKY[i + 1] = Math.sin(b); SKY[i + 2] = Math.cos(b) * Math.sin(a); }
      this.resize(); genUniverse(); GAL = SYS = PLN = null; tm = 0; tr = null; lv = -1; fade = 1;
      const sv = s.ex || { lv: 0, gi: 0, si: 0, pi: 0 }; path = { gi: sv.gi, si: sv.si, pi: sv.pi }; if (path.gi >= UNI.G.length) path.gi = 0;
      const M_ = M(); ui.innerHTML = '';
      kd = e => { const k = (e.key || '').toLowerCase(); if (k === 'w' || k === 'arrowup') thr = e.shiftKey ? 3 : 1; else if (k === 's' || k === 'arrowdown') thr = -0.5; }; ku = () => { thr = 0; }; addEventListener('keydown', kd); addEventListener('keyup', ku);
      const top = M_.el('div', 'tl', '<b id="ext"></b><span id="exs"></span>', ui); E = { t: top.querySelector('b'), s: top.querySelector('span') };
      const pn = M_.el('div', 'fl', null, ui); E.lc = []; E.z = M_.el('span', 'lst', '', pn);
      const hold = (t, v, cls) => { const b = M_.el('button', 'fb ' + cls, t, pn), on = e => { e.preventDefault(); thr = v; b.classList.add('on'); }, off = () => { if (thr === v) thr = 0; b.classList.remove('on'); }; b.onpointerdown = on; b.onpointerup = b.onpointercancel = b.onpointerleave = off; };
      hold('▲ AVANCER', 1, 'go');
      M_.el('button', 'chip hm', '⌂', ui).onclick = () => { path = { gi: 0, si: 0, pi: 2 }; go(3); CU.Sound.ui(); };
      M_.el('button', 'chip hm hm2', '⬆', ui).onclick = () => { rise(); CU.Sound.ui(); };
      M_.el('button', 'chip hm hm3', '∞', ui).onclick = () => { CU.Sound.ui(); CU.Modes.go('inf'); };
      M_.gesture(cv, {
        down() { drag = true; }, move(x, y, dx, dy) { if (tr) return; if (pilot) { if (Math.abs(dx) + Math.abs(dy) > 2) ap = -1; yaw -= dx * 0.006; pitch = cl(pitch + dy * 0.006, -1.45, 1.45); return; } if (fly) { const k = dist / F, cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch), B = LV[lv].R * 1.3;
            tx = cl(tx - dx * k * cy + dy * k * (sp * sy), -B, B); ty = cl(ty + dy * k * cp, -B, B); tz = cl(tz - dx * k * sy - dy * k * (-sp * cy), -B, B); }
          else { yaw -= dx * 0.008; pitch = cl(pitch + dy * 0.008, -1.45, 1.45); } },
        up(x, y, tap) { drag = false; if (tap && !tr) { const i = pick(x, y); if (i >= 0) { if (pilot) ap = i; else dive(i); } } }, pinch: k => { if (pilot) spd = cl(spd * k, 0.3, 4); else zoom(k); }
      });
      if (s.ex && sv.lv > 0) { go(sv.lv); } else { lv = 0; fade = 0; dist = LV[0].d; tx = ty = tz = 0; place(0); hud(); }
      this.resize();
    },
    resize() { const s = M().size; W = s.w; H = s.h; F = Math.min(W, H) * 0.95; },
    frame(dt) { doFrame(dt); },
    close() { tr = null; drag = false; thr = vel = 0; removeEventListener('keydown', kd); removeEventListener('keyup', ku); CU.Save.flush(); }
  });
})();
