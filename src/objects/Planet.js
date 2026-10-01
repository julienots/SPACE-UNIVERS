CU.Planet = class {
  constructor(s, x, y, r) {
    const { map: [W, H], n } = CU.CFG.planet;
    this.W = W; this.H = H; this.n = n; this.rot = 0; this.f = 0;
    this.buildMap(); this.buildDisc();
    this.tex = s.textures.createCanvas('planet', n, n);
    this.img = this.tex.context.createImageData(n, n);
    this.glow = s.add.image(x, y, 'glow').setTint(0x3ac8ff).setBlendMode(Phaser.BlendModes.ADD).setDisplaySize(r * 3.2, r * 3.2).setAlpha(0.85).setDepth(1);
    this.sprite = s.add.image(x, y, 'planet').setDisplaySize(r * 2, r * 2).setDepth(2);
    this.s = s; this.k = { sp: this.sprite.scaleX, g: this.glow.scaleX };
    this.pulse();
    this.render();
  }
  pulse() { this.glowTw = this.s.tweens.add({ targets: this.glow, alpha: 0.6, duration: 2600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' }); }
  // Masquée avant le Big Bang, puis se condense et apparaît en fondu
  hide() {
    if (this.glowTw) { this.glowTw.stop(); this.glowTw = null; }
    this.s.tweens.killTweensOf([this.sprite, this.glow]);
    this.sprite.setVisible(false); this.glow.setVisible(false);
  }
  reveal(ms) {
    const s = this.s, k = this.k;
    this.sprite.setVisible(true).setAlpha(0).setScale(k.sp * 0.25);
    this.glow.setVisible(true).setAlpha(0).setScale(k.g * 0.25);
    s.tweens.add({ targets: this.sprite, alpha: 1, scaleX: k.sp, scaleY: k.sp, duration: ms, ease: 'Cubic.easeOut' });
    s.tweens.add({ targets: this.glow, alpha: 0.85, scaleX: k.g, scaleY: k.g, duration: ms, ease: 'Cubic.easeOut',
      onComplete: () => { this.glow.setAlpha(0.85); this.pulse(); } });
  }
  // Carte équirectangulaire : océans, côtes, plaines, roches, glaces polaires
  buildMap() {
    const W = this.W, H = this.H, d = new Uint8ClampedArray(W * H * 4), o = new Uint8Array(W * H);
    for (let j = 0; j < H; j++) {
      const lat = (j / H - 0.5) * Math.PI, cy = Math.cos(lat), sy = Math.sin(lat);
      for (let i = 0; i < W; i++) {
        const lon = i / W * 6.2832, h = CU.fbm(Math.cos(lon) * cy * 2.4 + 9, sy * 2.4 + 9, Math.sin(lon) * cy * 2.4 + 9), k = j * W + i, p = k * 4;
        let c;
        if (Math.abs(sy) > 0.88 + (h - 0.5) * 0.1) c = [236, 246, 255];
        else if (h < 0.5) { o[k] = 1; const t = Math.max(0, 1 - (0.5 - h) * 5); c = [8 + 40 * t, 40 + 110 * t, 110 + 110 * t]; }
        else if (h < 0.53) c = [214, 200, 140];
        else if (h < 0.66) c = [40 + (h - 0.53) * 300, 130 - (h - 0.53) * 250, 70];
        else c = [110, 100, 95];
        d[p] = c[0]; d[p + 1] = c[1]; d[p + 2] = c[2]; d[p + 3] = 255;
      }
    }
    this.map = d; this.ocean = o;
  }
  // Pré-calcul du disque : longitude, ligne de carte, lumière, reflet d'atmosphère, bord lissé
  buildDisc() {
    const n = this.n, L = [-0.55, -0.4, 0.73];
    this.p = []; this.lon = []; this.row = []; this.row1 = []; this.wy = []; this.lit = []; this.rim = []; this.alp = [];
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      const dx = (x + 0.5) / n * 2 - 1, dy = (y + 0.5) / n * 2 - 1, d2 = dx * dx + dy * dy;
      if (d2 >= 1) continue;
      const z = Math.sqrt(1 - d2);
      this.p.push(y * n + x); this.lon.push(Math.atan2(dx, z));
      { const fy = (Math.asin(-dy) / Math.PI + 0.5) * (this.H - 1), y0 = Math.floor(fy); this.row.push(y0 * this.W); this.row1.push(Math.min(this.H - 1, y0 + 1) * this.W); this.wy.push(fy - y0); }
      this.lit.push(Math.max(0, dx * L[0] + dy * L[1] + z * L[2]));
      this.rim.push(Math.pow(1 - z, 3));
      this.alp.push(Math.min(1, (1 - Math.sqrt(d2)) * n * 0.5) * 255);
    }
  }
  render() {
    const q = this.map, W = this.W, o = this.ocean, a = this.img.data, T = 1 / 6.2832, N = this.p.length, R0 = this.row, R1 = this.row1, WY = this.wy;
    for (let k = 0; k < N; k++) {
      let u = ((this.lon[k] + this.rot) * T) % 1; if (u < 0) u += 1;
      const uf = u * W, x0 = uf | 0, wx = uf - x0, x1 = x0 + 1 >= W ? 0 : x0 + 1, wy = WY[k],
        a0 = (R0[k] + x0) * 4, a1 = (R0[k] + x1) * 4, a2 = (R1[k] + x0) * 4, a3 = (R1[k] + x1) * 4,
        w0 = (1 - wx) * (1 - wy), w1 = wx * (1 - wy), w2 = (1 - wx) * wy, w3 = wx * wy,
        cr = q[a0] * w0 + q[a1] * w1 + q[a2] * w2 + q[a3] * w3, cg = q[a0 + 1] * w0 + q[a1 + 1] * w1 + q[a2 + 1] * w2 + q[a3 + 1] * w3, cb = q[a0 + 2] * w0 + q[a1 + 2] * w1 + q[a2 + 2] * w2 + q[a3 + 2] * w3,
        li = this.lit[k], l = 0.1 + 0.9 * li, r = this.rim[k] * (0.3 + 0.7 * li), s = o[R0[k] + x0] ? Math.pow(li, 24) * 150 : 0, p = this.p[k] * 4;
      a[p] = cr * l + r * 30 + s; a[p + 1] = cg * l + r * 110 + s; a[p + 2] = cb * l + r * 255 + s; a[p + 3] = this.alp[k];
    }
    this.tex.context.putImageData(this.img, 0, 0); this.tex.refresh();
  }
  update(dt) { this.rot += dt * 1.2e-4; if (++this.f % (CU.mobile ? 3 : 2) === 0) this.render(); } // rendu 20-30 fps, rotation fluide
};
