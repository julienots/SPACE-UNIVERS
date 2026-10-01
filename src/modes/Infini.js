// ===== VOYAGE INFINI (v0.8) : espace sans fin généré à la volée (cellules déterministes), croisière / vitesse lumière =====
(function () {
  const TAU = 6.2832, C = 900, RC = CU.mobile ? 1 : 3, cl = (v, a, b) => v < a ? a : v > b ? b : v, rgb = (c, a) => 'rgba(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ',' + a + ')';
  const MONSTER_COLORS = [[80,220,190],[160,90,255],[255,80,100],[120,190,255]]; const SC = [[255, 122, 74], [255, 168, 88], [255, 227, 138], [255, 244, 224], [168, 200, 255], [255, 90, 58]], NC = [[255, 90, 190], [90, 150, 255], [120, 240, 230], [255, 170, 90]], NM = ['Planète océanique', 'Planète désertique', 'Planète glacée', 'Planète volcanique', 'Géante gazeuse'], KN = ['Étoile', '', 'Trou noir', 'Nébuleuse'];
  let W = 0, H = 0, F = 0, cx, ui, E = {}, yaw = 0, pitch = 0, px = 450, py = 450, pz = 100, wv = 0, warp = false, sd = 1, cells = new Map(), vis = [], vk = '', ob = [], tm = 0, nd = 1e9, kd = null, ts = 0, btn = null, vel = 0, thr = false, brk = false, bb = null, ap = false, tg = null, lk = null, scEl = null, scT = 0, apb = null, cf = 0, orb = 0, tsx = 1, tbt = null, sel = null, fl = 0, apw = false, kill = {}, mods = {}, gvx = 0, gvy = 0, gvz = 0, gm = 0, bhx = 0, bhy = 0, bhr = 0, joy = null, zm = 1, lz = null, ex = null, shk = 0, hs = null, age = 13800, le = -1, bz = null, pa = 13800, shx = 0, shy = 0, shw = 100, rl = 0, lyaw = 0, cfg = { hu: 0, co: 0, en: 0, tr: 0, ds: 2, bh: 2, nb: 2, hd: 0, nm: 'Odyssée' }, hg = null, lbtn = null, lp = null, sf = null, whCd = 0, qStamp = ''; const bcs = [], whs = [], wc = { st: new Float32Array(0), o: whs }, WM = new Map(); const gods = [], gc = { st: new Float32Array(0), o: gods };
  const hh = (a, b, c, k) => { let h = Math.imul(a, 374761393) ^ Math.imul(b, 668265263) ^ Math.imul(c, 1274126177) ^ Math.imul(k + sd, 1103515245); h = Math.imul(h ^ h >>> 13, 1274126177); return ((h ^ h >>> 16) >>> 0) / 4294967296; };
  function cell(ix, iy, iz) { // une cellule = 14 étoiles de fond + (parfois) un objet : étoile 15 %, planète 16 %, trou noir 1,5 %, nébuleuse 5,5 %
    const key = ix + ',' + iy + ',' + iz; let c = cells.get(key); if (c) return c;
    const n = CU.mobile ? 6 : 14, st = new Float32Array(n * 4), o = [], x0 = ix * C, y0 = iy * C, z0 = iz * C;
    for (let i = 0; i < n; i++) { st[i * 4] = x0 + hh(ix, iy, iz, 10 + i) * C; st[i * 4 + 1] = y0 + hh(ix, iy, iz, 30 + i) * C; st[i * 4 + 2] = z0 + hh(ix, iy, iz, 50 + i) * C; st[i * 4 + 3] = 0.3 + hh(ix, iy, iz, 70 + i) * 0.7; }
    const q = hh(ix, iy, iz, 1), home = !ix && !iy && iz === 1, k = home ? 1 : q < 0.15 ? 0 : q < 0.31 ? 1 : q < 0.36 ? 2 : q < 0.47 ? 3 : -1;
    if (k >= 0) { const r = j => hh(ix, iy, iz, 100 + j), t = home ? 0 : (r(1) * 5) | 0, e = { k, x: x0 + (home ? 0.5 : 0.15 + r(2) * 0.7) * C, y: y0 + (home ? 0.5 : 0.15 + r(3) * 0.7) * C, z: z0 + (home ? 0.4 : 0.15 + r(4) * 0.7) * C, seed: (r(5) * 1e9) | 0, t, c: k === 0 ? SC[(r(6) * 6) | 0] : NC[(r(6) * 4) | 0], ring: r(7) < 0.3 };
      e.r = k === 0 ? 34 + r(8) * 40 : k === 1 ? (t === 4 ? 40 + r(8) * 30 : 16 + r(8) * 24) : k === 2 ? 40 + r(8) * 50 : 260 + r(8) * 200; o.push(e);
      if (k === 0 && !home) { const n = 2 + ((r(9) * 4) | 0); let ap = e.r * 1.8; for (let j = 0; j < n; j++) { const a = (ap += 70 + r(20 + j) * 60), f = a / (e.r * 1.8 + n * 100), t = f < 0.3 ? (r(40 + j) < 0.5 ? 3 : 1) : f < 0.6 ? (r(40 + j) < 0.7 ? 0 : 1) : f < 0.8 ? 2 : 4;
        o.push({ k: 1, par: e, a, a0: r(50 + j) * TAU, w: 0.02 * Math.pow(120 / a, 1.5), inc: (r(60 + j) - 0.5) * 0.12, seed: (r(70 + j) * 1e9) | 0, t, c: SC[0], ring: t === 4 && r(80 + j) < 0.5, r: t === 4 ? 26 + r(90 + j) * 18 : 10 + r(90 + j) * 14, x: e.x + a, y: e.y, z: e.z }); } e.belt = ap + 90; } }
    // Les créatures géantes ne sont jamais générées automatiquement.
    for (const e of o) if (mods[e.seed] != null) { if (e.k === 1) e.t = mods[e.seed]; else if (e.k === 0) e.c = SC[mods[e.seed]]; }
    c = { ix, iy, iz, st, o }; cells.set(key, c); return c;
  }
  function rebuild() {
    const ix = Math.floor(px / C), iy = Math.floor(py / C), iz = Math.floor(pz / C), key = ix + ',' + iy + ',' + iz; if (key === vk) return; vk = key; vis = [];
    for (let a = -RC; a <= RC; a++) for (let b = -RC; b <= RC; b++) for (let c = -RC; c <= RC; c++) vis.push(cell(ix + a, iy + b, iz + c)); vis.push(gc); vis.push(wc); updateWH();
    if (cells.size > 700) cells.forEach((v, k) => { if (Math.abs(v.ix - ix) > RC + 1 || Math.abs(v.iy - iy) > RC + 1 || Math.abs(v.iz - iz) > RC + 1) cells.delete(k); });
  }
  function planetQuality() { const q = CU.Q && CU.Q.tier || 'high'; return q === 'ultra' ? { map: CU.mobile ? 1152 : 2048, cap: CU.mobile ? 896 : 1408 } : q === 'high' ? { map: CU.mobile ? 768 : 1280, cap: CU.mobile ? 640 : 1024 } : q === 'med' ? { map: CU.mobile ? 640 : 896, cap: CU.mobile ? 512 : 768 } : { map: 512, cap: CU.mobile ? 384 : 576 }; }
  function mk(o, S) { // planète haute définition : texture procédurale + éclairage physique simplifié, sans pixelisation visible
    const pq = planetQuality(); S = S || pq.cap; o.spS = S; const T = CU.X3.ptex(o, pq.map), c = document.createElement('canvas'); c.width = c.height = S; const x = c.getContext('2d'), im = x.createImageData(S, S), D = im.data, at = CU.X3.ATM[o.t], off = (o.seed % 628) / 100;
    for (let j = 0, k = 0; j < S; j++) for (let i = 0; i < S; i++, k += 4) {
      const u = (i + 0.5) / S * 2 - 1, v = 1 - (j + 0.5) / S * 2, r2 = u * u + v * v; if (r2 >= 1) continue; const nz = Math.sqrt(1 - r2), uu = ((Math.atan2(nz, u) + off) / TAU % 1 + 1) % 1 * T.w, vv = Math.min(T.h - 1, Math.max(0, (Math.asin(v) / 3.1416 + 0.5) * T.h - 0.5)), xa0 = Math.floor(uu - 0.5), wx = uu - 0.5 - xa0, xa = (xa0 + T.w) % T.w, xb = (xa + 1) % T.w, y0 = vv | 0, y1 = Math.min(T.h - 1, y0 + 1), wy = vv - y0, ia = (y0 * T.w + xa) * 4, ib = (y0 * T.w + xb) * 4, ic = (y1 * T.w + xa) * 4, id = (y1 * T.w + xb) * 4, w0 = (1 - wx) * (1 - wy), w1 = wx * (1 - wy), w2 = (1 - wx) * wy, w3 = wx * wy, cc = (T.cl[y0 * T.w + xa] * w0 + T.cl[y0 * T.w + xb] * w1 + T.cl[y1 * T.w + xa] * w2 + T.cl[y1 * T.w + xb] * w3) / 255;
      const dl = -0.62 * u + 0.35 * v + 0.7 * nz, tt = cl((dl + 0.1) / 0.4, 0, 1), sh = 0.06 + 0.94 * tt * tt * (3 - 2 * tt), f = Math.pow(1 - nz, 3) * (0.2 + 0.8 * Math.max(0, dl + 0.3));
      for (let m = 0; m < 3; m++) { const tv = T.d[ia + m] * w0 + T.d[ib + m] * w1 + T.d[ic + m] * w2 + T.d[id + m] * w3; D[k + m] = (tv + (255 - tv) * cc * 0.9) * sh + at[m] * f; } D[k + 3] = Math.min(255, (1 - Math.sqrt(r2)) * S * 127);
    }
    x.putImageData(im, 0, 0); return c;
  }
  function glow(x, y, r, c, a) { const g = cx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgb(c, a)); g.addColorStop(0.4, rgb(c, a * 0.3)); g.addColorStop(1, rgb(c, 0)); cx.fillStyle = g; cx.fillRect(x - r, y - r, r * 2, r * 2); }
  function refreshQualityAssets() { const stamp = CU.Q ? CU.Q.tier : 'high'; if (stamp === qStamp) return; qStamp = stamp; SFB = null;
    const clear = o => { delete o.sp; delete o.spS; }; cells.forEach(c => c.o.forEach(clear)); gods.forEach(clear);
  }
  function frame(dt) {
    refreshQualityAssets(); const ds = Math.min(0.05, dt / 1000); tm += ds; if (sf) { drawSurface(ds); return; } orb += ds * Math.min(tsx, 500) * (1 - 0.85 * cl(gm / 80, 0, 1)); if (tsx > 1 && age < 13800) age = Math.min(13800, age + ds * (tsx / 10) * Math.min(1, 0.002 + age / 5)); const eI = eraIdx(); if (eI !== le) { if (le >= 0 && eI > le) say('✦ ' + ERA[eI]); le = eI; } wv += (((warp || apw) ? 1 : 0) - wv) * Math.min(1, ds * 1.3); rebuild();
    if (bb) { bb.t += ds; thr = false; ap = false; vel = 0; if (bb.t > 3.0 && !bb.done) { bb.done = 1; newUniverse(); } if (bb.t > 11.5) { bb = null; say('Âge zéro. ⏩ TEMPS fait avancer le temps : regarde l\'univers se construire, et navigue en même temps.'); } }
    if (ap && tg) { const dx = tg.x - px, dy = tg.y - py, dz = tg.z - pz, dd = Math.hypot(dx, dy, dz) || 1; let a = Math.atan2(-dx, dz) - yaw; a = Math.atan2(Math.sin(a), Math.cos(a)); yaw += a * Math.min(1, ds * 2.2); pitch += (Math.asin(cl(dy / dd, -1, 1)) - pitch) * Math.min(1, ds * 2.2); apw = dd - tg.r > 4000; if (dd - tg.r < tg.r * 0.7 + 25) stopAp(); }
    const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch), fx = -sy * cp, fy = sp, fz = cy * cp, ux = sy * sp, uy = cp, uz = -cy * sp;
    const lim = 150 * Math.pow(30, wv) * cl(nd / 1500, 0.03, 1), push = !bb && (thr || warp || ap);
    if (push) vel += (lim - vel) * Math.min(1, ds * 1.6); else vel *= Math.exp(-ds * (brk ? 14 : 5)); if (vel > lim) vel += (lim - vel) * Math.min(1, ds * 4); if (vel < 0.4) vel = 0;
    const spd = vel; px += fx * spd * ds; py += fy * spd * ds; pz += fz * spd * ds;
    const Fw = F * (1 + 0.3 * wv) * zm, X0 = W / 2, Y0 = H / 2, fade = RC * C, dp = window.devicePixelRatio || 1;
    cx.setTransform(CU.Modes.size.dpr, 0, 0, CU.Modes.size.dpr, 0, 0); cx.imageSmoothingEnabled = true; cx.imageSmoothingQuality = 'high'; cx.globalAlpha = 1; cx.globalCompositeOperation = 'source-over'; cx.fillStyle = '#02000c'; cx.fillRect(0, 0, W, H); if (shk > 0.3) { cx.translate((Math.random() - 0.5) * shk, (Math.random() - 0.5) * shk); shk *= Math.exp(-ds * 3); } else shk = 0;
    drawSky(X0, Y0, fx, fy, fz, cy, sy, ux, uy, uz, Fw);
    // étoiles de fond : points en croisière, traînées radiales en vitesse lumière
    const sk = wv > 0.04 ? wv * 0.25 : 0; cx.fillStyle = '#fff'; if (sk) { cx.strokeStyle = 'rgba(190,215,255,.75)'; cx.lineWidth = 1.3; cx.beginPath(); }
    for (const c of vis) { const s = c.st; for (let i = 0; i < s.length; i += 4) { const dx = s[i] - px, dy = s[i + 1] - py, dz = s[i + 2] - pz, zc = dx * fx + dy * fy + dz * fz; if (zc < 4) continue;
      const k = Fw / zc; let x = X0 + (dx * cy + dz * sy) * k, y = Y0 - (dx * ux + dy * uy + dz * uz) * k; if (bhr > 5 && !sk) { const ex = x - bhx, ey = y - bhy, d2 = ex * ex + ey * ey + 1; if (d2 < bhr * bhr) continue; const m = 4.84 * bhr * bhr / d2; x += ex * m; y += ey * m; } if (x < 0 || y < 0 || x > W || y > H) continue;
      if (sk) { cx.moveTo(x, y); cx.lineTo(X0 + (x - X0) * (1 - sk), Y0 + (y - Y0) * (1 - sk)); } else { cx.globalAlpha = s[i + 3] * cl((1 - zc / (fade * 1.4)) * 2.5, 0, 1); cx.fillRect(x, y, 1.6, 1.6); } } }
    if (sk) cx.stroke(); cx.globalAlpha = 1;
    // objets : collision douce (on ne traverse pas), tri du lointain au proche
    bhr = 0; ob.length = 0; let best = 1e9, gax = 0, gay = 0, gaz = 0, eat = null, wh = null;
    for (const c of vis) for (const o of c.o) { if (kill[o.seed] || (o.par && kill[o.par.seed])) continue; if (o.bt === undefined) o.bt = birth(o); if (age < o.bt) continue; if (!o.g && hid(o)) continue; if (o.par) { const an = o.a0 + orb * o.w, q = o.par; o.x = q.x + Math.cos(an) * o.a; o.y = q.y + Math.sin(an) * o.a * Math.sin(o.inc); o.z = q.z + Math.sin(an) * o.a * Math.cos(o.inc); } let dx = o.x - px, dy = o.y - py, dz = o.z - pz, d = Math.hypot(dx, dy, dz);
      if (o.k === 4 && d < o.r * 0.9) wh = o; if (o.k === 2) { if (d < o.r) eat = o; else if (0) { const g = 900 * o.r * o.r / (d * d) * cl((o.r * 9 - d) / (o.r * 3), 0, 1); gax += dx / d * g; gay += dy / d * g; gaz += dz / d * g; } }
      if (o.k !== 3 && o.k !== 2 && o.k !== 4 && o.k !== 6) { if (d < o.r * 1.15) { const k = o.r * 1.15 / (d || 1); px = o.x - dx * k; py = o.y - dy * k; pz = o.z - dz * k; dx = o.x - px; dy = o.y - py; dz = o.z - pz; d = o.r * 1.15; } if (d - o.r < best) best = d - o.r; }
      o.zc = dx * fx + dy * fy + dz * fz; o.dx = dx; o.dy = dy; o.dz = dz; o.d = d; if (o.zc > 2) { o.sx = null; ob.push(o); } }
    gm = Math.hypot(gax, gay, gaz); if (gm) { gvx += gax * ds; gvy += gay * ds; gvz += gaz * ds; } else { const q = Math.exp(-ds * 3); gvx *= q; gvy *= q; gvz *= q; } px += gvx * ds; py += gvy * ds; pz += gvz * ds; if (eat) fall(); if (wh) enterWH(wh);
    nd = best; ob.sort((a, b) => b.zc - a.zc); updateGods(ds); drawEra(X0, Y0); drawOrbits(X0, Y0, fx, fy, fz, cy, sy, ux, uy, uz, Fw); drawBang(ds, X0, Y0, fx, fy, fz, cy, sy, ux, uy, uz, Fw); let bud = (CU.Q && CU.Q.tier === 'ultra') ? 2 : 1, lb = '', ld = 1e9, lo = null;
    for (const o of ob) {
      const k = Fw / o.zc, x = X0 + (o.dx * cy + o.dz * sy) * k, y = Y0 - (o.dx * ux + o.dy * uy + o.dz * uz) * k, r = o.r * k, a = cl((1 - o.d / fade) * 3, 0, 1); o.sx = x; o.sy = y; o.sr = r; if (x < -r * 3 || y < -r * 3 || x > W + r * 3 || y > H + r * 3) continue; const ba = cl((age - o.bt) / 150, 0, 1); cx.globalAlpha = a * ba;
      if (o.k === 6) drawMonster(o, x, y, r); else if (o.k === 4) drawWorm(o, x, y, r); else if (o.k === 3) drawNeb(o, x, y, r);
      else if (o.k === 0) drawStar(o, x, y, r);
      else if (o.k === 1) { if (r < 1.5) { cx.fillStyle = rgb(o.t === 0 ? [80, 140, 255] : [200, 160, 110], 1); cx.fillRect(x, y, 2, 2); } else {
        const pq = planetQuality(); if (!o.sp && bud > 0 && r > 6) { o.sp = mk(o, Math.min(pq.cap, Math.max(256, 32 * Math.ceil(r * 2 * CU.Modes.size.dpr / 32)))); bud--; } else if (o.sp && bud > 0 && o.spS < pq.cap && r * 2 * CU.Modes.size.dpr > o.spS * 1.15) { o.sp = mk(o, Math.min(pq.cap, 32 * Math.ceil(r * 2 * CU.Modes.size.dpr / 32))); bud--; }
        if (o.sp) { cx.globalCompositeOperation = 'lighter'; glow(x, y, r * 1.3, CU.X3.ATM[o.t], 0.22); cx.globalCompositeOperation = 'source-over'; let la = 0; if (o.par) { const q = o.par, ex = (q.dx - o.dx) * cy + (q.dz - o.dz) * sy, ey = -((q.dx - o.dx) * ux + (q.dy - o.dy) * uy + (q.dz - o.dz) * uz); la = Math.atan2(ey, ex) + 2.634; } cx.save(); cx.translate(x, y); cx.rotate(la); cx.drawImage(o.sp, -r, -r, r * 2, r * 2); cx.restore(); if (r > 6) { const at = ATM[o.t % 5], g = cx.createRadialGradient(x, y, r * 0.88, x, y, r * 1.22); g.addColorStop(0, rgb(at, 0)); g.addColorStop(0.45, rgb(at, o.t === 4 ? 0.2 : 0.42)); g.addColorStop(1, rgb(at, 0)); cx.globalCompositeOperation = 'lighter'; cx.fillStyle = g; cx.beginPath(); cx.arc(x, y, r * 1.22, 0, TAU); cx.fill(); cx.globalCompositeOperation = 'source-over'; } } else { cx.fillStyle = rgb(CU.X3.PAL[o.t][1], 1); cx.beginPath(); cx.arc(x, y, r, 0, TAU); cx.fill(); }
        if (o.sp) for (let m = 0, nm = o.seed % 3; m < nm; m++) { const an = orb * 3 / (m + 1) + m * 2.1 + o.seed, rr = r * (2.1 + m * 0.7), mx = x + Math.cos(an) * rr, my = y + Math.sin(an) * rr * 0.28, mr = Math.max(1.2, r * (0.13 + m * 0.04)); cx.fillStyle = '#9a9a98'; cx.beginPath(); cx.arc(mx, my, mr, 0, TAU); cx.fill(); }
        if (o.ring) { cx.strokeStyle = 'rgba(225,205,160,.55)'; cx.lineWidth = Math.max(1, r * 0.12); cx.beginPath(); cx.ellipse(x, y, r * 1.8, r * 0.45, -0.3, 0, TAU); cx.stroke(); } } }
      else { if (r > bhr) { bhx = x; bhy = y; bhr = r; } drawBH(x, y, r); }
      if (o.k !== 3 && r > 3 && Math.hypot(x - X0, y - Y0) < Math.min(W, H) * 0.25 && o.d < ld) { ld = o.d; lo = o; lb = (o.k === 1 ? NM[o.t] : o.k === 4 ? 'Trou de ver' : o.k === 5 ? 'Repère' : KN[o.k]) + ' ' + CU.nameGen(CU.rng(o.seed)) + ' · ' + Math.round(o.d - o.r); }
    }
    lk = lo; drawBelts(X0, Y0, fx, fy, fz, cy, sy, ux, uy, uz, Fw); cx.globalAlpha = 1;
    if (wv > 0.05) { const g = cx.createRadialGradient(X0, Y0, 0, X0, Y0, Math.max(W, H) * 0.7); g.addColorStop(0, 'rgba(170,210,255,' + 0.12 * wv + ')'); g.addColorStop(1, 'rgba(40,80,255,0)'); cx.fillStyle = g; cx.fillRect(0, 0, W, H); }
    cx.strokeStyle = 'rgba(0,240,255,.4)'; cx.lineWidth = 1; cx.beginPath(); cx.arc(X0, Y0, 9, 0, TAU); cx.stroke(); if (lb) { cx.fillStyle = '#9fdcff'; cx.font = '12px system-ui'; cx.textAlign = 'center'; cx.fillText(lb, X0, Y0 + 32); }
    if (gm > 3) { const g = cx.createRadialGradient(X0, Y0, Math.min(W, H) * 0.3, X0, Y0, Math.max(W, H) * 0.8); g.addColorStop(0, 'rgba(120,0,0,0)'); g.addColorStop(1, 'rgba(120,0,0,' + cl(gm / 90, 0, 0.6) + ')'); cx.fillStyle = g; cx.fillRect(0, 0, W, H); }
    if (fl > 0) { cx.fillStyle = 'rgba(255,255,255,' + Math.min(1, fl) + ')'; cx.fillRect(0, 0, W, H); fl -= ds * 1.4; }
    drawDust(ds, X0, Y0, fx, fy, fz, cy, sy, ux, uy, uz, Fw); drawFx(X0, Y0, fx, fy, fz, cy, sy, ux, uy, uz, Fw, ds); drawSel(X0, Y0, fx, fy, fz, cy, sy, ux, uy, uz, Fw); drawBeacons(X0, Y0, fx, fy, fz, cy, sy, ux, uy, uz, Fw); drawRadar(); drawShip(ds); drawJoy(ds); drawBB(X0, Y0);
    if (E.a) { const yy = Math.max(0, Math.round(age * 1e6)); E.a.textContent = bb ? 'T = 0' : yy.toLocaleString('fr-FR') + (yy > 1 ? ' ans' : ' an'); E.e.textContent = bb ? '' : ERA[eraIdx()]; }
    if (E.s) E.s.textContent = bb ? 'Big Bang…' : (wv > 0.5 ? '⚡ VITESSE LUMIÈRE · ' : vel > 1 ? 'Propulsion · ' : 'À l\'arrêt · ') + (spd / 4500).toFixed(3) + ' c' + (ap ? ' · approche auto' : '') + (Math.abs(zm - 1) > 0.05 ? ' · zoom ×' + zm.toFixed(1) : '') + (gm > 0.5 ? ' · ⚫ ATTRACTION ' + (gm / 9.81).toFixed(1) + ' g' : '');
    if (scEl && scEl.style.display === 'block' && tm - scT > 14) scEl.style.display = 'none';
    if (tm - ts > 3) { ts = tm; const s = CU.Save.d; s.inf = { x: px, y: py, z: pz, yaw, pitch, g: gods.map(sv), kl: kill, md: mods, ag: age, cf: cfg, bc: bcs }; CU.Save.mark(); }
  }

  function stopAp() { ap = false; apw = false; if (apb) apb.classList.remove('on'); }
  function newUniverse(sv0) { bcs.length = 0; sf = null; WM.clear(); lz = ex = null; age = 0.0001; le = -1; pa = 0.0001; gvx = gvy = gvz = 0; gods.length = 0; kill = {}; mods = {}; sel = null; sd = sv0 ? hashSeed(sv0) : ((Math.random() * 1e9) | 0) + 1; const s = CU.Save.d; s.seed = sd; s.inf = { x: 450, y: 450, z: 100, yaw: 0, pitch: 0, ag: 0.0001, cf: cfg, bc: bcs }; px = 450; py = 450; pz = 100; yaw = pitch = 0; vel = 0; cells.clear(); vk = ''; nd = 1e9; tg = lk = null; if (scEl) scEl.style.display = 'none'; CU.Save.mark(); }
  function startBB(v) { newUniverse(v); const N = CU.mobile ? 380 : 700; bz = { t: 0, c: -1, p: Array.from({ length: N }, () => { const u = Math.random() * 2 - 1, a = Math.random() * TAU, w = Math.sqrt(1 - u * u); return { x: w * Math.cos(a), y: u, z: w * Math.sin(a), s: Math.random() < 0.35 ? 1 : 0.15 + 0.85 * Math.sqrt(Math.random()), q: 0.4 + Math.random() * 0.6 }; }) }; fl = 1; shk = 18; try { CU.Sound.bang && CU.Sound.bang(); } catch (e) {} }
  const CAP = [[0, 'T = 0 · Singularité : toute la matière en un point'], [3.1, '10⁻³² s · Inflation cosmique'], [5, '3 minutes · Premiers noyaux (hydrogène, hélium)'], [7, '380 000 ans · La lumière se libère, premiers atomes'], [9, '200 millions d\'années · Les premières étoiles s\'allument']];
  function drawBB(X0, Y0) {
    if (!bb) return; const t = bb.t, R = Math.max(W, H); cx.globalAlpha = 1;
    if (t < 3.1) { cx.fillStyle = '#000'; cx.globalAlpha = Math.min(1, t / 0.7); cx.fillRect(0, 0, W, H); cx.globalAlpha = 1; const sh = t * t * 1.4; cx.globalCompositeOperation = 'lighter'; glow(X0 + (Math.random() - 0.5) * sh, Y0 + (Math.random() - 0.5) * sh, 20 + t * 26, [255, 255, 255], 0.35 + t * 0.2); cx.globalCompositeOperation = 'source-over'; cx.fillStyle = '#fff'; cx.beginPath(); cx.arc(X0, Y0, 2 + t * 2.5, 0, TAU); cx.fill(); if (t > 2.6) { cx.fillStyle = '#fff'; cx.globalAlpha = (t - 2.6) / 0.5; cx.fillRect(0, 0, W, H); cx.globalAlpha = 1; } }
    else { const e = t - 3.1; cx.fillStyle = '#fff'; cx.globalAlpha = Math.max(0, 1 - e / 1.6); cx.fillRect(0, 0, W, H); cx.globalAlpha = 1; cx.globalCompositeOperation = 'lighter'; const g = cl(255 - e * 26, 70, 255), b = cl(255 - e * 60, 20, 255), fa = cl(1 - e / 8, 0, 1);
      cx.strokeStyle = 'rgba(255,' + (g | 0) + ',' + (b | 0) + ',' + (0.8 * fa) + ')'; cx.lineWidth = 1.4; cx.beginPath();
      for (const q of bb.p) { const r = R * 0.9 * (1 - Math.exp(-e * 0.6 * q.s)), r0 = r * 0.72, c = Math.cos(q.a), s2 = Math.sin(q.a); cx.moveTo(X0 + c * r0, Y0 + s2 * r0); cx.lineTo(X0 + c * r, Y0 + s2 * r); } cx.stroke();
      for (let i = 0; i < 3; i++) { const re = e - i * 0.7; if (re > 0) { cx.strokeStyle = 'rgba(255,200,120,' + 0.5 * Math.max(0, 1 - re / 4) + ')'; cx.lineWidth = 3; cx.beginPath(); cx.arc(X0, Y0, re * R * 0.3, 0, TAU); cx.stroke(); } }
      cx.globalCompositeOperation = 'source-over'; }
    let cap = ''; for (const c of CAP) if (t >= c[0]) cap = c[1]; cx.fillStyle = '#fff'; cx.font = '600 14px system-ui'; cx.textAlign = 'center'; cx.shadowColor = '#000'; cx.shadowBlur = 8; cx.fillText(cap, X0, H * 0.28); cx.shadowBlur = 0;
  }
  function info(o) {
    const nm = CU.nameGen(CU.rng(o.seed)), dst = Math.round(Math.hypot(o.x - px, o.y - py, o.z - pz) - o.r), ls = (dst / 4500).toFixed(2); let t, l;
    if (o.k === 0) { const i = SC.indexOf(o.c), T = [4700, 5100, 5800, 6600, 11000, 3200][i], R = o.r / 50; t = ['Naine orange (K)', 'Naine orange (K)', 'Naine jaune (G)', 'Naine blanche (F)', 'Géante bleue (B)', 'Naine rouge (M)'][i] + ' ' + nm; const L = R * R * Math.pow(T / 5772, 4); l = ['Surface : ' + T + ' K', 'Rayon : ' + R.toFixed(2) + ' R☉', 'Luminosité : ' + L.toFixed(L < 10 ? 2 : 0) + ' L☉']; }
    else if (o.k === 1) { const gz = o.t === 4, R = gz ? o.r / 6 : o.r / 24; t = NM[o.t] + ' ' + nm; l = [o.par ? 'Étoile mère : ' + CU.nameGen(CU.rng(o.par.seed)) + ' · orbite ' + (o.a / 120).toFixed(2) + ' UA · année ' + Math.pow(o.a / 120, 1.5).toFixed(2) + ' ans' : 'Planète errante (sans étoile)', 'Rayon : ' + R.toFixed(2) + ' R⊕', 'Gravité : ' + (gz ? 24 : 9.81 * Math.pow(R, 0.7)).toFixed(1) + ' m/s²', 'Température : ' + [288, 340, 210, 900, 120][o.t] + ' K', 'Atmosphère : ' + ['N₂ · O₂ · H₂O', 'CO₂ · N₂', 'N₂ · CH₄', 'SO₂ · CO₂', 'H₂ · He'][o.t], 'Lunes : ' + (o.seed % 3) + ' · Anneaux : ' + (o.ring ? 'oui' : 'non'), o.t === 0 ? 'Eau liquide ✓ vie possible' : 'Surface hostile']; }
    else if (o.k === 6) { t = 'Léviathan cosmique ' + nm; l = ['Classe : prédateur interstellaire', 'Taille : ' + Math.round(o.r * 2) + ' u', 'Tentacules : ' + o.tent, 'Comportement : erratique · danger extrême']; } else if (o.k === 4) { t = 'Trou de ver ' + nm; l = ['Pont d\'Einstein-Rosen (verre spatial)', 'Sortie à ' + Math.round(o.dd / 1000) + ' ku', 'Traversée instantanée : fonce dedans']; } else if (o.k === 5) { t = 'Repère ' + o.n; l = ['X ' + Math.round(o.x) + ' · Y ' + Math.round(o.y) + ' · Z ' + Math.round(o.z)]; } else { const M = Math.round(o.r / 26 * 9); t = 'Trou noir ' + nm; l = ['Masse : ' + M + ' M☉', 'Horizon : ' + (2.95 * M).toFixed(0) + ' km', 'Danger : spaghettification']; }
    return '<b>' + t + '</b><br>Distance : ' + dst + ' u · lumière : ' + ls + ' s<br>' + l.join('<br>');
  }
  function scan() { if (!scEl) return; scEl.innerHTML = (sel || lk) ? info(sel || lk) : 'Aucun astre visé : place le viseur sur un astre.'; scEl.style.display = 'block'; scT = tm; }

  function say(t) { if (!scEl) return; scEl.textContent = t; scEl.style.display = 'block'; scT = tm; }
  const nm = o => (o.k === 1 ? NM[o.t] : o.k === 4 ? 'Trou de ver' : o.k === 5 ? 'Repère' : o.k === 6 ? 'Léviathan' : KN[o.k]) + ' ' + CU.nameGen(CU.rng(o.seed));
  function createMonster(kind = 'dragon') {
    // Les créatures sont des objets du monde, pas seulement une prévisualisation WebGL :
    // elles sont donc immédiatement ajoutées à `gods`, rendu et radar inclus.
    const fx = -Math.sin(yaw) * Math.cos(pitch), fy = Math.sin(pitch), fz = Math.cos(yaw) * Math.cos(pitch), r = Math.random, c = (r() * MONSTER_COLORS.length) | 0;
    const variant = kind === 'serpent' ? 'serpent' : kind === 'leviathan' ? 'leviathan' : 'dragon'; const e = { g: 1, bt: age - 200, k: 6, variant, x: px + fx * 1500, y: py + fy * 1500, z: pz + fz * 1500, seed: (r() * 1e9) | 0, t: c, c: MONSTER_COLORS[c], r: variant === 'leviathan' ? 520 + r() * 380 : 240 + r() * 260, phase: r() * TAU, tent: variant === 'leviathan' ? 16 + ((r() * 8) | 0) : 9 + ((r() * 6) | 0), speed: 0.5 + r() * 0.7 };
    gods.push(e); sel = e; fl = 0.9;
    say((e.variant === 'serpent' ? '🐍 Serpent cosmique créé : ' : e.variant === 'leviathan' ? '🦑 Titan léviathan créé : ' : '🐉 Dragon cosmique créé : ') + nm(e));
    CU.Save.mark();
  }
  function create(k) { const fx = -Math.sin(yaw) * Math.cos(pitch), fy = Math.sin(pitch), fz = Math.cos(yaw) * Math.cos(pitch), t = (Math.random() * 5) | 0, r = Math.random;
    const e = { g: 1, bt: age - 200, k, x: px + fx * 800, y: py + fy * 800, z: pz + fz * 800, seed: (r() * 1e9) | 0, t: k === 1 ? t : 0, c: k === 0 ? SC[(r() * 6) | 0] : NC[0], ring: k === 1 && r() < 0.3, r: k === 0 ? 34 + r() * 40 : k === 1 ? (t === 4 ? 40 + r() * 30 : 16 + r() * 24) : 26 + r() * 20 };
    gods.push(e); sel = e; fl = 0.7; say('Création : ' + nm(e)); CU.Save.mark(); }
  function destroy() { const t = sel || lk; if (!t) return say('Touche ou vise un astre pour l\'anéantir.'); if (lz) return; lz = { o: t, t: 0 }; stopAp(); try { CU.Sound.charge && CU.Sound.charge(); } catch (e) {} }
  function explode(t) { kill[t.seed] = 1; const i = gods.indexOf(t); if (i >= 0) gods.splice(i, 1); if (tg === t) stopAp(); if (sel === t) sel = null; const big = t.k === 0, n = CU.mobile ? 36 : 60; ex = { x: t.x, y: t.y, z: t.z, r: t.r, big, t: 0, dur: big ? 4 : 2.4, p: Array.from({ length: n }, () => ({ a: Math.random() * TAU, s: 0.6 + Math.random() * 2.2 })) }; fl = big ? 1.2 : 0.8; shk = big ? 26 : 14; try { CU.Sound.bang && CU.Sound.bang(); } catch (e) {} say(nm(t) + ' anéanti.'); CU.Save.mark(); }
  function change() { const t = sel || lk; if (!t || t.k > 1) return say('Touche une étoile ou une planète à transformer.'); if (t.k === 1) { t.t = (t.t + 1) % 5; t.sp = null; mods[t.seed] = t.t; say('Transformée en : ' + NM[t.t]); } else { const i = (SC.indexOf(t.c) + 1) % 6; t.c = SC[i]; mods[t.seed] = i; say('Étoile transformée.'); } fl = 0.35; CU.Save.mark(); }
  function goHome() { const h = cell(0, 0, 1).o[0]; if (age < birth(h)) return say('Le monde natal n\'existe pas encore.'); delete kill[h.seed]; sel = tg = h; ap = true; if (apb) apb.classList.add('on'); say('Cap sur le monde natal.'); }
  function pick(x, y) { if (Math.hypot(x - 52, y - 150) < 46) return nextBeacon(); for (const q of bcs) if (q.sx != null && Math.hypot(q.sx - x, q.sy - y) < 30) { sel = q; CU.Sound.ui(); return; } let b = null, bd = 1e9; for (const o of ob) { if (o.k === 3 || o.sx == null) continue; const d = Math.hypot(o.sx - x, o.sy - y); if (d < Math.max(34, o.sr + 10) && d < bd) { bd = d; b = o; } } sel = b; if (b) { CU.Sound.ui(); if (b.k === 6 && window.CU.Monster3D) window.CU.Monster3D.open({kind:b.variant || 'dragon',seed:b.seed,name:nm(b)}); } }
  function drawSel(X0, Y0, fx, fy, fz, cy, sy, ux, uy, uz, Fw) {
    if (!sel || kill[sel.seed]) { sel = null; return; }
    const dx = sel.x - px, dy = sel.y - py, dz = sel.z - pz, zc = dx * fx + dy * fy + dz * fz, xc = dx * cy + dz * sy, yc = dx * ux + dy * uy + dz * uz, lab = nm(sel) + ' · ' + Math.round(Math.hypot(dx, dy, dz) - sel.r) + ' u';
    cx.strokeStyle = cx.fillStyle = '#ffd27a'; cx.lineWidth = 1.5; cx.font = '12px system-ui'; cx.textAlign = 'center'; let x = 0, y = 0, on = false; if (zc > 2) { const k = Fw / zc; x = X0 + xc * k; y = Y0 - yc * k; on = x > 20 && y > 20 && x < W - 20 && y < H - 20; }
    if (on) { const q = Math.max(18, sel.r * Fw / zc + 10), l = q * 0.5; cx.beginPath(); for (const [a, b] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) { cx.moveTo(x + a * q, y + b * (q - l)); cx.lineTo(x + a * q, y + b * q); cx.lineTo(x + a * (q - l), y + b * q); } cx.stroke(); cx.fillText(lab, x, y + q + 16); }
    else { const a = Math.atan2(-yc, xc), ex = X0 + Math.cos(a) * (W / 2 - 28), ey = Y0 + Math.sin(a) * (H / 2 - 120); cx.save(); cx.translate(ex, ey); cx.rotate(a); cx.beginPath(); cx.moveTo(14, 0); cx.lineTo(-8, -9); cx.lineTo(-8, 9); cx.closePath(); cx.fill(); cx.restore(); cx.fillText(lab, Math.min(W - 90, Math.max(90, ex)), ey + (ey < H / 2 ? 26 : -14)); }
  }

  function fall() { px = 450; py = 450; pz = 100; yaw = pitch = 0; vel = 0; gvx = gvy = gvz = 0; stopAp(); fl = 1.3; try { CU.Sound.bang && CU.Sound.bang(); } catch (e) {} say('⚫ Horizon franchi : spaghettification. Tu renais au monde natal.'); }
  function drawBH(x, y, r) { // trou noir : lueur, demi-disque lointain, ombre, arche lentillée, anneau de photons, demi-disque proche (effet Doppler : côté gauche brillant)
    const R = r * 3.4;
    const disc = ys => { cx.save(); cx.translate(x, y); cx.rotate(-0.25); cx.scale(1, 0.28);
      for (const [xs, al] of [[-1, 1], [1, 0.4]]) { cx.save(); cx.beginPath(); cx.rect(xs < 0 ? -R : 0, ys < 0 ? -R : 0, R, R); cx.clip(); const g = cx.createRadialGradient(0, 0, r * 1.1, 0, 0, R); g.addColorStop(0, 'rgba(255,245,215,' + al + ')'); g.addColorStop(0.28, 'rgba(255,160,55,' + 0.75 * al + ')'); g.addColorStop(1, 'rgba(255,60,10,0)'); cx.fillStyle = g; cx.beginPath(); cx.arc(0, 0, R, 0, TAU); cx.fill(); cx.restore(); }
      cx.restore(); };
    cx.globalCompositeOperation = 'lighter'; glow(x, y, r * 5, [255, 150, 60], 0.2); disc(-1);
    cx.globalCompositeOperation = 'source-over'; cx.fillStyle = '#000'; cx.beginPath(); cx.arc(x, y, r, 0, TAU); cx.fill();
    cx.globalCompositeOperation = 'lighter'; cx.strokeStyle = 'rgba(255,190,110,.5)'; cx.lineWidth = Math.max(1, r * 0.2); cx.beginPath(); cx.arc(x, y, r * 1.3, 0, TAU); cx.stroke();
    cx.strokeStyle = 'rgba(255,240,210,.95)'; cx.lineWidth = Math.max(1, r * 0.05); cx.beginPath(); cx.arc(x, y, r * 1.04, 0, TAU); cx.stroke(); disc(1); jets(x, y, r); cx.globalCompositeOperation = 'source-over';
  }
  const GS = NC.map(c => { const k = document.createElement('canvas'); k.width = k.height = 64; const x = k.getContext('2d'), g = x.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, rgb(c, 1)); g.addColorStop(1, rgb(c, 0)); x.fillStyle = g; x.fillRect(0, 0, 64, 64); return k; }), SKC = ['#cfe0ff', '#fff4dd', '#ffd9c0'];
  const SKY = (() => { let q = 12345; const r = () => ((q = Math.imul(q, 1664525) + 1013904223) >>> 0) / 4294967296, n = CU.mobile ? 450 : 800, a = new Float32Array(n * 5), ng = [];
    let nx = 0.3, ny = 0.8, nz = 0.5; const nl = Math.hypot(nx, ny, nz); nx /= nl; ny /= nl; nz /= nl; let ax = ny, ay = -nx; const al = Math.hypot(ax, ay); ax /= al; ay /= al; const bx = -nz * ay, by = nz * ax, bz = nx * ay - ny * ax;
    const pt = (ph, off) => { let x = ax * Math.cos(ph) + bx * Math.sin(ph) + nx * off, y = ay * Math.cos(ph) + by * Math.sin(ph) + ny * off, z = bz * Math.sin(ph) + nz * off; const l = Math.hypot(x, y, z); return [x / l, y / l, z / l]; };
    for (let i = 0; i < n; i++) { const band = r() < 0.7, off = band ? (r() + r() + r() - 1.5) * 0.3 : (r() - 0.5) * 2, p = pt(r() * TAU, off); a.set([p[0], p[1], p[2], (0.15 + 0.85 * Math.pow(r(), 3)) * (band ? 1 : 0.6), (r() * 3) | 0], i * 5); }
    for (let i = 0; i < 18; i++) { const p = pt(i * 0.35 + r() * 0.3, (r() - 0.5) * 0.25); ng.push({ x: p[0], y: p[1], z: p[2], c: i % 4, s: 0.25 + r() * 0.5 }); }
    const dust = []; for (let i = 0; i < 26; i++) { const p = pt(i * TAU / 26 + r() * 0.1, (r() - 0.5) * 0.07); dust.push({ x: p[0], y: p[1], z: p[2], s: 0.1 + r() * 0.12 }); } const core = pt(0.4, 0);
    const gx = []; for (let i = 0; i < 16; i++) { const z = r() * 2 - 1, ph = r() * TAU, w = Math.sqrt(1 - z * z); gx.push({ x: w * Math.cos(ph), y: z, z: w * Math.sin(ph), s: 0.05 + r() * 0.1, t: 0.25 + r() * 0.75, rot: r() * TAU, i: (r() * 3) | 0 }); }
    return { a, ng, gx, dust, core }; })();
  const DK = (() => { const k = document.createElement('canvas'); k.width = k.height = 64; const x = k.getContext('2d'), g = x.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, 'rgba(2,0,12,.6)'); g.addColorStop(1, 'rgba(2,0,12,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 64); return k; })(), ATM = [[110, 170, 255], [255, 190, 120], [170, 220, 255], [255, 120, 60], [230, 200, 150]];
  function drawSky(X0, Y0, fx, fy, fz, cy, sy, ux, uy, uz, Fw) { const SA = cl((age - 200) / 3000, 0, 1);
    cx.globalCompositeOperation = 'lighter';
    for (const g of SKY.ng) { const zc = g.x * fx + g.y * fy + g.z * fz; if (zc < 0.1) continue; const k = Fw / zc, x = X0 + (g.x * cy + g.z * sy) * k, y = Y0 - (g.x * ux + g.y * uy + g.z * uz) * k, R = Math.min(Fw * g.s / zc, W * 1.2); cx.globalAlpha = 0.3 * SA * Math.min(1, zc * 2); cx.drawImage(NT[g.c], x - R, y - R, R * 2, R * 2); }
    for (const g of SKY.gx) { const zc = g.x * fx + g.y * fy + g.z * fz; if (zc < 0.1) continue; const k = Fw / zc, x = X0 + (g.x * cy + g.z * sy) * k, y = Y0 - (g.x * ux + g.y * uy + g.z * uz) * k, R = Math.min(Fw * g.s / zc, W); if (x < -R || y < -R || x > W + R || y > H + R) continue; cx.globalAlpha = 0.55 * SA * Math.min(1, zc * 2); cx.save(); cx.translate(x, y); cx.rotate(g.rot); cx.scale(1, g.t); cx.drawImage(GX[g.i], -R, -R, R * 2, R * 2); cx.restore(); }
    const s = SKY.a, n = s.length / 5; cx.globalAlpha = 1;
    for (let i = 0; i < n; i++) { const j = i * 5, zc = s[j] * fx + s[j + 1] * fy + s[j + 2] * fz; if (zc < 0.05) continue; const k = Fw / zc, x = X0 + (s[j] * cy + s[j + 2] * sy) * k, y = Y0 - (s[j] * ux + s[j + 1] * uy + s[j + 2] * uz) * k; if (x < 0 || y < 0 || x > W || y > H) continue; cx.fillStyle = SKC[s[j + 4] | 0]; cx.globalAlpha = s[j + 3] * SA; cx.fillRect(x, y, 1.4, 1.4); }
    { const c = SKY.core, zc = c[0] * fx + c[1] * fy + c[2] * fz; if (zc > 0.1) { const k = Fw / zc; cx.globalCompositeOperation = 'lighter'; glow(X0 + (c[0] * cy + c[2] * sy) * k, Y0 - (c[0] * ux + c[1] * uy + c[2] * uz) * k, Math.min(Fw * 0.6 / zc, W * 1.5), [255, 205, 150], 0.22 * SA * Math.min(1, zc * 2)); } }
    cx.globalCompositeOperation = 'source-over';
    for (const g of SKY.dust) { const zc = g.x * fx + g.y * fy + g.z * fz; if (zc < 0.1) continue; const k = Fw / zc, R = Math.min(Fw * g.s / zc, W); cx.globalAlpha = SA * Math.min(1, zc * 2); cx.drawImage(DK, X0 + (g.x * cy + g.z * sy) * k - R, Y0 - (g.x * ux + g.y * uy + g.z * uz) * k - R, R * 2, R * 2); }
    cx.globalAlpha = 1;
  }

  function drawJoy(ds) { // repère joystick : apparaît au premier doigt qui glisse, suit le doigt, s'estompe au relâchement
    if (!joy) return; if (!joy.on) { joy.a -= ds * 4; if (joy.a <= 0) { joy = null; return; } }
    const dx = joy.x - joy.ox, dy = joy.y - joy.oy, d = Math.hypot(dx, dy); if (d > 10) joy.m = 1; if (!joy.m) return;
    const R = 54, k = d > R ? R / d : 1, kx = joy.ox + dx * k, ky = joy.oy + dy * k, ox = joy.ox, oy = joy.oy;
    cx.globalAlpha = joy.a * 0.9; cx.lineWidth = 2; cx.strokeStyle = 'rgba(0,240,255,.55)'; cx.fillStyle = 'rgba(0,240,255,.08)'; cx.beginPath(); cx.arc(ox, oy, R, 0, TAU); cx.fill(); cx.stroke();
    cx.lineWidth = 1; cx.strokeStyle = 'rgba(0,240,255,.25)'; cx.beginPath(); cx.moveTo(ox - R, oy); cx.lineTo(ox + R, oy); cx.moveTo(ox, oy - R); cx.lineTo(ox, oy + R); cx.stroke();
    cx.strokeStyle = 'rgba(255,43,214,.55)'; cx.lineWidth = 2; cx.beginPath(); cx.moveTo(ox, oy); cx.lineTo(kx, ky); cx.stroke();
    const g = cx.createRadialGradient(kx, ky, 0, kx, ky, 22); g.addColorStop(0, 'rgba(255,255,255,.95)'); g.addColorStop(0.5, 'rgba(120,230,255,.6)'); g.addColorStop(1, 'rgba(0,240,255,0)'); cx.fillStyle = g; cx.beginPath(); cx.arc(kx, ky, 22, 0, TAU); cx.fill(); cx.globalAlpha = 1;
  }

  const mix = (c, t, k) => [c[0] + (t - c[0]) * k, c[1] + (t - c[1]) * k, c[2] + (t - c[2]) * k];
  function drawStar(o, x, y, r) { // soleil : couronne, disque assombri au bord, taches, protubérances, spicules de diffraction
    const c = o.c, R = Math.max(2, r), ba = cl((age - o.bt) / 150, 0, 1); cx.globalCompositeOperation = 'lighter'; if (ba < 1) glow(x, y, R * 22, mix(c, 255, 0.5), 0.8 * (1 - ba)); glow(x, y, Math.max(10, R * 9), c, 0.3); glow(x, y, Math.max(6, R * 3), c, 0.55); { const kk = cl(1 - Math.hypot(x - W / 2, y - H / 2) / (W * 0.7), 0, 1); if (kk > 0.02 && R > 3) { cx.save(); cx.translate(x, y); cx.scale(7, 0.07); glow(0, 0, R * 4, mix(c, 255, 0.5), 0.6 * kk); cx.restore(); } }
    if (R > 4) { cx.strokeStyle = rgb(mix(c, 255, 0.4), 0.22); cx.lineWidth = 1; cx.beginPath(); cx.moveTo(x - R * 5, y); cx.lineTo(x + R * 5, y); cx.moveTo(x, y - R * 5); cx.lineTo(x, y + R * 5); cx.stroke(); }
    cx.globalCompositeOperation = 'source-over'; const g = cx.createRadialGradient(x, y, 0, x, y, R); g.addColorStop(0, rgb(mix(c, 255, 0.85), 1)); g.addColorStop(0.55, rgb(mix(c, 255, 0.35), 1)); g.addColorStop(0.9, rgb(mix(c, 0, 0.3), 1)); g.addColorStop(1, rgb(mix(c, 0, 0.6), 1)); cx.fillStyle = g; cx.beginPath(); cx.arc(x, y, R, 0, TAU); cx.fill();
    if (R > 9) { cx.fillStyle = 'rgba(40,10,0,.28)'; for (let i = 0; i < 3; i++) { const a = (o.seed % 100) * 0.3 + i * 2.1 + tm * 0.02, d = R * (0.25 + 0.3 * i / 3); cx.beginPath(); cx.ellipse(x + Math.cos(a) * d, y + Math.sin(a) * d * 0.8, R * 0.07, R * 0.05, a, 0, TAU); cx.fill(); } }
    if (R > 6) { cx.globalCompositeOperation = 'lighter'; cx.strokeStyle = rgb(mix(c, 255, 0.2), 0.55); cx.lineWidth = Math.max(1, R * 0.05); for (let i = 0; i < 4; i++) { const a = (o.seed % 628) / 100 + i * 1.6 + Math.sin(tm * 0.15 + i) * 0.3, h = R * (1.25 + 0.25 * Math.sin(tm * 0.5 + i * 2)); cx.beginPath(); cx.moveTo(x + Math.cos(a - 0.14) * R, y + Math.sin(a - 0.14) * R); cx.quadraticCurveTo(x + Math.cos(a) * h, y + Math.sin(a) * h, x + Math.cos(a + 0.14) * R, y + Math.sin(a + 0.14) * R); cx.stroke(); } cx.globalCompositeOperation = 'source-over'; }
  }

  const GX = [0, 1, 2].map(v => { const k = document.createElement('canvas'); k.width = k.height = 96; const x = k.getContext('2d'), g = x.createRadialGradient(48, 48, 0, 48, 48, 22); g.addColorStop(0, 'rgba(255,235,200,.95)'); g.addColorStop(1, 'rgba(255,200,140,0)'); x.fillStyle = g; x.fillRect(0, 0, 96, 96);
    const arms = v === 2 ? 0 : 2 + v; for (let j = 0; j < 420; j++) { const t = Math.pow(Math.random(), 0.7) * 4.2, a = t * 1.3 + (arms ? (j % arms) * TAU / arms : Math.random() * TAU) + (Math.random() - 0.5) * 0.45, rr = t * 10.5 * (arms ? 1 : 0.6 + Math.random() * 0.4); x.fillStyle = 'rgba(' + (arms ? '170,200,255' : '255,220,180') + ',' + (0.25 + Math.random() * 0.4) + ')'; x.fillRect(48 + Math.cos(a) * rr, 48 + Math.sin(a) * rr, 1.3, 1.3); }
    return k; });
  function drawBelts(X0, Y0, fx, fy, fz, cy, sy, ux, uy, uz, Fw) { // ceintures d'astéroïdes autour des étoiles à planètes (en orbite)
    cx.fillStyle = '#b8a48a'; for (const o of ob) { if (o.k !== 0 || !o.belt || age < o.bt + 1500 || o.d > 1800 || kill[o.seed]) continue; const N = CU.mobile ? 55 : 90, w = 0.02 * Math.pow(120 / o.belt, 1.5);
      for (let i = 0; i < N; i++) { const h = (i * 2654435761 + o.seed) >>> 0, a = (h % 6283) / 1000 + orb * w, rr = o.belt + ((h >>> 8) % 60) - 30, dx = o.dx + Math.cos(a) * rr, dz = o.dz + Math.sin(a) * rr, dy = o.dy + ((h >>> 14) % 40) - 20, zc = dx * fx + dy * fy + dz * fz; if (zc < 4) continue;
        const k = Fw / zc, x = X0 + (dx * cy + dz * sy) * k, y = Y0 - (dx * ux + dy * uy + dz * uz) * k; if (x < 0 || y < 0 || x > W || y > H) continue; cx.globalAlpha = cl((1 - o.d / 1800) * 1.5, 0, 0.8); cx.fillRect(x, y, 1.7, 1.7); } }
    cx.globalAlpha = 1;
  }
  function drawFx(X0, Y0, fx, fy, fz, cy, sy, ux, uy, uz, Fw, ds) { // laser de destruction + explosion / supernova
    const pr = o => { const dx = o.x - px, dy = o.y - py, dz = o.z - pz, zc = dx * fx + dy * fy + dz * fz; if (zc < 2) return null; const k = Fw / zc; return [X0 + (dx * cy + dz * sy) * k, Y0 - (dx * ux + dy * uy + dz * uz) * k, k]; };
    if (lz) { const t = lz.o, P = pr(t); if (!P || kill[t.seed]) { lz = null; say('Cible hors champ.'); } else { lz.t += ds; const T = lz.t, x = P[0], y = P[1], rr = Math.max(4, t.r * P[2]), cn = [[shx - shw * 0.45, shy], [shx + shw * 0.45, shy]];
      cx.globalCompositeOperation = 'lighter'; if (T < 1.4) for (const c of cn) glow(c[0], c[1] - 10, 18 + 50 * Math.min(1, T / 0.8), [255, 80, 60], 0.3 + 0.6 * T / 1.4);
      if (T > 0.7 && T < 1.4) { const a = Math.min(1, (T - 0.7) / 0.15) * (0.8 + 0.2 * Math.sin(T * 90)); cx.lineCap = 'round';
        for (const c of cn) { cx.strokeStyle = 'rgba(255,50,40,' + 0.45 * a + ')'; cx.lineWidth = 9; cx.beginPath(); cx.moveTo(c[0], c[1]); cx.lineTo(x, y); cx.stroke(); cx.strokeStyle = 'rgba(255,230,210,' + a + ')'; cx.lineWidth = 2.5; cx.stroke(); }
        glow(x, y, rr * 2 + 26, [255, 150, 70], 0.9 * a); cx.strokeStyle = 'rgba(255,220,160,.8)'; cx.lineWidth = 1.5; cx.beginPath(); for (let i = 0; i < 14; i++) { const an = Math.random() * TAU, l = rr * (0.7 + Math.random() * 0.9) + 6; cx.moveTo(x + Math.cos(an) * rr * 0.5, y + Math.sin(an) * rr * 0.5); cx.lineTo(x + Math.cos(an) * l, y + Math.sin(an) * l); } cx.stroke(); shk = Math.max(shk, 3); }
      cx.globalCompositeOperation = 'source-over'; if (T >= 1.4) { lz = null; explode(t); } } }
    if (ex) { ex.t += ds; const e = ex.t / ex.dur; if (e >= 1) ex = null; else { const P = pr(ex); if (P) { const x = P[0], y = P[1], k = P[2], R = ex.r * (ex.big ? 9 : 4), fa = 1 - e, rad = R * k * Math.sqrt(e);
      cx.globalCompositeOperation = 'lighter'; glow(x, y, Math.max(10, ex.r * k * (2 + e * 6)), ex.big ? [255, 220, 160] : [255, 170, 90], 0.9 * fa * fa);
      cx.strokeStyle = 'rgba(255,200,140,' + 0.7 * fa + ')'; cx.lineWidth = Math.max(2, rad * 0.06 * fa); cx.beginPath(); cx.arc(x, y, rad, 0, TAU); cx.stroke();
      if (ex.big) { cx.strokeStyle = 'rgba(140,190,255,' + 0.5 * fa + ')'; cx.lineWidth = Math.max(1, rad * 0.03); cx.beginPath(); cx.arc(x, y, rad * 0.7, 0, TAU); cx.stroke(); }
      cx.fillStyle = 'rgba(255,190,110,' + fa + ')'; for (const q of ex.p) { const d = R * k * 0.63 * q.s * Math.sqrt(e); cx.fillRect(x + Math.cos(q.a) * d, y + Math.sin(q.a) * d, 2.2, 2.2); }
      cx.globalCompositeOperation = 'source-over'; } } }
  }

  const ERA = ['Plasma primordial', 'Âges sombres', 'Premières étoiles', 'Ère des galaxies', 'Formation des systèmes', 'Univers mature'], eraIdx = () => age < 0.38 ? 0 : age < 200 ? 1 : age < 1000 ? 2 : age < 3500 ? 3 : age < 13800 ? 4 : 5;
  function ageLabel() { const years = Math.max(0, Math.round(age * 1e6)); const t = age < 1 ? years.toLocaleString('fr-FR') + ' ans' : age < 1000 ? age.toFixed(1) + " millions d'années" : (age / 1000).toFixed(2) + " milliards d'années"; return "⏳ Âge de l'univers : " + t + ' · ' + ERA[eraIdx()]; }
  function birth(o) { if (hs === null) { try { hs = cell(0, 0, 1).o[0].seed; } catch (e) { hs = -1; } } if (o.seed === hs) return 9000; const u = ((o.seed * 2654435761) >>> 0) / 4294967296; if (o.par) return birth(o.par) + 300 + u * 1200; return o.k === 1 ? 800 + u * 5000 : o.k === 2 ? 300 + u * 2500 : o.k === 3 ? 100 + u * 2500 : 200 + u * 3500; }
  function drawEra(X0, Y0) { // plasma primordial → âges sombres : voile noir + lueur chaude qui refroidit (blanc → orange → rouge)
    if (age >= 400) return; cx.globalCompositeOperation = 'source-over'; cx.globalAlpha = age < 100 ? 0.97 : cl(1 - (age - 100) / 300, 0, 1) * 0.97; cx.fillStyle = '#02000c'; cx.fillRect(0, 0, W, H);
    const u = cl(Math.log10(1 + age * 20) / 2.6, 0, 1), al = 0.95 * (1 - u * u), A = [255, 250, 235], B = [255, 150, 70], D = [110, 15, 5], L = (p, q, k) => p.map((v, i) => v + (q[i] - v) * k), col = u < 0.4 ? L(A, B, u / 0.4) : L(B, D, (u - 0.4) / 0.6);
    if (al > 0.01) { cx.globalAlpha = al; cx.fillStyle = 'rgb(' + col.map(Math.round) + ')'; cx.fillRect(0, 0, W, H); cx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 22; i++) glow((Math.sin(i * 12.99 + tm * 0.05) * 0.5 + 0.5) * W, (Math.sin(i * 78.23 + tm * 0.04) * 0.5 + 0.5) * H, Math.max(W, H) * 0.3, col, al * 0.3 * (0.5 + 0.5 * Math.sin(i * 3 + tm * 0.4))); }
    cx.globalAlpha = 1; cx.globalCompositeOperation = 'source-over';
  }

  const sv = g => Object.assign({}, g, { par: undefined, sp: undefined });
  function updateGods(ds) {
    if (whCd > 0) whCd -= ds; if (lp && !ap) { if (Math.hypot(lp.x - px, lp.y - py, lp.z - pz) - lp.r < lp.r * 1.2 + 90) landOn(lp); lp = null; }
    if (!ex && age > pa) for (const c of vis) { let hit = 0; for (const q of c.o) { if (q.k !== 0 || kill[q.seed] || q.bt === undefined || SC.indexOf(q.c) !== 4 || (!q.g && hid(q))) continue; const td = q.bt + 60 + (((q.seed * 2246822519) >>> 0) / 4294967296) * 140; if (pa < td && age >= td && age - q.bt < 5000) { explode(q); gods.push({ g: 1, k: 2, x: q.x, y: q.y, z: q.z, seed: (q.seed ^ 0x5bd1e995) >>> 0, t: 0, c: NC[0], ring: false, r: Math.max(26, q.r * 0.55), bt: age - 200 }); say('💥 Supernova : ' + nm(q) + ' s\'effondre en trou noir.'); hit = 1; break; } } if (hit) break; }
    pa = age; // une planète posée par le dieu finit capturée par l'étoile la plus proche (≤ 3000 u) et passe en orbite stable
    for (const g of gods) { if (g.k !== 1) continue;
      if (g.pseed != null && !g.par) { for (const c of vis) for (const q of c.o) if (q.seed === g.pseed && q.k === 0) g.par = q; continue; }
      if (g.par) { if (g.at != null) { g.a += (g.at - g.a) * Math.min(1, ds * 0.6); if (Math.abs(g.at - g.a) < 0.5) g.at = null; } continue; }
      g.cT = (g.cT || 0) + ds; if (g.cT < 6) continue;
      let b = null, bd = 3000; for (const c of vis) for (const q of c.o) { if (q.k !== 0 || kill[q.seed] || (q.bt !== undefined && age < q.bt)) continue; const d = Math.hypot(q.x - g.x, q.y - g.y, q.z - g.z); if (d < bd && d > q.r * 1.5) { bd = d; b = q; } }
      if (!b) continue; const rx = g.x - b.x, ry = g.y - b.y, rz = g.z - b.z, a = Math.hypot(rx, ry, rz), h = Math.hypot(ry, rz);
      g.par = b; g.pseed = b.seed; g.a = a; g.inc = Math.atan2(ry, rz); g.w = 0.02 * Math.pow(120 / a, 1.5); g.a0 = Math.atan2(h, rx) - orb * g.w; g.at = cl(a, b.r * 2.4, 700);
      say(nm(g) + ' capturée par ' + nm(b) + ' : orbite stable.'); CU.Save.mark(); }
  }
  function drawOrbits(X0, Y0, fx, fy, fz, cy, sy, ux, uy, uz, Fw) { // trace l'orbite de chaque planète (celle sélectionnée en doré)
    const N = CU.mobile ? 48 : 72; cx.lineWidth = 1;
    for (const c of vis) for (const o of c.o) { const q = o.par; if (!q || o.a == null || (!o.g && hid(o)) || kill[o.seed] || kill[q.seed] || (o.bt !== undefined && age < o.bt)) continue;
      const dd = Math.hypot(q.x - px, q.y - py, q.z - pz) - o.a; if (dd > 2400) continue; const al = cl(1.1 - Math.max(0, dd) / 2400, 0, 1) * 0.4; if (al < 0.02) continue;
      cx.strokeStyle = sel === o ? 'rgba(255,210,122,' + Math.min(1, al * 2.2) + ')' : 'rgba(130,200,255,' + al + ')'; cx.beginPath(); let pen = false;
      for (let i = 0; i <= N; i++) { const t = i / N * TAU, dx = q.x + Math.cos(t) * o.a - px, dy = q.y + Math.sin(t) * o.a * Math.sin(o.inc) - py, dz = q.z + Math.sin(t) * o.a * Math.cos(o.inc) - pz, zc = dx * fx + dy * fy + dz * fz; if (zc < 3) { pen = false; continue; } const k = Fw / zc, x = X0 + (dx * cy + dz * sy) * k, y = Y0 - (dx * ux + dy * uy + dz * uz) * k; if (pen) cx.lineTo(x, y); else cx.moveTo(x, y); pen = true; }
      cx.stroke(); }
  }

  const NT = (() => { const S = 128, out = [], h = (x, y, s) => { const n = Math.sin(x * 127.1 + y * 311.7 + s * 74.7) * 43758.5453; return n - Math.floor(n); },
    vn = (x, y, s) => { const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf); return (h(xi, yi, s) * (1 - u) + h(xi + 1, yi, s) * u) * (1 - v) + (h(xi, yi + 1, s) * (1 - u) + h(xi + 1, yi + 1, s) * u) * v; },
    fbm = (x, y, s) => { let a = 0.5, f = 1, m = 0; for (let o = 0; o < 5; o++) { m += a * vn(x * f, y * f, s + o); f *= 2; a *= 0.5; } return m; };
    for (let i = 0; i < 4; i++) { const k = document.createElement('canvas'); k.width = k.height = S; const g = k.getContext('2d'), im = g.createImageData(S, S), c1 = NC[i % NC.length], c2 = NC[(i + 1) % NC.length];
      for (let yy = 0; yy < S; yy++) for (let xx = 0; xx < S; xx++) { const nx = xx / S * 2 - 1, ny = yy / S * 2 - 1, r = Math.hypot(nx, ny); if (r >= 1) continue; const wx = nx * 2.2, wy = ny * 2.2, q = fbm(wx + 3.1 * i, wy, 5 + i), n = fbm(wx + 2 * q, wy + 2 * q, 9 + i), rd = 1 - Math.abs(2 * fbm(wx * 1.5, wy * 1.5, 20 + i) - 1), v = cl((n - 0.32) * 2.4, 0, 1) * Math.pow(1 - r, 1.4), m = cl(q * 1.4 - 0.2, 0, 1), hot = v * v * 0.8 + rd * rd * rd * v * 0.6, j = (yy * S + xx) * 4;
        im.data[j] = cl(c1[0] * (1 - m) + c2[0] * m + 128 * hot, 0, 255); im.data[j + 1] = cl(c1[1] * (1 - m) + c2[1] * m + 100 * hot, 0, 255); im.data[j + 2] = cl(c1[2] * (1 - m) + c2[2] * m + 75 * hot, 0, 255); im.data[j + 3] = cl(v * 230, 0, 255); }
      g.putImageData(im, 0, 0); out.push(k); } return out; })();
  function drawNeb(o, x, y, r) { // nébuleuse : textures de gaz fractales (bruit fbm déformé), 3 couches, étoiles embarquées
    const R = Math.min(r, Math.max(W, H) * 1.6), A = cx.globalAlpha, i0 = Math.max(0, NC.indexOf(o.c)) % 4; cx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 3; i++) { const z = R * [1.05, 0.7, 0.45][i]; cx.globalAlpha = A * [0.55, 0.45, 0.4][i]; cx.save(); cx.translate(x + Math.cos(o.seed + i) * R * 0.12, y + Math.sin(o.seed * 1.3 + i) * R * 0.1); cx.rotate(o.seed * 0.001 + i * 2.1); cx.drawImage(NT[(i0 + i * 2 + (o.seed % 3)) % 4], -z, -z, z * 2, z * 2); cx.restore(); }
    cx.fillStyle = '#fff'; for (let i = 0; i < 12; i++) { cx.globalAlpha = A * (0.5 + 0.5 * ((o.seed >> i) & 1)); const a = i * 2.4 + o.seed, d = R * 0.55 * (((o.seed >> i) & 7) / 7); cx.fillRect(x + Math.cos(a) * d, y + Math.sin(a) * d * 0.8, 1.8, 1.8); }
    cx.globalAlpha = A; cx.globalCompositeOperation = 'source-over';
  }
  const BO = { x: 450, y: 450, z: 700 }, BCAP = [[0, '⚫ Singularité : tout est concentré en un point'], [1.5, '✦ Inflation : l\'espace explose'], [7, '⚛ Nucléosynthèse : les premiers noyaux'], [16, '💡 Recombinaison : la lumière se libère'], [32, '🌑 Âges sombres : l\'univers refroidit']];

  function hashSeed(v) { v = String(v).trim(); if (/^\d+$/.test(v)) return (Number(v) % 1e9) + 1; let h = 5381; for (const ch of v) h = (Math.imul(h, 33) + ch.charCodeAt(0)) >>> 0; return (h % 1e9) + 1; }
  function jets(x, y, r) { // jets relativistes polaires
    const an = -0.25 - Math.PI / 2, L = r * 10; cx.globalCompositeOperation = 'lighter';
    for (const sg of [1, -1]) { const ex = x + Math.cos(an) * L * sg, ey = y + Math.sin(an) * L * sg, g = cx.createLinearGradient(x, y, ex, ey); g.addColorStop(0, 'rgba(170,200,255,.55)'); g.addColorStop(1, 'rgba(120,150,255,0)'); cx.fillStyle = g; const nx = -Math.sin(an) * r * 0.22, ny = Math.cos(an) * r * 0.22; cx.beginPath(); cx.moveTo(x + nx, y + ny); cx.lineTo(ex, ey); cx.lineTo(x - nx, y - ny); cx.closePath(); cx.fill(); }
  }
  function drawBang(ds, X0, Y0, fx, fy, fz, cy, sy, ux, uy, uz, Fw) { // Big Bang : singularité aveuglante (flares en croix), ondes de choc sphériques, matière en traînées qui refroidit
    if (!bz) return; bz.t += ds; const t = bz.t; if (t > 60) { bz = null; return; }
    let ci = -1; for (let i = 0; i < BCAP.length; i++) if (t >= BCAP[i][0]) ci = i; if (ci !== bz.c) { bz.c = ci; say(BCAP[ci][1] + (ci === 0 ? ' · univers n°' + sd : '')); }
    if (t < 3) shk = Math.max(shk, 14 * (1 - t / 3));
    const R = 2400 * (1 - Math.exp(-t * 0.45)), u = cl(t / 45, 0, 1), fade = t < 40 ? 1 : cl(1 - (t - 40) / 20, 0, 1), A = [255, 250, 235], B = [255, 150, 70], D = [120, 20, 8], L = (p, q, k) => p.map((v, i) => v + (q[i] - v) * k), col = u < 0.4 ? L(A, B, u / 0.4) : L(B, D, (u - 0.4) / 0.6), cs = 'rgb(' + col.map(Math.round) + ')', hc = 'rgb(' + L(col, [170, 200, 255], 0.6).map(Math.round) + ')';
    const pj = (p, Rp) => { const dx = BO.x + p.x * Rp - px, dy = BO.y + p.y * Rp - py, dz = BO.z + p.z * Rp - pz, zc = dx * fx + dy * fy + dz * fz; if (zc < 2) return null; const k = Fw / zc; return [X0 + (dx * cy + dz * sy) * k, Y0 - (dx * ux + dy * uy + dz * uz) * k, k]; };
    cx.globalCompositeOperation = 'lighter'; cx.lineCap = 'round'; const c0 = pj({ x: 0, y: 0, z: 0 }, 0);
    if (c0) { const x = c0[0], y = c0[1], k = c0[2], e = Math.exp(-t / 8) * fade, rad = Math.max(16, (90 + R * 0.5) * k);
      glow(x, y, rad, col, (0.25 + 0.7 * Math.exp(-t / 10)) * fade); cx.save(); cx.translate(x, y); cx.scale(9, 0.09); glow(0, 0, rad * 1.4, [255, 255, 255], 0.9 * e); cx.restore(); cx.save(); cx.translate(x, y); cx.scale(0.09, 5); glow(0, 0, rad * 1.2, [200, 220, 255], 0.5 * e); cx.restore();
      for (const f of [[1, 0.6], [0.78, 0.3], [0.55, 0.18]]) { const rr = R * f[0] * k; if (rr > 4 && rr < 6000) { cx.strokeStyle = cs; cx.globalAlpha = f[1] * fade * Math.max(0.15, 1 - u); cx.lineWidth = Math.max(1.5, rr * 0.012 * (1 - u)); cx.beginPath(); cx.arc(x, y, rr, 0, TAU); cx.stroke(); } } }
    for (const p of bz.p) { const a = pj(p, R * p.s), b = a && pj(p, R * p.s * (1 - 0.05 - 0.14 * p.q * Math.exp(-t / 9))); if (!b) continue; if (a[0] < -40 || a[1] < -40 || a[0] > W + 40 || a[1] > H + 40) continue; cx.strokeStyle = p.q > 0.8 ? hc : cs; cx.globalAlpha = fade * p.q * (p.s > 0.99 ? 0.95 : 0.6); cx.lineWidth = Math.min(4, Math.max(1, 9 * a[2])); cx.beginPath(); cx.moveTo(b[0], b[1]); cx.lineTo(a[0], a[1]); cx.stroke(); }
    const dP = Math.hypot(px - BO.x, py - BO.y, pz - BO.z); if (dP < R) { cx.globalAlpha = 0.35 * Math.exp(-t / 14) * fade * (1 - 0.5 * dP / R); cx.fillStyle = cs; cx.fillRect(0, 0, W, H); }
    cx.globalAlpha = 1; cx.globalCompositeOperation = 'source-over';
  }

  const FAC = [0.25, 0.6, 1], HN = ['Chasseur', 'Navette', 'Soucoupe'], HC = [['#9fb4cc', '#3a4a60'], ['#e0b068', '#6b4a22'], ['#86d9ac', '#2f6a4c'], ['#cf8ae0', '#5a2f6a'], ['#ea6a6a', '#6a2a2a'], ['#eceef5', '#586072']], EC = [[80, 180, 255], [255, 140, 60], [120, 255, 170], [255, 90, 200]],
    HULL = [{ p: [[0, -1.1], [0.18, -0.3], [0.95, 0.55], [0.55, 0.62], [0.3, 0.35], [0.22, 0.65], [-0.22, 0.65], [-0.3, 0.35], [-0.55, 0.62], [-0.95, 0.55], [-0.18, -0.3]], e: [[-0.14, 0.65], [0.14, 0.65]], c: [0, -0.35] },
      { p: [[0, -1], [0.35, -0.4], [0.45, 0.5], [0.8, 0.7], [0.45, 0.75], [-0.45, 0.75], [-0.8, 0.7], [-0.45, 0.5], [-0.35, -0.4]], e: [[-0.25, 0.75], [0.25, 0.75]], c: [0, -0.45] },
      { p: [[0, -0.55], [0.5, -0.25], [1, 0.08], [0.6, 0.4], [0, 0.5], [-0.6, 0.4], [-1, 0.08], [-0.5, -0.25]], e: [[-0.5, 0.42], [0.5, 0.42]], c: [0, -0.3] }], DUST = Array.from({ length: 110 }, () => [Math.random() * 1200, Math.random() * 1200, Math.random() * 1200]);
  function hid(o) { const q = o.par || o, f = FAC[q.k === 2 ? cfg.bh : q.k === 3 ? cfg.nb : cfg.ds]; return f < 1 && ((q.seed * 3266489917) >>> 0) / 4294967296 > f; }
    function drawDust(ds, X0, Y0, fx, fy, fz, cy, sy, ux, uy, uz, Fw) { // poussière interstellaire : donne la sensation de vitesse (traînées radiales)
    if (vel < 12) return; const m = v => ((v % 1200) + 1200) % 1200 - 600, L = Math.min(vel * ds * 4, 500), pr = (a, b, c) => { const zc = a * fx + b * fy + c * fz; if (zc < 6) return null; const k = Fw / zc; return [X0 + (a * cy + c * sy) * k, Y0 - (a * ux + b * uy + c * uz) * k]; };
    cx.strokeStyle = 'rgba(190,215,255,.5)'; cx.lineWidth = 1; cx.beginPath(); for (const d of DUST) { const rx = m(d[0] - px), ry = m(d[1] - py), rz = m(d[2] - pz), p1 = pr(rx, ry, rz), p0 = pr(rx + fx * L, ry + fy * L, rz + fz * L); if (!p1 || !p0) continue; cx.moveTo(p0[0], p0[1]); cx.lineTo(p1[0], p1[1]); } cx.stroke();
  }

  function h3(a, b, c, q) { let h = (Math.imul(a, 374761393) + Math.imul(b, 668265263) + Math.imul(c, 2147483629) + Math.imul(q | 0, 1274126177)) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
  function updateWH() { // trous de ver : ~30 % des cubes de 3000 u en abritent un, avec sortie à 30–250 ku
    whs.length = 0; const SZ = 3000, a0 = Math.floor(px / SZ), b0 = Math.floor(py / SZ), c0 = Math.floor(pz / SZ);
    for (let a = a0 - 1; a <= a0 + 1; a++) for (let b = b0 - 1; b <= b0 + 1; b++) for (let c = c0 - 1; c <= c0 + 1; c++) { const key = a + ',' + b + ',' + c + ',' + sd; let o = WM.get(key); if (o === undefined) { o = null; if (h3(a, b, c, sd) < 0.3) { const u = n => h3(a, b, c, sd + n), dd = 30000 + u(5) * 220000, ta = u(6) * TAU, ph = (u(7) - 0.5) * 1.4; o = { k: 4, g: 1, bt: -1, x: (a + u(1)) * SZ, y: (b + u(2)) * SZ, z: (c + u(3)) * SZ, r: 55 + u(4) * 35, seed: ((u(8) * 1e9) | 0) + 1, dd }; o.ox = o.x + Math.cos(ta) * Math.cos(ph) * dd; o.oy = o.y + Math.sin(ph) * dd; o.oz = o.z + Math.sin(ta) * Math.cos(ph) * dd; } if (WM.size > 400) WM.clear(); WM.set(key, o); } if (o) whs.push(o); }
  }
  function enterWH(o) { if (whCd > 0) return; const back = { k: 4, g: 1, bt: -1, x: o.ox, y: o.oy, z: o.oz, r: o.r, seed: ((o.seed ^ 0x2545F491) >>> 0) || 1, dd: o.dd, ox: o.x, oy: o.y, oz: o.z }; if (!gods.some(g => g.seed === back.seed)) gods.push(back);
    px = o.ox + 230; py = o.oy; pz = o.oz + 230; whCd = 4; stopAp(); sel = null; vk = ''; fl = 1; shk = 20; say('🕳 Trou de ver traversé : ' + Math.round(o.dd / 1000) + ' ku franchis. Une porte de retour s\'ouvre derrière toi.'); }
  function drawMonster(o, x, y, r) {
    // Monstre colossal : silhouette organique multi-couches, yeux, plaques et tentacules animés.
    r = Math.max(r, 8); const c = o.c || MONSTER_COLORS[o.t % MONSTER_COLORS.length], pulse = 1 + Math.sin(tm * 1.8 + o.phase) * 0.045;
    cx.save(); cx.translate(x, y); cx.scale(pulse, pulse); cx.globalCompositeOperation = 'lighter'; glow(0, 0, r * 2.4, c, 0.24);
    // tentacules
    cx.lineCap = 'round'; for (let i = 0; i < o.tent; i++) { const a = i * TAU / o.tent + o.phase + tm * 0.22 * o.speed, len = r * (1.05 + 0.38 * Math.sin(i * 2.7 + tm * 1.4)), bend = Math.sin(tm * 1.6 + i * 1.9) * r * 0.28; cx.strokeStyle = rgb(c, 0.42); cx.lineWidth = Math.max(2, r * 0.055); cx.beginPath(); cx.moveTo(Math.cos(a) * r * 0.48, Math.sin(a) * r * 0.48); cx.quadraticCurveTo(Math.cos(a + 0.32) * r * 0.82 + Math.cos(a + 1.57) * bend, Math.sin(a + 0.32) * r * 0.82 + Math.sin(a + 1.57) * bend, Math.cos(a) * len, Math.sin(a) * len); cx.stroke(); }
    cx.globalCompositeOperation = 'source-over';
    const g = cx.createRadialGradient(-r * 0.28, -r * 0.35, r * 0.08, 0, 0, r); g.addColorStop(0, 'rgba(235,255,250,.98)'); g.addColorStop(0.18, rgb(c, .98)); g.addColorStop(0.7, rgb(c, .72)); g.addColorStop(1, 'rgba(5,8,18,.95)'); cx.fillStyle = g; cx.beginPath(); cx.ellipse(0, 0, r * 0.86, r * 0.68, Math.sin(tm * 0.4 + o.phase) * 0.15, 0, TAU); cx.fill();
    // plaques dorsales
    cx.strokeStyle = rgb(c, .45); cx.lineWidth = Math.max(1, r * .035); for (let i = -2; i <= 2; i++) { cx.beginPath(); cx.moveTo(i * r * .2, -r * .46); cx.lineTo(i * r * .13, -r * .82); cx.stroke(); }
    // yeux
    for (const ex of [-0.3, 0.3]) { cx.fillStyle = '#05040b'; cx.beginPath(); cx.ellipse(ex * r, -r * .16, r * .14, r * .18, 0, 0, TAU); cx.fill(); cx.fillStyle = '#dfffff'; cx.shadowColor = rgb(c, .9); cx.shadowBlur = r * .18; cx.beginPath(); cx.arc(ex * r, -r * .16, Math.max(1.5, r * .045), 0, TAU); cx.fill(); cx.shadowBlur = 0; }
    cx.fillStyle = 'rgba(255,255,255,.75)'; cx.font = '600 ' + Math.max(9, Math.min(16, r * .11)) + 'px system-ui'; cx.textAlign = 'center'; cx.fillText(o.variant === 'leviathan' ? 'TITAN LÉVIATHAN' : 'LÉVIATHAN', 0, r * 1.45); cx.restore();
  }
  function drawWorm(o, x, y, r) { // trou de ver : sphère de verre iridescente, spirales, reflet
    r = Math.max(r, 3); cx.globalCompositeOperation = 'lighter'; glow(x, y, r * 2.4, [120, 200, 255], 0.35);
    const g = cx.createRadialGradient(x, y, r * 0.2, x, y, r); g.addColorStop(0, 'rgba(10,0,40,.95)'); g.addColorStop(0.75, 'rgba(60,120,255,.25)'); g.addColorStop(0.93, 'rgba(180,230,255,.85)'); g.addColorStop(1, 'rgba(255,255,255,0)'); cx.globalCompositeOperation = 'source-over'; cx.fillStyle = g; cx.beginPath(); cx.arc(x, y, r, 0, TAU); cx.fill();
    cx.globalCompositeOperation = 'lighter'; cx.lineWidth = Math.max(1, r * 0.03); for (let i = 0; i < 5; i++) { const a0 = tm * (0.6 + i * 0.15) + i * 1.3; cx.strokeStyle = 'rgba(' + (i % 2 ? '255,120,230' : '120,220,255') + ',' + (0.5 - i * 0.07) + ')'; cx.beginPath(); cx.arc(x, y, r * (0.25 + i * 0.14), a0, a0 + 2.2); cx.stroke(); }
    cx.strokeStyle = 'rgba(255,255,255,.55)'; cx.lineWidth = Math.max(1, r * 0.05); cx.beginPath(); cx.arc(x, y, r * 0.88, 3.5, 4.4); cx.stroke(); cx.globalCompositeOperation = 'source-over';
  }
  function dropBeacon() { if (bcs.length >= 12) return say('12 repères maximum.'); const n = bcs.length + 1; bcs.push({ k: 5, x: px, y: py, z: pz, r: 12, seed: 900000000 + n * 7 + (sd % 1000), n }); say('📍 Repère ' + n + ' posé : X ' + Math.round(px) + ' Y ' + Math.round(py) + ' Z ' + Math.round(pz)); CU.Save.mark(); }
  function nextBeacon() { if (!bcs.length) return say('Aucun repère. Pose-en un avec 📍.'); sel = bcs[(bcs.indexOf(sel) + 1) % bcs.length]; CU.Sound.ui(); }
  function drawBeacons(X0, Y0, fx, fy, fz, cy, sy, ux, uy, uz, Fw) {
    for (const b of bcs) { b.sx = null; const dx = b.x - px, dy = b.y - py, dz = b.z - pz, zc = dx * fx + dy * fy + dz * fz; if (zc < 2) continue; const k = Fw / zc, x = X0 + (dx * cy + dz * sy) * k, y = Y0 - (dx * ux + dy * uy + dz * uz) * k; if (x < 10 || y < 10 || x > W - 10 || y > H - 10) continue; b.sx = x; b.sy = y;
      cx.strokeStyle = cx.fillStyle = '#7affff'; cx.globalAlpha = 0.9; cx.lineWidth = 1.5; cx.beginPath(); cx.moveTo(x, y - 9); cx.lineTo(x + 7, y); cx.lineTo(x, y + 9); cx.lineTo(x - 7, y); cx.closePath(); cx.stroke(); cx.beginPath(); cx.moveTo(x, y - 9); cx.lineTo(x, y - 34); cx.stroke(); cx.font = '11px system-ui'; cx.textAlign = 'center'; cx.fillText('Repère ' + b.n + ' · ' + Math.round(Math.hypot(dx, dy, dz)) + ' u', x, y - 40); cx.globalAlpha = 1; }
  }
  function drawRadar() { // radar vu de dessus (cap en haut) + coordonnées ; toucher le radar = repère suivant
    const X = 52, Y = 150, R = 42, RG = 3000, c_ = Math.cos(yaw), s_ = Math.sin(yaw), P = (o, col, z) => { const dx = o.x - px, dz = o.z - pz; let rx = (dx * c_ + dz * s_) / RG * R, ry = (-dx * s_ + dz * c_) / RG * R; const l = Math.hypot(rx, ry); if (l > R - 2) { rx *= (R - 2) / l; ry *= (R - 2) / l; } cx.fillStyle = col; cx.fillRect(X + rx - z / 2, Y - ry - z / 2, z, z); };
    cx.save(); cx.globalAlpha = 1; cx.fillStyle = 'rgba(2,6,24,.62)'; cx.strokeStyle = 'rgba(0,240,255,.45)'; cx.lineWidth = 1; cx.beginPath(); cx.arc(X, Y, R, 0, TAU); cx.fill(); cx.stroke(); cx.beginPath(); cx.arc(X, Y, R / 2, 0, TAU); cx.stroke(); cx.beginPath(); cx.moveTo(X - R, Y); cx.lineTo(X + R, Y); cx.moveTo(X, Y - R); cx.lineTo(X, Y + R); cx.globalAlpha = 0.25; cx.stroke(); cx.globalAlpha = 1;
    const CO = ['#ffd27a', '#6ac1ff', '#ff4a4a', '#c07aff', '#7affff', '#7affff', '#ff4fa8']; for (const c of vis) for (const o of c.o) { if (kill[o.seed] || (o.par && kill[o.par.seed]) || (o.bt !== undefined && age < o.bt) || (!o.g && hid(o))) continue; if (Math.abs(o.x - px) > RG * 1.2 || Math.abs(o.z - pz) > RG * 1.2) continue; P(o, CO[o.k] || '#fff', o.k === 0 || o.k === 4 ? 3 : 2); }
    for (const b of bcs) P(b, '#7affff', 4); if (sel) { const dx = sel.x - px, dz = sel.z - pz, rx = (dx * c_ + dz * s_) / RG * R, ry = (-dx * s_ + dz * c_) / RG * R, l = Math.hypot(rx, ry), k = l > R - 3 ? (R - 3) / l : 1; cx.strokeStyle = '#ffd27a'; cx.beginPath(); cx.arc(X + rx * k, Y - ry * k, 4, 0, TAU); cx.stroke(); }
    cx.fillStyle = '#fff'; cx.beginPath(); cx.moveTo(X, Y - 5); cx.lineTo(X + 3.5, Y + 4); cx.lineTo(X - 3.5, Y + 4); cx.fill(); cx.font = '9px monospace'; cx.textAlign = 'left'; cx.fillStyle = 'rgba(190,230,255,.8)'; cx.fillText('X ' + (px / 1000).toFixed(2) + 'k', 8, Y + R + 12); cx.fillText('Y ' + (py / 1000).toFixed(2) + 'k', 8, Y + R + 22); cx.fillText('Z ' + (pz / 1000).toFixed(2) + 'k', 8, Y + R + 32); cx.restore();
  }
  const HCr = HC.map(c => c.map(h => [1, 3, 5].map(i => parseInt(h.substr(i, 2), 16))));
  // ===== Maillages v0.25 : polygones [matière, i0, i1, …] — 0 coque · 1 verrière · 2 liseré/accent · 3 feux =====
  function MB() {
    const V = [], F = [], o = {
      V, F, add: p => V.push(p) - 1, poly(m, ...ix) { F.push([m, ...ix]); },
      loft(rs, n, mf, ox = 0, oy = 0, oz = 0) { const R = rs.map(r => { const a = []; for (let i = 0; i < n; i++) { const t = i / n * TAU; a.push(o.add([ox + (r[3] || 0) + Math.cos(t) * r[1], oy + (r[4] || 0) + Math.sin(t) * r[2], oz + r[0]])); } return a; });
        for (let k = 0; k < rs.length - 1; k++) for (let i = 0; i < n; i++) { const j = (i + 1) % n; o.poly(mf ? mf(k, i, n) : 0, R[k][i], R[k][j], R[k + 1][j], R[k + 1][i]); } },
      lathe(pr, n, mf, oy = 0) { const R = pr.map(r => { const a = []; for (let i = 0; i < n; i++) { const t = i / n * TAU; a.push(o.add([Math.cos(t) * r[0], oy + r[1], Math.sin(t) * r[0]])); } return a; });
        for (let k = 0; k < pr.length - 1; k++) for (let i = 0; i < n; i++) { const j = (i + 1) % n; o.poly(mf ? mf(k, i, n) : 0, R[k][i], R[k][j], R[k + 1][j], R[k + 1][i]); } },
      slab(pts, ax, off, th, m) { const g = (p, s) => ax === 'y' ? [p[0], off + s * th, p[1]] : [off + s * th, p[0], p[1]], A = pts.map(p => o.add(g(p, 1))), B = pts.map(p => o.add(g(p, -1))), n = pts.length;
        o.poly(m, ...A); o.poly(m, ...B); for (let i = 0; i < n; i++) { const j = (i + 1) % n; o.poly(m === 1 ? 1 : 2, A[i], A[j], B[j], B[i]); } } };
    return o;
  }
  const mir = p => p.map(q => [-q[0], q[1]]), HMc = [];
  function buildHull(h) {
    const b = MB();
    if (h === 0) { // CHASSEUR : fuselage lofté, verrière, ailes à bords d'attaque, missiles, dérives, tuyères doubles
      b.loft([[-1.95, .012, .012], [-1.6, .06, .05], [-1.15, .15, .11], [-.55, .24, .17], [.2, .27, .19], [.7, .25, .17], [.95, .2, .14]], 10, (k, i) => k === 3 || k === 5 ? 2 : 0);
      b.loft([[-1.05, .05, .03, 0, .12], [-.75, .11, .09, 0, .15], [-.35, .13, .1, 0, .15], [-.02, .09, .05, 0, .12]], 10, () => 1);
      const w = [[.2, -.45], [1.42, .5], [1.42, .84], [.2, .68]], st = [[.55, -.08], [1.32, .52], [1.32, .64], [.55, .2]];
      for (const p of [w, mir(w)]) b.slab(p, 'y', -.05, .022, 0); for (const p of [st, mir(st)]) b.slab(p, 'y', -.022, .006, 2);
      for (const s of [-1, 1]) {
        b.loft([[0, .045, .045], [.55, .045, .045], [.78, .028, .028]], 8, k => k ? 0 : 2, s * 1.2, -.11, -.1);
        b.slab([[.12, .3], [.74, .8], [.74, .97], [.12, .97]], 'x', s * .24, .018, 0); b.slab([[.62, .74], [.74, .8], [.74, .97], [.62, .97]], 'x', s * .24, .02, 2);
        b.loft([[.1, .11, .11], [.7, .115, .115], [.88, .14, .14], [.95, .105, .105], [1, .08, .08]], 10, k => k >= 2 ? 2 : 0, s * .2, -.02, 0);
        b.loft([[-.35, .02, .02], [-.05, .02, .02]], 6, () => 2, s * 1.38, -.04, -.2);
      }
      b.loft([[-2.35, .006, .006], [-1.9, .012, .012]], 6, () => 2);
      return { V: b.V, F: b.F, E: [[-.2, -.02, 1.01], [.2, -.02, 1.01]] };
    }
    if (h === 1) { // NAVETTE : fuselage large, verrière, hublots, nacelles, dérive dorsale
      b.loft([[-1.35, .05, .05], [-1.05, .27, .21], [-.5, .4, .3], [.3, .46, .34], [.8, .42, .3], [1.02, .34, .25]], 12, (k, i) => k === 2 && i % 12 > 1 ? 2 : 0);
      b.loft([[-1.2, .07, .04, 0, .15], [-.95, .25, .15, 0, .17], [-.6, .27, .14, 0, .18], [-.4, .2, .08, 0, .17]], 12, () => 1);
      for (let i = 0; i < 6; i++) for (const s of [-1, 1]) b.slab([[.04, -.18 + i * .22], [.04, -.06 + i * .22], [-.05, -.06 + i * .22], [-.05, -.18 + i * .22]], 'x', s * (.43 - Math.abs(i - 2.5) * .006), .012, 1);
      const w = [[.38, .05], [1.05, .72], [1.05, .98], [.38, .95]];
      for (const p of [w, mir(w)]) b.slab(p, 'y', -.14, .03, 0);
      for (const s of [-1, 1]) { b.loft([[-.1, .1, .1], [.5, .13, .13], [1.0, .14, .14], [1.08, .11, .11], [1.12, .08, .08]], 10, k => k >= 2 ? 2 : 0, s * .66, -.12, 0); b.loft([[-.35, .05, .05], [-.1, .1, .1]], 8, () => 2, s * .66, -.12, 0); }
      b.slab([[.3, .35], [.95, .88], [.95, 1.02], [.3, 1.0]], 'x', 0, .03, 0); b.slab([[.8, .78], [.95, .88], [.95, 1.02], [.8, 1.0]], 'x', 0, .032, 2);
      return { V: b.V, F: b.F, E: [[-.66, -.12, 1.14], [.66, -.12, 1.14], [0, 0, 1.06]] };
    }
    // SOUCOUPE : disque lathé, dôme vitré, anneau de feux, nacelles arrière
    b.lathe([[0, .36], [.2, .34], [.5, .24], [.8, .1], [1, .01], [.82, -.1], [.55, -.17], [.3, -.23], [0, -.26]], 28, (k, i) => k === 2 && i % 4 < 2 ? 2 : k === 4 ? 2 : 0);
    b.lathe([[0, .55], [.14, .51], [.26, .42], [.33, .32]], 20, () => 1);
    b.lathe([[.97, .03], [1.03, 0], [.97, -.03]], 28, (k, i) => i % 2 ? 3 : 2);
    b.lathe([[.2, -.25], [.34, -.3], [.4, -.36], [.18, -.38]], 16, k => k ? 2 : 0);
    for (const s of [-1, 1]) b.loft([[.1, .09, .09], [.4, .1, .1], [.52, .12, .12], [.58, .08, .08]], 8, k => k >= 1 ? 2 : 0, s * .52, -.04, .1);
    return { V: b.V, F: b.F, E: [[-.52, -.04, .7], [.52, -.04, .7]] };
  }
  const SHL = [-.4, .7, .6], SHH = [-.222, .389, .889], SHF = [.5, -.4, .5];
  function drawShip(ds) { // vaisseau 3D : maillage lofté, éclairage clé + remplissage moteur + spéculaire, verrière brillante, réacteurs vivants
    const hm = HMc[cfg.hu % 3] || (HMc[cfg.hu % 3] = buildHull(cfg.hu % 3)), hc = HCr[cfg.co % 6], en = EC[cfg.en % 4], sz = Math.min(W, 560) * 0.135, y0 = H - 215, yr = (yaw - lyaw) / Math.max(ds, 0.001); lyaw = yaw; rl += (cl(-yr * 0.25, -0.6, 0.6) - rl) * Math.min(1, ds * 5);
    const th = cl(vel / 150, 0, 1) + wv * 1.6, rz = rl * 0.9, ry = rl * 0.5, rx = 0.05 * Math.sin(tm * 1.3), cz = Math.cos(rz), sz_ = Math.sin(rz), cyy = Math.cos(ry), syy = Math.sin(ry), cxx = Math.cos(rx), sxx = Math.sin(rx);
    const T = v => { let x = v[0], y = v[1], z = v[2], a = x * cyy + z * syy, b = -x * syy + z * cyy; x = a; z = b; a = y * cxx - z * sxx; b = y * sxx + z * cxx; y = a; z = b; a = x * cz - y * sz_; b = x * sz_ + y * cz; return [a, b, z]; };
    const pj = p => { const f = 1 / (1 - p[2] * 0.12); return [W / 2 + p[0] * sz * f, y0 - p[1] * sz * f + p[2] * sz * 0.28]; }, P = hm.V.map(T), Q = P.map(pj); shx = W / 2; shy = y0 + sz * 0.4; shw = sz * 2;
    const fk = 1 + 0.07 * Math.sin(tm * 47) + 0.05 * Math.sin(tm * 29);
    if (cfg.tr === 0 && th > 0.3) { cx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 4; i++) glow(W / 2 + (Math.random() - 0.5) * sz * 0.6, y0 + sz * (1.3 + i * 0.5), sz * 0.4, en, 0.12 * th); cx.globalCompositeOperation = 'source-over'; }
    const fs = hm.F.map(f => { const a = P[f[1]], b = P[f[2]], c = P[f[3]], ax = b[0] - a[0], ay = b[1] - a[1], az = b[2] - a[2], bx = c[0] - a[0], by = c[1] - a[1], bz = c[2] - a[2]; let nx = ay * bz - az * by, ny = az * bx - ax * bz, nz = ax * by - ay * bx; const nl = Math.hypot(nx, ny, nz) || 1; if (nz < 0) { nx = -nx; ny = -ny; nz = -nz; } nx /= nl; ny /= nl; nz /= nl; let zs = 0; for (let i = 1; i < f.length; i++) zs += P[f[i]][2]; zs /= f.length - 1;
      return { f, z: zs + (f[0] === 1 ? 0.03 : f[0] === 2 ? 0.008 : 0), d: Math.max(0, nx * SHL[0] + ny * SHL[1] + nz * SHL[2]), sp: Math.max(0, nx * SHH[0] + ny * SHH[1] + nz * SHH[2]), fl: Math.max(0, nx * SHF[0] + ny * SHF[1] + nz * SHF[2]) }; }).sort((p, q) => p.z - q.z);
    cx.globalAlpha = 1; cx.globalCompositeOperation = 'source-over'; cx.lineJoin = 'round';
    for (const o of fs) { const f = o.f, m = f[0], s = 0.22 + 0.78 * o.d; let r, g, b;
      if (m === 3) { r = en[0] * 0.4 + 150; g = en[1] * 0.4 + 150; b = en[2] * 0.4 + 150; } else if (m === 1) { r = 40 + 150 * o.d; g = 120 + 115 * o.d; b = 170 + 85 * o.d; const sp = Math.pow(o.sp, 18) * 255; r += sp; g += sp; b += sp; }
      else { const k = m === 2 ? 0.58 : 1, sp = Math.pow(o.sp, 12) * (m === 2 ? 70 : 55); r = (hc[1][0] + (hc[0][0] - hc[1][0]) * s) * k + sp; g = (hc[1][1] + (hc[0][1] - hc[1][1]) * s) * k + sp; b = (hc[1][2] + (hc[0][2] - hc[1][2]) * s) * k + sp; }
      const ef = o.fl * 0.22 * (0.4 + th); r += en[0] * ef; g += en[1] * ef; b += en[2] * ef;
      cx.fillStyle = 'rgb(' + Math.min(255, r | 0) + ',' + Math.min(255, g | 0) + ',' + Math.min(255, b | 0) + ')'; cx.strokeStyle = m === 1 ? 'rgba(210,250,255,.55)' : 'rgba(0,0,0,.3)'; cx.lineWidth = m === 1 ? 0.7 : 0.5;
      cx.beginPath(); for (let i = 1; i < f.length; i++) { const q = Q[f[i]]; i === 1 ? cx.moveTo(q[0], q[1]) : cx.lineTo(q[0], q[1]); } cx.closePath(); cx.fill(); cx.stroke(); }
    // Réacteurs : halo, cœur blanc, étoile de diffraction, feux de navigation clignotants
    cx.globalCompositeOperation = 'lighter';
    for (const e of hm.E) { const q = pj(T(e)), rr = sz * (0.16 + 0.32 * (0.2 + th * 0.8)) * fk; glow(q[0], q[1], rr * 2.4, en, 0.5); glow(q[0], q[1], rr, mix(en, 255, 0.6), 0.9); glow(q[0], q[1], rr * 0.4, [255, 255, 255], 0.95);
      if (th > 0.4) { cx.strokeStyle = 'rgba(' + mix(en, 255, 0.5).map(Math.round) + ',' + (0.35 * th) + ')'; cx.lineWidth = 1; cx.beginPath(); cx.moveTo(q[0] - rr * 2.2, q[1]); cx.lineTo(q[0] + rr * 2.2, q[1]); cx.moveTo(q[0], q[1] - rr * 1.2); cx.lineTo(q[0], q[1] + rr * 1.2); cx.stroke(); } }
    const bl = Math.sin(tm * 5) > 0.55 ? 1 : 0.35, wx = cfg.hu % 3 === 2 ? 1 : cfg.hu % 3 === 1 ? 1.05 : 1.42, wzz = cfg.hu % 3 === 2 ? 0 : 0.65, wy = cfg.hu % 3 === 0 ? -0.05 : cfg.hu % 3 === 1 ? -0.14 : 0;
    const navL = pj(T([-wx, wy, wzz])), navR = pj(T([wx, wy, wzz])); glow(navL[0], navL[1], sz * .11, [255, 70, 80], .85 * bl); glow(navR[0], navR[1], sz * .11, [80, 255, 170], .85 * bl);
    cx.globalCompositeOperation = 'source-over'; cx.fillStyle = 'rgba(200,230,255,.55)'; cx.font = '600 10px system-ui'; cx.textAlign = 'center'; cx.fillText(cfg.nm, W / 2, y0 + sz * 1.15 + 20);
  }
  const SKP = [[[70, 130, 220], [170, 210, 245]], [[200, 150, 100], [240, 200, 150]], [[150, 190, 230], [220, 235, 250]], [[40, 10, 10], [160, 60, 20]], [[220, 180, 120], [250, 225, 185]]];
  const h2 = (x, y, q) => { const n = Math.sin(x * 127.1 + y * 311.7 + q * 74.7) * 43758.5453; return n - Math.floor(n); };
  const v2 = (x, y, q) => { const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf); return (h2(xi, yi, q) * (1 - u) + h2(xi + 1, yi, q) * u) * (1 - v) + (h2(xi, yi + 1, q) * (1 - u) + h2(xi + 1, yi + 1, q) * u) * v; };
  function th_(x, y, T, q) { const k = 0.0035; let a = 0.5 * v2(x * k, y * k, q) + 0.3 * v2(x * k * 2.3, y * k * 2.3, q + 1) + 0.2 * v2(x * k * 5.1, y * k * 5.1, q + 2); if (T === 1) a = a * 0.8 + 0.2 * Math.abs(Math.sin(x * 0.01 + a * 6)); if (T === 3) a = Math.pow(a, 1.6) * 1.5; return (a - 0.48) * (T === 4 ? 120 : T === 2 ? 380 : 560); }
  function tc(h, T) { return T === 0 ? (h < 0 ? [30, 90 + h * 0.2, 160] : h < 14 ? [214, 196, 146] : h < 150 ? [58 + h * 0.1, 128 - h * 0.15, 52] : h < 260 ? [112, 102, 92] : [240, 244, 250]) : T === 1 ? [226 - h * 0.12, 176 - h * 0.18, 108 - h * 0.12] : T === 2 ? (h < 0 ? [90, 140, 200] : [205 + h * 0.03, 228 + h * 0.02, 246]) : T === 3 ? (h < -20 ? [255, 110 + (h + 60) * 2, 20] : [44 + h * 0.05, 32, 30]) : [236 - Math.abs(h) * 0.5, 200 - Math.abs(h) * 0.9, 150 - Math.abs(h)]; }
  function tryLand() { const t = sel || lk; if (!t || t.k !== 1) return say('Touche une planète pour y atterrir.'); if (Math.hypot(t.x - px, t.y - py, t.z - pz) - t.r < t.r * 1.2 + 80) return landOn(t); lp = t; tg = t; ap = true; if (apb) apb.classList.add('on'); say('Approche de ' + nm(t) + ' avant atterrissage…'); }
  function landOn(o) { sf = { o, x: (o.seed % 997) * 7.3, y: (o.seed % 541) * 5.1, h: 800, v: 0, t: 0, sv: { x: px, y: py, z: pz, yaw, pitch } }; yaw = 0; pitch = 0.12; stopAp(); lp = null; sel = null; vel = 0; fl = 1; shk = 16; if (lbtn) lbtn.innerHTML = '<span>🚀</span><em>DÉCOLLER</em>'; say('🪂 Entrée dans l\'atmosphère de ' + nm(o) + '. POUSSER pour avancer, incline le regard pour monter/descendre.'); }
  function exitSurface() { const v = sf.sv; px = v.x; py = v.y; pz = v.z; yaw = v.yaw; pitch = v.pitch; sf = null; vel = 0; fl = 0.8; if (lbtn) lbtn.innerHTML = '<span>🪂</span><em>ATTERRIR</em>'; say('🚀 De retour en orbite.'); }
  let SFB = null;
  function drawSurface(ds) { // surface planétaire 3D (voxel-space) : relief procédural, eau, brume, soleil, étoiles en altitude
    const o = sf.o, T = o.t % 5, q = o.seed % 1000, sk = SKP[T], cols = CU.mobile ? 72 : 130, cw = W / cols, fov = 1.25, sc = H * 0.95, hz = H * (0.46 + pitch * 0.7), wl = T === 0 || T === 2 ? 0 : T === 3 ? -20 : -1e9;
    sf.t += ds; const tgt = brk ? 0 : warp ? 1400 : thr ? 320 : 0; sf.v += (tgt - sf.v) * Math.min(1, ds * (tgt ? 2.2 : 3)); const hx = -Math.sin(yaw), hy = Math.cos(yaw); sf.x += hx * sf.v * ds; sf.y += hy * sf.v * ds;
    const g0 = Math.max(th_(sf.x, sf.y, T, q), wl); sf.h += Math.sin(pitch) * sf.v * ds * 0.9; if (sf.t < 5 && sf.h > g0 + 60) sf.h -= 120 * ds; sf.h = Math.max(sf.h, g0 + 7); if (sf.h > 1500) { exitSurface(); return; }
    cx.setTransform(CU.Modes.size.dpr, 0, 0, CU.Modes.size.dpr, 0, 0); cx.globalAlpha = 1; cx.globalCompositeOperation = 'source-over'; const g = cx.createLinearGradient(0, 0, 0, hz); g.addColorStop(0, 'rgb(' + sk[0] + ')'); g.addColorStop(1, 'rgb(' + sk[1] + ')'); cx.fillStyle = g; cx.fillRect(0, 0, W, H);
    const sa = cl((sf.h - 350) / 900, 0, 1); if (sa > 0) { cx.fillStyle = '#fff'; for (let i = 0; i < 70; i++) { cx.globalAlpha = sa * h2(i, 3, 1); cx.fillRect(h2(i, 1, 3) * W, h2(i, 2, 3) * hz * 0.85, 1.3, 1.3); } cx.globalAlpha = 1; }
    const dsun = ((yaw - 0.5 + Math.PI) % TAU + TAU) % TAU - Math.PI; if (Math.abs(dsun) < fov) { const sx = W / 2 - dsun / fov * W, sy = hz - H * 0.3; cx.globalCompositeOperation = 'lighter'; glow(sx, sy, H * 0.55, [255, 235, 190], 0.55); cx.globalCompositeOperation = 'source-over'; cx.fillStyle = '#fff6dc'; cx.beginPath(); cx.arc(sx, sy, H * 0.025, 0, TAU); cx.fill(); }
    const camH = sf.h, fg = sk[1];
    // Terrain haute définition : beaucoup plus de colonnes sur mobile pour supprimer l'effet voxel/pixelisé.
    // Le lissage final reste actif, mais la géométrie est calculée à une résolution proche de l'écran.
    const tq = CU.Q ? CU.Q.tier : 'med', base = { low: 240, med: 360, high: 480, ultra: 720 }[tq] || 360, BW = Math.max(180, Math.round(base * (CU.mobile ? (tq === 'ultra' ? .82 : 1) : 1.15))), BH = Math.max(120, Math.round(BW * H / W)), kS = BH / H, hzB = hz * kS, scB = sc * kS;
    if (!SFB || SFB.w !== BW || SFB.h !== BH) { const c = document.createElement('canvas'); c.width = BW; c.height = BH; const x = c.getContext('2d'); SFB = { cv: c, cx: x, im: x.createImageData(BW, BH), w: BW, h: BH }; }
    const D = SFB.im.data; D.fill(0); const sk0 = sk[0];
    for (let i = 0; i < BW; i++) { const a = yaw - (i / BW - 0.5) * fov, dx = -Math.sin(a), dy = Math.cos(a); let ymax = BH, z = 3, pr = -1, pg = 0, pb = 0;
      while (z < 2200 && ymax > 0) { const x = sf.x + dx * z, y = sf.y + dy * z, h = th_(x, y, T, q), hh = Math.max(h, wl), syy = hzB + (camH - hh) * scB / z;
        if (syy < ymax) {
          const fo = Math.pow(z / 2200, 1.3), c = tc(h, T); let sh, r, g, b;
          if (h < wl) { sh = 1 + 0.1 * Math.sin(x * 0.05 + tm * 2 + y * 0.04) + 0.05 * Math.sin(x * 0.21 - tm * 3 + y * 0.17); const rf = 0.18 + 0.55 * Math.min(1, z / 900); r = c[0] * sh * (1 - rf) + sk0[0] * rf; g = c[1] * sh * (1 - rf) + sk0[1] * rf; b = c[2] * sh * (1 - rf) + sk0[2] * rf; }
          else { const sl = hh - th_(x + 7, y - 5, T, q); sh = cl(0.84 + sl * 0.016, 0.45, 1.3) * (0.96 + 0.06 * Math.sin(x * 0.37 + Math.sin(y * 0.29) * 2)); r = c[0] * sh; g = c[1] * sh; b = c[2] * sh; }
          r = r * (1 - fo) + fg[0] * fo; g = g * (1 - fo) + fg[1] * fo; b = b * (1 - fo) + fg[2] * fo;
          if (pr < 0) { pr = r; pg = g; pb = b; }
          const y0 = Math.max(0, Math.ceil(syy)), y1 = Math.min(BH, Math.ceil(ymax)), n = y1 - y0;
          for (let yy = y0; yy < y1; yy++) { const t = n > 1 ? (yy - y0) / (n - 1) : 0, k = (yy * BW + i) * 4; D[k] = r + (pr - r) * t; D[k + 1] = g + (pg - g) * t; D[k + 2] = b + (pb - b) * t; D[k + 3] = 255; }
          pr = r; pg = g; pb = b; ymax = syy; }
        z += 1 + z * 0.025; } }
    SFB.cx.putImageData(SFB.im, 0, 0);
    // Couche atmosphérique indépendante : bancs de nuages semi-transparents et
    // ombres douces qui glissent au-dessus du relief, uniquement sur les mondes
    // avec eau ou glace. Les positions sont déterministes pour chaque planète.
    cx.imageSmoothingEnabled = true; cx.imageSmoothingQuality = 'high'; cx.drawImage(SFB.cv, 0, 0, W, H);
    if (T === 0 || T === 2) { const clouds = tq === 'ultra' ? 18 : tq === 'high' ? 12 : 7; cx.save(); cx.globalCompositeOperation = 'screen';
      for (let i = 0; i < clouds; i++) { const xx = ((h2(i, q, 31) * W + sf.x * (0.013 + i % 3 * .003) + tm * (8 + i % 4 * 2)) % (W + 240)) - 120, yy = hz * (.36 + h2(i, q, 41) * .48), rw = 45 + h2(i, q, 51) * 120, rh = rw * (.08 + h2(i, q, 61) * .12); const cg = cx.createRadialGradient(xx, yy, 0, xx, yy, rw); cg.addColorStop(0, 'rgba(245,252,255,.16)'); cg.addColorStop(.48, 'rgba(220,240,255,.07)'); cg.addColorStop(1, 'rgba(220,240,255,0)'); cx.fillStyle = cg; cx.beginPath(); cx.ellipse(xx, yy, rw, rh, h2(i, q, 71) - .5, 0, TAU); cx.fill(); }
      cx.restore(); }
    const haze = cx.createLinearGradient(0, hz * 0.18, 0, H); haze.addColorStop(0, 'rgba(' + fg[0] + ',' + fg[1] + ',' + fg[2] + ',0.00)'); haze.addColorStop(0.72, 'rgba(' + fg[0] + ',' + fg[1] + ',' + fg[2] + ',0.025)'); haze.addColorStop(1, 'rgba(' + fg[0] + ',' + fg[1] + ',' + fg[2] + ',0.11)'); cx.fillStyle = haze; cx.fillRect(0, hz * 0.18, W, H - hz * 0.18);
    if (sf.t < 3) { cx.globalCompositeOperation = 'lighter'; cx.fillStyle = 'rgba(255,120,40,' + 0.35 * (1 - sf.t / 3) + ')'; cx.fillRect(0, 0, W, H); cx.globalCompositeOperation = 'source-over'; }
    if (E && E.s) E.s.textContent = '🪂 ' + nm(o) + ' · alt ' + Math.round(sf.h - g0) + ' m · ' + Math.round(sf.v) + ' m/s · ' + Math.round(sf.x) + ':' + Math.round(sf.y);
    vel = cl(sf.v / 3, 0, 150); wv = warp ? 1 : 0; drawShip(ds); drawJoy(ds); if (scEl && scEl.style.display === 'block' && tm - scT > 14) scEl.style.display = 'none';
  }
  CU.Modes.register('inf', {
    open(c) {
      cx = c.ctx; ui = c.ui; const s = CU.Save.d, M_ = CU.Modes; if (!s.seed) { s.seed = ((Math.random() * 1e9) | 0) + 1; CU.Save.mark(); } sd = s.seed; cells.clear(); qStamp = ''; vk = ''; nd = 1e9; wv = 0; warp = false; tm = ts = 0; orb = 0; tsx = 1; gvx = gvy = gvz = gm = 0;
      const v = s.inf || { x: 450, y: 450, z: 100, yaw: 0, pitch: 0 }; px = v.x; py = v.y; pz = v.z; yaw = v.yaw; pitch = v.pitch; gods.length = 0; if (v.g) gods.push(...v.g); kill = v.kl || {}; mods = v.md || {}; sel = null; fl = 0; joy = null; lz = ex = bz = null; zm = 1; shk = 0; age = v.ag != null ? v.ag : 13800; le = -1; pa = age; Object.assign(cfg, v.cf || {}); bcs.length = 0; if (v.bc) bcs.push(...v.bc); sf = null; lp = null; ui.innerHTML = '';
      const top = M_.el('div', 'tl', '<b>∞ Voyage infini</b><div class="agec"><i>⏳ ÂGE DE L\'UNIVERS</i><strong>0 an</strong><u></u></div><span></span>', ui); E = { s: top.querySelector('span'), a: top.querySelector('.agec strong'), e: top.querySelector('.agec u') }; const pn = M_.el('div', 'fl', null, ui);
      colL = M_.el('div', 'col l', null, ui), colR = M_.el('div', 'col r', null, ui), setL = (b, t) => { const i = t.indexOf(' '); b.innerHTML = '<span>' + t.slice(0, i) + '</span><em>' + t.slice(i + 1) + '</em>'; }, B = (t, c, p) => { const b = M_.el('button', 'fb s ' + (c || ''), p ? '' : t, p || pn); if (p) setL(b, t); return b; }, hold = (b, on, off) => { b.onpointerdown = e => { e.preventDefault(); on(); b.classList.add('on'); CU.Sound.ui(); }; b.onpointerup = b.onpointercancel = b.onpointerleave = () => { off(); b.classList.remove('on'); }; };
      scEl = M_.el('div', 'scan', '', ui); scEl.onclick = () => { scEl.style.display = 'none'; }; bb = null; vel = 0; thr = brk = ap = false; tg = lk = null;
      const bs = B('🔭 SCAN', '', colR), ba = B('🎯 APPROCHE', '', colR), bh = B('⌂ NATAL', 'g', colR), bt = B('⏩ TEMPS ×1', '', colR), bg = B('💥 BIG BANG', '', colR), bj = B('🌀 SAUT', '', colR), bl = B('🪂 ATTERRIR', '', colR); lbtn = bl; bl.onclick = () => { CU.Sound.ui(); if (sf) exitSurface(); else tryLand(); }; const gb = (t, f) => { const b = B(t, 'g', colL); b.onclick = () => { CU.Sound.ui(); f(); }; return b; };
      gb('✨ ÉTOILE', () => create(0)); gb('✨ PLANÈTE', () => create(1)); gb('✨ TROU NOIR', () => create(2)); gb('🐉 INVOQUER DRAGON', () => createMonster('dragon')); gb('🐍 INVOQUER SERPENT', () => createMonster('serpent')); gb('🦑 INVOQUER TITAN', () => createMonster('leviathan')); gb('☄ DÉTRUIRE', destroy); gb('🔄 CHANGER', change); gb('📍 REPÈRE', dropBeacon); bh.onclick = () => { CU.Sound.ui(); goHome(); };
      const bf = B('■ FREIN'), bp = B('▲ POUSSER', 'go'), bw = B('⚡ LUMIÈRE'); btn = bw; apb = ba;
      bt.onclick = () => { CU.Sound.ui(); tsx = tsx === 1 ? 50 : tsx === 50 ? 500 : tsx === 500 ? 5000 : 1; setL(bt, '⏩ TEMPS ×' + tsx); }; bj.onclick = () => { CU.Sound.ui(); const d = 2e4 + Math.random() * 3e5, fx = -Math.sin(yaw) * Math.cos(pitch), fy = Math.sin(pitch), fz = Math.cos(yaw) * Math.cos(pitch); px += fx * d; py += fy * d; pz += fz * d; vel = 0; stopAp(); sel = null; vk = ''; fl = 0.9; shk = 10; say('🌀 Saut quantique : ' + Math.round(d / 1000) + ' ku franchis. Territoire inconnu.'); };
      bs.onclick = () => { CU.Sound.ui(); scan(); };
      ba.onclick = () => { CU.Sound.ui(); if (ap) stopAp(); else if (sel || lk) { tg = sel || lk; ap = true; ba.classList.add('on'); } else { scEl.textContent = 'Vise un astre pour t\'en approcher.'; scEl.style.display = 'block'; scT = tm; } };
      bg.onclick = () => { if (bb) return; if (cf > 0) { cf = 0; bg.classList.remove('warn'); setL(bg, '💥 BIG BANG'); const v = prompt('Graine de ton univers (mot ou nombre, vide = au hasard) :', ''); if (v !== null) startBB(v); } else { cf = 1; bg.classList.add('warn'); setL(bg, '⚠ CONFIRMER'); setTimeout(() => { cf = 0; bg.classList.remove('warn'); setL(bg, '💥 BIG BANG'); }, 3000); } };
      hold(bf, () => { brk = true; stopAp(); }, () => { brk = false; }); hold(bp, () => { thr = true; stopAp(); }, () => { thr = false; }); hold(bw, () => { warp = true; }, () => { warp = false; });
      M_.el('button', 'chip hm', '🌌', ui).onclick = () => { CU.Sound.ui(); M_.go('ex'); }; M_.el('button', 'chip hm hm2', '＋', ui).onclick = () => { zm = cl(zm * 1.5, 0.35, 8); }; M_.el('button', 'chip hm hm3', '－', ui).onclick = () => { zm = cl(zm / 1.5, 0.35, 8); };
      hg = M_.el('div', 'hg', null, ui); const HDC = ['#00f0ff', '#ff2bd6', '#ffd27a', '#6dff9c'], OPT = [['Coque', 'hu', HN], ['Couleur', 'co', ['Acier', 'Or', 'Émeraude', 'Améthyste', 'Rubis', 'Blanc']], ['Moteur', 'en', ['Bleu', 'Orange', 'Vert', 'Rose']], ['Traînée', 'tr', ['Oui', 'Non']], ['Étoiles', 'ds', ['Rares', 'Normal', 'Denses']], ['Trous noirs', 'bh', ['Rares', 'Normal', 'Nombreux']], ['Nébuleuses', 'nb', ['Rares', 'Normal', 'Nombreuses']], ['Interface', 'hd', ['Cyan', 'Rose', 'Or', 'Vert']]];
      const rend = () => { hg.innerHTML = ''; M_.el('b', '', '🚀 HANGAR · personnalise tout', hg); OPT.forEach(o => { const r = M_.el('div', 'r', null, hg); M_.el('span', '', o[0] + ' ', r); o[2].forEach((n, i) => { const b = M_.el('button', 'cp' + (cfg[o[1]] === i ? ' on' : ''), n, r); b.onclick = () => { cfg[o[1]] = i; ui.style.setProperty('--c', HDC[cfg.hd]); CU.Save.mark(); rend(); }; }); });
        const r = M_.el('div', 'r', null, hg); M_.el('button', 'cp', '✎ Nom : ' + cfg.nm, r).onclick = () => { const v = prompt('Nom du vaisseau :', cfg.nm); if (v) { cfg.nm = v.slice(0, 18); CU.Save.mark(); rend(); } }; M_.el('button', 'cp', '✕ Fermer', r).onclick = () => { hg.style.display = 'none'; }; };
      M_.el('button', 'chip hm hm4', '🚀', ui).onclick = () => { CU.Sound.ui(); rend(); hg.style.display = hg.style.display === 'block' ? 'none' : 'block'; }; ui.style.setProperty('--c', HDC[cfg.hd]);
      kd = e => { const d = e.type === 'keydown', k = e.key.toLowerCase(); if (k === ' ') warp = d; else if (k === 'w' || k === 'arrowup') { thr = d; if (d) stopAp(); } else if (k === 's' || k === 'arrowdown') brk = d; }; addEventListener('keydown', kd); addEventListener('keyup', kd);
      M_.gesture(c.cv, { down(x, y) { joy = { ox: x, oy: y, x, y, a: 1, on: 1, m: 0 }; }, move(x, y, dx, dy) { if (joy) { joy.x = x; joy.y = y; } if (ap && Math.abs(dx) + Math.abs(dy) > 1) stopAp(); yaw -= dx * 0.006; pitch = cl(pitch + dy * 0.006, -1.5, 1.5); }, up(x, y, tap) { if (joy) joy.on = 0; if (tap) pick(x, y); }, pinch(f) { zm = cl(zm * f, 0.35, 8); joy = null; } }); this.resize();
    },
    resize() { const s = CU.Modes.size; W = s.w; H = s.h; F = Math.min(W, H); },
    frame,
    close() { removeEventListener('keydown', kd); removeEventListener('keyup', kd); thr = brk = warp = ap = false; bb = null; const s = CU.Save.d; s.inf = { x: px, y: py, z: pz, yaw, pitch, g: gods.map(sv), kl: kill, md: mods, ag: age, cf: cfg, bc: bcs }; CU.Save.mark(); CU.Save.flush(); }
  });
})();
