// ===== COSMOS (v0.3) : univers → galaxie → système solaire → planète =====
// Niveaux : 0 univers · 1 galaxie · 2 système · 3 planète. Un seul niveau existe à la fois (mobile-friendly).
(function () {
const ADD = Phaser.BlendModes.ADD, TAU = 6.2832, TILT = 0.5;
CU.rng = seed => { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
CU.mix = (a, b, t) => { t = t < 0 ? 0 : t > 1 ? 1 : t; return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; };
const SY = 'ka lo ve ri ax or um el zy na ta shi dra ko mu pe'.split(' ');
CU.nameGen = r => { const p = () => SY[r() * SY.length | 0], s = p() + p() + (r() < 0.5 ? p() : ''); return s[0].toUpperCase() + s.slice(1); };
const pickW = (w, r) => { let t = 0, k; for (k in w) t += w[k]; let x = r() * t; for (k in w) { x -= w[k]; if (x <= 0) return k; } return k; };

const PAL = {
  terra: { deep: [6, 36, 105], shallow: [40, 150, 220], beach: [214, 200, 140], land1: [50, 135, 70], land2: [120, 110, 60], high: [120, 110, 105] },
  desert: { deep: [120, 65, 40], shallow: [170, 100, 55], beach: [225, 180, 120], land1: [196, 120, 60], land2: [150, 80, 45], high: [105, 70, 60] },
  ice: { deep: [70, 120, 170], shallow: [150, 200, 235], beach: [230, 240, 250], land1: [225, 238, 250], land2: [165, 200, 230], high: [120, 150, 190] },
  lava: { deep: [25, 12, 12], shallow: [45, 20, 18], beach: [60, 30, 25], land1: [55, 25, 20], land2: [90, 40, 30], high: [70, 50, 45] },
  rock: { deep: [85, 82, 80], shallow: [120, 116, 112], beach: [150, 145, 140], land1: [130, 126, 122], land2: [105, 100, 98], high: [170, 165, 160] }
};
const LAND = [[[50, 135, 70], [120, 110, 60], [115, 105, 100]], [[90, 140, 50], [150, 120, 50], [130, 110, 90]], [[120, 60, 140], [160, 100, 170], [200, 190, 210]]];
const SEAS = [[[6, 36, 105], [40, 150, 220]], [[5, 70, 80], [50, 190, 180]]];
const GAS = [[[220, 180, 130], [180, 120, 80], [235, 215, 170], [150, 100, 70]], [[150, 190, 220], [100, 150, 200], [200, 225, 240], [80, 120, 180]],
  [[230, 200, 120], [200, 160, 80], [245, 230, 170], [170, 130, 70]], [[190, 140, 210], [140, 90, 170], [225, 200, 235], [110, 70, 140]]];
const STAR = [
  { fr: 'naine rouge', col: 0xff7a4a, R: [16, 22], w: 1 }, { fr: 'naine orange', col: 0xffa858, R: [21, 27], w: 1.3 },
  { fr: 'naine jaune', col: 0xffe38a, R: [25, 31], w: 1.6 }, { fr: 'étoile blanche', col: 0xfff4e0, R: [30, 36], w: 0.9 },
  { fr: 'étoile bleue', col: 0xa8c8ff, R: [34, 42], w: 0.6 }, { fr: 'géante rouge', col: 0xff5a3a, R: [48, 60], w: 0.5 }];
const PT = { terra: 'monde océanique', desert: 'monde désertique', ice: 'monde glacé', lava: 'monde volcanique', gas: 'géante gazeuse' };
const GCOL = [[150, 190, 255], [150, 230, 255], [255, 160, 230], [255, 215, 140]];

// ---------- Planète procédurale : carte + disque éclairé (océans, continents, nuages, atmosphère) ----------
CU.makePlanet = (r, i, n, st, home) => {
  const f = i / Math.max(1, n - 1), t = home ? 'terra' : pickW({ gas: 0.08 + 0.6 * f, lava: 0.22 * (1 - f), terra: 0.3, desert: 0.2, ice: 0.08 + 0.3 * f }, r);
  const sp = { t, seed: (r() * 1e5 | 0) + 1, moons: [], ring: false, cloud: 0, ice: 1.2, sea: 0.5, at: [60, 140, 255], ak: 1, dry: false, home: !!home };
  let nm = 0;
  if (t === 'terra') {
    const L = LAND[home ? 0 : r() * 3 | 0], S = SEAS[home ? 0 : r() < 0.75 ? 0 : 1];
    sp.pal = Object.assign({}, PAL.terra, { land1: L[0], land2: L[1], high: L[2], deep: S[0], shallow: S[1] });
    sp.sea = 0.45 + r() * 0.1; sp.ice = 0.86 + r() * 0.06; sp.cloud = 0.5 + r() * 0.4; sp.r = 9 + r() * 6; nm = r() < 0.4 ? 1 : r() < 0.15 ? 2 : 0;
    if (home) { sp.sea = 0.5; sp.r = 13; nm = 1; }
  } else if (t === 'desert') { sp.pal = PAL.desert; sp.dry = true; sp.sea = 0.4; sp.cloud = 0.12; sp.at = [255, 150, 80]; sp.r = 8 + r() * 5; nm = r() < 0.4 ? 1 : 0; }
  else if (t === 'ice') { sp.pal = PAL.ice; sp.sea = 0.35; sp.ice = 0.8; sp.cloud = 0.35; sp.at = [150, 200, 255]; sp.r = 8 + r() * 6; nm = r() < 0.4 ? 1 : 0; }
  else if (t === 'lava') { sp.pal = PAL.lava; sp.dry = true; sp.sea = 0.4; sp.cloud = 0.15; sp.at = [255, 80, 30]; sp.r = 6 + r() * 4; nm = r() < 0.3 ? 1 : 0; }
  else { sp.gas = GAS[r() * GAS.length | 0]; sp.bands = 3 + r() * 4; sp.at = sp.gas[2].map(v => v * 0.5); sp.ak = 0.6; sp.r = 22 + r() * 14; sp.ring = r() < 0.35; nm = 2 + (r() * 3 | 0); }
  for (let k = 0; k < nm; k++) sp.moons.push({ d: 1.7 + k * 0.75 + r() * 0.4, sp: (0.0003 + r() * 0.0004) / (1 + k * 0.6), ph: r() * TAU, r: 0.1 + r() * 0.14 });
  sp.R = Math.min(170, 60 + sp.r * 3.6);
  return sp;
};

CU.Sphere = class {
  // sp : spécification · n : diamètre px · W×H : carte · L : direction de la lumière (vers le soleil)
  constructor(sp, n, W, H, L) {
    const l = Math.hypot(L[0], L[1], L[2]);
    this.sp = sp; this.n = n; this.W = W; this.H = H; this.L = [L[0] / l, L[1] / l, L[2] / l];
    this.buildMap(); this.buildDisc();
    this.cv = document.createElement('canvas'); this.cv.width = this.cv.height = n; this.ctx = this.cv.getContext('2d'); this.img = this.ctx.createImageData(n, n);
  }
  buildMap() {
    const { W, H, sp } = this, d = new Uint8ClampedArray(W * H * 3), cl = new Uint8Array(W * H), oc = new Uint8Array(W * H), em = new Uint8Array(W * H), P = sp.pal || {};
    const ox = sp.seed * 7.13 % 50 + 3, oy = sp.seed * 3.7 % 40 + 5, oz = sp.seed * 5.9 % 60 + 2, fb = CU.fbm, lava = sp.t === 'lava';
    for (let j = 0; j < H; j++) {
      const lat = (j / H - 0.5) * Math.PI, cy = Math.cos(lat), Y = Math.sin(lat);
      for (let i = 0; i < W; i++) {
        const lon = i / W * TAU, X = Math.cos(lon) * cy, Z = Math.sin(lon) * cy, k = j * W + i;
        let c;
        if (sp.t === 'gas') {
          const w = fb(X * 1.6 + ox, Y * 2.6 + oy, Z * 1.6 + oz), t = (Math.sin((Y * sp.bands + (w - 0.5) * 1.6) * TAU) + 1) * 1.5, i0 = Math.min(2, t | 0);
          c = CU.mix(sp.gas[i0], sp.gas[i0 + 1], t - i0);
        } else {
          const h = fb(X * 2.4 + ox, Y * 2.4 + oy, Z * 2.4 + oz), s = sp.sea;
          if (Math.abs(Y) > sp.ice + (h - 0.5) * 0.1) c = [236, 246, 255];
          else if (h < s) { if (!sp.dry) oc[k] = 1; c = CU.mix(P.deep, P.shallow, 1 - (s - h) * 5); }
          else if (h < s + 0.03) c = P.beach;
          else if (h < s + 0.16) c = CU.mix(P.land1, P.land2, (h - s - 0.03) / 0.13);
          else c = P.high;
          if (lava && Math.abs(fb(X * 4 + oy, Y * 4 + oz, Z * 4 + ox) - 0.5) < 0.035) em[k] = 255;
          if (sp.cloud > 0) cl[k] = Math.min(255, Math.max(0, (fb(X * 3 + oz, Y * 3.5 + ox, Z * 3 + oy) - (0.64 - sp.cloud * 0.22)) * 5) * 255);
        }
        d[k * 3] = c[0]; d[k * 3 + 1] = c[1]; d[k * 3 + 2] = c[2];
      }
    }
    this.map = d; this.cl = cl; this.oc = oc; this.em = em;
  }
  buildDisc() {
    const n = this.n, L = this.L; this.p = []; this.lon = []; this.row = []; this.lit = []; this.rim = []; this.alp = [];
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      const dx = (x + 0.5) / n * 2 - 1, dy = (y + 0.5) / n * 2 - 1, d2 = dx * dx + dy * dy;
      if (d2 >= 1) continue;
      const z = Math.sqrt(1 - d2);
      this.p.push(y * n + x); this.lon.push(Math.atan2(dx, z));
      this.row.push(Math.floor((Math.asin(-dy) / Math.PI + 0.5) * (this.H - 1)) * this.W);
      this.lit.push(Math.max(0, dx * L[0] + dy * L[1] + z * L[2]));
      this.rim.push(Math.pow(1 - z, 3));
      this.alp.push(Math.min(1, (1 - Math.sqrt(d2)) * n * 0.5) * 255);
    }
  }
  render(rot, crot) {
    const { map: q, cl, oc, em, W, sp } = this, a = this.img.data, T = 1 / TAU, N = this.p.length, at = sp.at, ak = sp.ak;
    for (let k = 0; k < N; k++) {
      let u = ((this.lon[k] + rot) * T) % 1; if (u < 0) u += 1;
      const row = this.row[k], m = row + (u * W | 0), c = m * 3, li = this.lit[k], l = 0.09 + 0.91 * li, p = this.p[k] * 4;
      let r = q[c] * l, g = q[c + 1] * l, b = q[c + 2] * l, ca = 0;
      if (sp.cloud > 0) {
        let v = ((this.lon[k] + crot) * T) % 1; if (v < 0) v += 1;
        ca = cl[row + (v * W | 0)] / 255; const cw = 235 * (0.1 + 0.9 * li);
        r += (cw - r) * ca; g += (cw - g) * ca; b += (cw - b) * ca;
      }
      if (oc[m]) { const s = Math.pow(li, 24) * 150 * (1 - ca); r += s; g += s; b += s; }
      if (em[m]) { const e = (1 - li * 0.7) * (1 - ca * 0.6); r += 255 * e; g += 110 * e; b += 10 * e; }
      const rim = this.rim[k] * (0.3 + 0.7 * li) * ak;
      a[p] = r + rim * at[0]; a[p + 1] = g + rim * at[1]; a[p + 2] = b + rim * at[2]; a[p + 3] = this.alp[k];
    }
  }
  draw() { this.ctx.putImageData(this.img, 0, 0); }
};

// ---------- Galaxies ----------
CU.galPt = (g, r, w) => {
  if (g.type === 'ell') return [(r() + r() + r() - 1.5) / 1.5 * w * 0.45, (r() + r() + r() - 1.5) / 1.5 * w * 0.32];
  const d = Math.pow(r(), 1.5) * w * 0.47, a = (r() * g.arms | 0) * TAU / g.arms + Math.log(1 + d / (w * 0.06)) * g.wind + (r() + r() - 1) * (0.7 - 0.45 * d / (w * 0.47));
  return [Math.cos(a) * d, Math.sin(a) * d];
};
CU.bakeGalaxy = (g, w, n, off) => {
  const r = CU.rng(g.seed + off), cv = document.createElement('canvas'), h = w / 2; cv.width = cv.height = w;
  const c = cv.getContext('2d'); c.globalCompositeOperation = 'lighter';
  const col = g.col;
  for (let i = 0; i < n / 8; i++) { const p = CU.galPt(g, r, w); c.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},.03)`; c.beginPath(); c.arc(h + p[0], h + p[1], w * 0.035, 0, TAU); c.fill(); }
  for (let i = 0; i < n; i++) {
    const p = CU.galPt(g, r, w), t = Math.min(1, Math.hypot(p[0], p[1]) / (h * 0.8)), hii = r() < 0.07;
    const R = hii ? 255 : 255 + (col[0] - 255) * t, G = hii ? 120 : 215 + (col[1] - 215) * t, B = hii ? 180 : 160 + (col[2] - 160) * t, s = r() < 0.04 ? 1.8 : 0.8;
    c.fillStyle = `rgba(${R | 0},${G | 0},${B | 0},${(0.35 + r() * 0.6).toFixed(2)})`; c.fillRect(h + p[0] - s / 2, h + p[1] - s / 2, s, s);
  }
  const gr = c.createRadialGradient(h, h, 0, h, h, h * (g.type === 'ell' ? 0.55 : 0.28));
  gr.addColorStop(0, 'rgba(255,235,200,.95)'); gr.addColorStop(0.35, 'rgba(255,200,140,.3)'); gr.addColorStop(1, 'rgba(255,180,120,0)');
  c.fillStyle = gr; c.fillRect(0, 0, w, w);
  return cv;
};

// ---------- Gestionnaire ----------
CU.Cosmos = class {
  constructor(s) {
    this.s = s; this.on = false; this.lv = 3; this.objs = []; this.tw = []; this.keys = []; this.upd = null; this.busy = false; this.homeVisible = false;
    this.cur = { gi: 0, si: 0, pi: -1 }; this.sys = {}; this.mk = {}; this.L = {}; this.kc = 0; this.tm = new Phaser.GameObjects.Components.TransformMatrix();
    s.input.on('pointerdown', p => { this.dn = { x: p.x, y: p.y, t: s.time.now }; });
    s.input.on('pointerup', p => {
      const d = this.dn; if (!d || !this.on || this.busy || s.input.pointer2.isDown) return;
      if (Phaser.Math.Distance.Between(p.x, p.y, d.x, d.y) < 12 && s.time.now - d.t < 400) this.tap(p);
    });
  }
  // --- données ---
  genU() {
    const r = CU.rng(this.seed), N = CU.mobile ? 7 : 9, U = [];
    for (let i = 0; i < N; i++) {
      const size = 150 + r() * 150; let x, y, t = 0;
      do { x = (r() * 2 - 1) * 760; y = (r() * 2 - 1) * 560; } while (U.some(g => Math.hypot(g.x - x, g.y - y) < (g.size + size) * 0.45 + 20) && ++t < 80);
      U.push({ i, x, y, size, seed: r() * 1e9 | 0, type: i && r() < 0.15 ? 'ell' : 'sp', arms: 2 + (r() * 3 | 0), wind: 2.2 + r() * 1.4, tilt: 0.35 + r() * 0.65, orient: r() * TAU,
        spin: (r() < 0.5 ? -1 : 1) * (0.00005 + r() * 0.00013), col: GCOL[r() * GCOL.length | 0], name: CU.nameGen(r) });
    }
    U[0].x = -120; U[0].y = 80; U[0].type = 'sp'; U[0].size = 230; this.U = U; this.sys = {}; this.mk = {};
  }
  marks(gi) {
    if (this.mk[gi]) return this.mk[gi];
    const G = this.U[gi], r = CU.rng(G.seed + 99), out = [];
    for (let k = 0; k < 12; k++) {
      let p, t = 0; do { p = CU.galPt(G, r, 512); } while ((Math.hypot(p[0], p[1]) < 45 || out.some(o => Math.hypot(o.x - p[0], o.y - p[1]) < 32)) && ++t < 25);
      const w = {}; STAR.forEach((s, i) => w[i] = s.w);
      out.push({ x: p[0], y: p[1], seed: r() * 1e9 | 0, cls: +pickW(w, r), name: CU.nameGen(r) });
    }
    if (gi === 0) { out[0].cls = 2; out[0].name = 'Héliora'; }
    return this.mk[gi] = out;
  }
  getSys(gi, si) {
    const key = gi * 100 + si; if (this.sys[key]) return this.sys[key];
    const mk = this.marks(gi)[si], r = CU.rng(mk.seed), st = STAR[mk.cls], R = st.R[0] + r() * (st.R[1] - st.R[0]), home = gi === 0 && si === 0;
    const n = Math.max(home ? 4 : 3, 3 + (r() * 4 | 0)), pl = []; let a = 80 + R * 1.4;
    for (let i = 0; i < n; i++) {
      a += 44 + r() * 22; const sp = CU.makePlanet(r, i, n, st, home && i === 2);
      Object.assign(sp, { a, th: r() * TAU, w: 0.00009 * Math.pow(95 / a, 1.5), name: sp.home ? 'Monde natal' : mk.name + ' ' + 'bcdefgh'[i] }); pl.push(sp);
    }
    return this.sys[key] = { name: mk.name, st, R, planets: pl, home };
  }
  curPlanet() {
    const S = this.getSys(this.cur.gi, this.cur.si), pl = S.planets;
    return this.cur.pi >= 0 && pl[this.cur.pi] ? pl[this.cur.pi] : pl.find(p => p.home) || pl[Math.min(1, pl.length - 1)];
  }
  label() {
    const G = this.U[this.cur.gi], S = this.getSys(this.cur.gi, this.cur.si);
    return ['Univers · ' + this.U.length + ' galaxies', 'Galaxie ' + G.name + (G.type === 'ell' ? ' · elliptique' : ' · spirale'), 'Système ' + S.name + ' · ' + S.st.fr + ' · ' + S.planets.length + ' planètes',
      this.curPlanet().name + ' · ' + PT[this.curPlanet().t]][this.lv];
  }
  // --- cycle de vie ---
  start() {
    this.seed = Math.random() * 1e9 | 0; this.genU(); this.on = true; this.busy = false; this.clear(); this.lv = 3; this.cur = { gi: 0, si: 0, pi: -1 };
    this.homeVisible = true; this.bP(true); this.s.events.emit('level', 3, this.label());
  }
  reset() { this.on = false; this.busy = false; this.clear(); this.homeVisible = false; }
  home() { if (this.on && !(this.lv === 3 && this.curPlanet().home)) { this.cur = { gi: 0, si: 0, pi: -1 }; if (this.lv === 3) { this.clear(); this.bP(false); this.s.events.emit('level', 3, this.label()); } else this.go(3); } }
  clear() {
    const s = this.s; this.tw.forEach(t => t.remove()); this.tw = []; this.objs.forEach(o => o.destroy()); this.objs = [];
    this.keys.forEach(k => s.textures.exists(k) && s.textures.remove(k)); this.keys = []; this.upd = null; this.L = {};
    if (this.homeVisible) { s.planet.hide(); this.homeVisible = false; }
  }
  add(o) { this.objs.push(o); return o; }
  tex(key, cv) { this.s.textures.addCanvas(key, cv); this.keys.push(key); return key; }
  build(L) { [this.bU, this.bG, this.bS, this.bP][L].call(this, false); }
  update(dt) { if (this.upd) this.upd(Math.min(dt, 50)); }
  // --- interaction ---
  cands() {
    if (this.lv === 0) return this.U.map((G, i) => ({ x: G.x, y: G.y, rad: Math.max(45, G.size * 0.5), sel: { gi: i, si: 0, pi: -1 } }));
    if (this.lv === 1) { const a = this.L.m.map((o, i) => { o.getWorldTransformMatrix(this.tm); return { x: this.tm.tx, y: this.tm.ty, rad: 60 / Math.min(1, this.s.cam.z), sel: { si: i, pi: -1 } }; }); a.push({ x: 0, y: 0, rad: 46 / Math.min(1, this.s.cam.z), bh: true }); return a; }
    if (this.lv === 2) return this.L.p.map((q, i) => ({ x: q.im.x, y: q.im.y, rad: 38 / Math.min(1, this.s.cam.z) + q.sp.r, sel: { pi: i } }));
    return [];
  }
  tap(p) {
    const w = this.s.cameras.main.getWorldPoint(p.x, p.y); let b = null, bd = 1e9;
    this.cands().forEach(k => { const d = Math.hypot(k.x - w.x, k.y - w.y); if (d < k.rad && d < bd) { bd = d; b = k; } });
    if (b) { if (b.bh) return CU.Modes.open('bh'); this.go(this.lv + 1, b.sel, b.x, b.y); }
  }
  step(d) { // appelé par la caméra quand on zoome/dézoome au-delà des limites
    if (!this.on || this.busy) return;
    if (d < 0) return this.go(this.lv - 1);
    const cam = this.s.cam; let b = null, bd = 1e9;
    this.cands().forEach(k => { const e = Math.hypot(k.x - cam.x, k.y - cam.y); if (e < bd) { bd = e; b = k; } });
    if (b) { if (b.bh) return CU.Modes.open('bh'); this.go(this.lv + 1, b.sel, b.x, b.y); }
  }
  go(L, sel, fx, fy) {
    const s = this.s, cam = s.cam, c = s.cameras.main;
    if (!this.on || this.busy || L === this.lv || L < 0 || L > 3) return;
    this.busy = true; if (sel) Object.assign(this.cur, sel);
    const down = L > this.lv, o = { x: cam.x, y: cam.y, z: cam.z }; cam.vx = cam.vy = 0;
    s.tweens.add({ targets: o, x: fx === undefined ? o.x : fx, y: fy === undefined ? o.y : fy, z: down ? Math.max(cam.z * 2.2, 2.6) : 0.25, duration: 500, ease: 'Cubic.easeIn',
      onUpdate: () => { cam.x = o.x; cam.y = o.y; cam.z = o.z; } });
    c.fadeOut(520, 3, 0, 15);
    c.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.clear(); this.lv = L; this.build(L);
      cam.x = L === 0 ? this.U[this.cur.gi].x : 0; cam.y = L === 0 ? this.U[this.cur.gi].y : 0; cam.z = down ? 0.45 : 2.4; c.setZoom(cam.z);
      c.fadeIn(650, 3, 0, 15);
      const o2 = { z: cam.z };
      s.tweens.add({ targets: o2, z: 1, duration: 950, ease: 'Cubic.easeOut', onUpdate: () => { cam.z = o2.z; s.events.emit('zoom', o2.z); }, onComplete: () => { this.busy = false; } });
      s.events.emit('level', L, this.label());
    });
  }
  // --- niveau 0 : univers ---
  bU() {
    const s = this.s, list = [];
    this.U.forEach(G => {
      const key = this.tex('gx' + G.i, CU.bakeGalaxy(G, 160, CU.mobile ? 900 : 1600, 0));
      const c = this.add(s.add.container(G.x, G.y).setScale(1, G.tilt).setRotation(G.orient).setDepth(1));
      G.im = s.add.image(0, 0, key).setDisplaySize(G.size, G.size).setBlendMode(ADD); c.add(G.im); list.push(G);
      this.add(s.add.text(G.x, G.y + G.size * 0.3 + 12, (G.i ? '' : '▼ ') + G.name, { font: '11px system-ui', color: G.i ? '#9fdcff' : '#00f0ff' }).setOrigin(0.5).setAlpha(G.i ? 0.55 : 1).setDepth(3));
    });
    const H = this.U[0]; this.add(s.add.image(H.x, H.y, 'glow').setTint(0x00f0ff).setBlendMode(ADD).setDisplaySize(H.size * 1.2, H.size * 1.2).setAlpha(0.3).setDepth(0));
    this.upd = dt => list.forEach(G => { G.im.rotation += G.spin * dt; });
  }
  // --- niveau 1 : galaxie ---
  bG() {
    const s = this.s, G = this.U[this.cur.gi], W = 512, K = 1000 / W, n = CU.mobile ? 3200 : 6500;
    const kA = this.tex('gxA', CU.bakeGalaxy(G, W, n, 1)), kB = this.tex('gxB', CU.bakeGalaxy(G, W, n / 2, 2));
    const outer = this.add(s.add.container(0, 0).setScale(1, G.tilt).setRotation(G.orient).setDepth(1)), inner = s.add.container(0, 0);
    const B = s.add.image(0, 0, kB).setScale(K).setBlendMode(ADD).setAlpha(0.7), A = s.add.image(0, 0, kA).setScale(K).setBlendMode(ADD);
    const core = s.add.image(0, 0, 'glow').setTint(0xffd9a0).setBlendMode(ADD).setDisplaySize(260, 260).setAlpha(0.7);
    inner.add(A); outer.add([B, inner, core]); this.L.m = [];
    outer.add(s.add.circle(0, 0, 6, 0x000000).setStrokeStyle(1.5, 0xffb060)); // trou noir central : touche-le ou zoome dessus
    this.marks(this.cur.gi).forEach((m, i) => {
      const x = m.x * K, y = m.y * K, st = STAR[m.cls], sz = 34 + st.R[1] * 0.8;
      const gl = s.add.image(x, y, 'glow').setTint(st.col).setBlendMode(ADD).setDisplaySize(sz, sz), dot = s.add.image(x, y, 's3').setDisplaySize(9, 9);
      inner.add([gl, dot]); this.L.m.push(gl);
      if (this.cur.gi === 0 && i === 0) { const ring = s.add.image(x, y, 'glow').setTint(0x00f0ff).setBlendMode(ADD).setDisplaySize(90, 90).setAlpha(0.6); inner.add(ring);
        this.tw.push(s.tweens.add({ targets: ring, alpha: 0.15, duration: 1200, yoyo: true, repeat: -1 })); }
    });
    const sp = Math.abs(G.spin) * 0.8 * (G.spin < 0 ? -1 : 1);
    this.upd = dt => { inner.rotation += sp * dt; B.rotation += sp * 1.35 * dt; };
  }
  // --- niveau 2 : système solaire ---
  bS() {
    const s = this.s, S = this.getSys(this.cur.gi, this.cur.si), st = S.st, list = [];
    const g = this.add(s.add.graphics().setDepth(0)); g.lineStyle(1, 0x00f0ff, 0.18);
    S.planets.forEach(p => g.strokeEllipse(0, 0, p.a * 2, p.a * 2 * TILT));
    const halo = this.add(s.add.image(0, 0, 'glow').setTint(st.col).setBlendMode(ADD).setDisplaySize(S.R * 7, S.R * 7).setDepth(2));
    this.add(s.add.image(0, 0, 'glow').setTint(0xffffff).setBlendMode(ADD).setDisplaySize(S.R * 2.6, S.R * 2.6).setDepth(2));
    this.add(s.add.image(0, 0, 'glow').setTint(st.col).setBlendMode(ADD).setDisplaySize(S.R * 3.6, S.R * 3.6).setDepth(2));
    this.tw.push(s.tweens.add({ targets: halo, alpha: 0.6, duration: 1800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' }));
    S.planets.forEach((p, i) => {
      const sph = new CU.Sphere(p, 48, 96, 48, [-1, 0, 0.5]); sph.render(0, 0.5); sph.draw();
      const im = this.add(s.add.image(0, 0, this.tex('pl' + i, sph.cv)).setDisplaySize(p.r * 2.4, p.r * 2.4));
      const ms = p.moons.map(m => ({ m, im: this.add(s.add.image(0, 0, 's2').setTint(0xcfd6e6).setScale(0.7).setDepth(3)) }));
      list.push({ sp: p, im, ms });
    });
    this.L.p = list;
    this.upd = dt => list.forEach(q => {
      const p = q.sp; p.th += p.w * dt; const x = Math.cos(p.th) * p.a, y = Math.sin(p.th) * p.a * TILT;
      q.im.setPosition(x, y).setDepth(y > 0 ? 3 : 1).setRotation(Math.atan2(-y, -x) - Math.PI); q.ang = p.th;
      q.ms.forEach(o => { const t = o.m.ph + p.th * 0 + s.time.now * o.m.sp * 2, d = p.r * (1.5 + o.m.d * 0.5); o.im.setPosition(x + Math.cos(t) * d, y + Math.sin(t) * d * TILT).setDepth(y > 0 ? 4 : 1); });
    });
  }
  // --- niveau 3 : planète (océans, continents, nuages, atmosphère, lunes, anneaux) ---
  bP(fromStart) {
    const s = this.s, sp = this.curPlanet(), th = sp.th || 0.6, L = [-Math.cos(th), -Math.sin(th) * 0.5, 0.45];
    const sunCol = this.getSys(this.cur.gi, this.cur.si).st.col, tilt = -0.3;
    this.add(s.add.image(L[0] * 330, L[1] * 330, 'glow').setTint(sunCol).setBlendMode(ADD).setDisplaySize(300, 300).setAlpha(0.65).setDepth(0));
    this.add(s.add.image(L[0] * 330, L[1] * 330, 'glow').setTint(0xffffff).setBlendMode(ADD).setDisplaySize(70, 70).setDepth(0));
    let R, render = null, back = null, front = null, spd = 1.2e-4;
    if (sp.home) {
      R = 130; this.homeVisible = true; if (!fromStart) { s.planet.hide(); s.planet.reveal(700); }
    } else {
      R = sp.R; const n = CU.mobile ? 144 : 176, sph = new CU.Sphere(sp, n, 256, 128, L); sph.render(0, 0); sph.draw();
      const tx = s.textures.addCanvas('pv', sph.cv); this.keys.push('pv');
      this.add(s.add.image(0, 0, 'glow').setTint(Phaser.Display.Color.GetColor(...sp.at.map(v => Math.min(255, v * 1.6 | 0)))).setBlendMode(ADD).setDisplaySize(R * 3.1, R * 3.1).setAlpha(0.75).setDepth(1));
      this.add(s.add.image(0, 0, 'pv').setDisplaySize(R * 2, R * 2).setDepth(2));
      if (sp.ring) {
        const w = 256, h = 72, mk = top => { const cv = document.createElement('canvas'), c = cv.getContext('2d'); cv.width = w; cv.height = h; c.beginPath(); c.rect(0, top ? 0 : h / 2, w, h / 2); c.clip();
          const r = CU.rng(sp.seed), col = sp.gas[2]; for (let i = 0; i < 70; i++) { const rr = 0.62 + 0.38 * i / 70; c.strokeStyle = `rgba(${col[0]},${col[1]},${col[2]},${(0.15 + r() * 0.5) * (i % 23 < 2 ? 0.1 : 1)})`; c.lineWidth = 2.4; c.beginPath(); c.ellipse(w / 2, h / 2, rr * w / 2, rr * h / 2, 0, 0, TAU); c.stroke(); } return cv; };
        const rw = R * 4.6; back = this.add(s.add.image(0, 0, this.tex('rb', mk(true))).setDisplaySize(rw, rw * 72 / 256).setRotation(tilt).setDepth(1.5));
        front = this.add(s.add.image(0, 0, this.tex('rf', mk(false))).setDisplaySize(rw, rw * 72 / 256).setRotation(tilt).setDepth(2.5));
      }
      let f = 0, rot = 0; spd = sp.t === 'gas' ? 2.2e-4 : 1.2e-4;
      render = dt => { rot += dt * spd; if ((f++ & 1) === 0) { sph.render(rot, rot * 1.35 + 0.7); sph.draw(); tx.refresh(); } };
    }
    // lunes
    const mo = sp.moons.map((m, k) => {
      const ms = { t: 'rock', seed: 50 + k * 13 + (m.ph * 100 | 0), sea: 0.45, ice: 1.2, cloud: 0, dry: true, pal: PAL.rock, at: [0, 0, 0], ak: 0 }, sph = new CU.Sphere(ms, 40, 64, 32, [-0.6, -0.4, 0.7]);
      sph.render(0, 0); sph.draw(); const d = R * (0.12 + m.r * 0.8), im = this.add(s.add.image(0, 0, this.tex('mn' + k, sph.cv)).setDisplaySize(d, d));
      return { m, im };
    }), ct = Math.cos(tilt), st = Math.sin(tilt); let T = 0;
    this.upd = dt => {
      if (render) render(dt); T += dt;
      mo.forEach(o => { const t = o.m.ph + T * o.m.sp, a = R * o.m.d, x = Math.cos(t) * a, y = Math.sin(t) * a * 0.3, sn = Math.sin(t);
        o.im.setPosition(x * ct - y * st, x * st + y * ct).setDepth(sn > 0 ? 3 : 1); o.im.setDisplaySize(R * (0.12 + o.m.r * 0.8) * (1 + 0.18 * sn), R * (0.12 + o.m.r * 0.8) * (1 + 0.18 * sn)); });
    };
  }
};
})();
