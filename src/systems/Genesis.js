// BIG BANG — genèse de l'univers
// néant → charge → flash → énergie → particules → atomes → molécules → gaz → poussières → étoiles
// Un seul atlas de texture + un pool d'images recyclées (1 lot de rendu) : léger pour mobile.
(function () {
  const TAU = 6.2832;
  // début de chaque ère (secondes) ; S[7] = fin de la séquence
  const S = [0, 3.2, 6, 10, 14, 19, 23, 31.5];
  const W = S.map((t, k) => 0.85 * ((S[k + 1] || t) - t)); // fenêtre d'étalement des transitions par particule
  const FR = ['e', 'q', 'a', 'm', 'g', 'd', 's'];          // image de l'atlas par forme
  const FW = [64, 32, 64, 64, 128, 16, 96];                // largeur native
  const SZ = [16, 9, 30, 30, 170, 7, 26];                  // taille à l'écran (px monde)
  const AL = [1, 0.9, 0.9, 0.9, 0.17, 0.75, 1];
  const DR = [0.85, 0.7, 0.5, 0.42, 0.36, 0.4, 0.5];       // frottement par forme
  const PAL = [null,
    [0x00f0ff, 0x7a3cff, 0xff2bd6, 0xffffff],
    [0x9ff8ff, 0xffffff, 0x7fb8ff],
    [0xff7be9, 0x6fffe0, 0xb59bff],
    [0x2a6bff, 0x7a3cff, 0xff2bd6, 0x00c8ff],
    [0xffb070, 0xc9a2ff, 0x7fe9ff, 0xd8c0a0],
    [0xffffff, 0xbfe1ff, 0xfff0b0, 0xffc08a]];
  const HEAT = [[0, 0xffffff], [0.5, 0xfff0a0], [1.3, 0xffa030], [2.4, 0xff2bd6], [3.6, 0x7a3cff]];
  const ST = [
    { n: 'ÉNERGIE PURE', d: 'Le néant explose en lumière' },
    { n: 'PARTICULES', d: "L'énergie se fige en matière" },
    { n: 'ATOMES', d: "Les particules s'assemblent" },
    { n: 'MOLÉCULES', d: 'Les atomes se lient entre eux' },
    { n: 'GAZ', d: "Touche l'espace : la matière s'y rassemble" },
    { n: 'POUSSIÈRES', d: 'Les nuages se condensent en grains' },
    { n: 'PREMIÈRES ÉTOILES', d: "Touche l'espace pour allumer une étoile" },
    { n: "L'UNIVERS EST NÉ", d: 'Explore ta création' }
  ];
  const lerpC = (a, b, k) => {
    const ar = a >> 16 & 255, ag = a >> 8 & 255, ab = a & 255, br = b >> 16 & 255, bg = b >> 8 & 255, bb = b & 255;
    return (((ar + (br - ar) * k) | 0) << 16) | (((ag + (bg - ag) * k) | 0) << 8) | ((ab + (bb - ab) * k) | 0);
  };
  const heat = t => {
    for (let i = 1; i < HEAT.length; i++) if (t < HEAT[i][0]) return lerpC(HEAT[i - 1][1], HEAT[i][1], (t - HEAT[i - 1][0]) / (HEAT[i][0] - HEAT[i - 1][0]));
    return HEAT[HEAT.length - 1][1];
  };
  const vib = p => { try { if (navigator.vibrate) navigator.vibrate(p); } catch (e) { /* ignoré */ } };

  CU.Genesis = class {
    constructor(s) {
      const G = CU.CFG.genesis;
      this.s = s; this.state = 'void'; this.t = 0; this.c = 0; this.vt = 0; this.qa = 0; this.pa = 0;
      this.speed = 1; this.stage = -1; this.lit = 0; this.ri = 0; this.zt = null; this.fin = false; this.nextShake = 0;
      this.N0 = CU.mobile ? G.poolMobile : G.poolDesktop; this.N = Math.max(200, Math.round(this.N0 * (CU.Q ? CU.Q.poolMul : 1))); this.n = this.N;
      this.buildAtlas(); this.alloc(); this.buildFx();
      s.input.on('pointerup', p => {
        if ((this.state === 'run' || this.state === 'done') && p.getDistance() < 12 && p.getDuration() < 350) {
          const w = s.cameras.main.getWorldPoint(p.x, p.y); this.tap(w.x, w.y);
        }
      });
      this.idle();
    }

    // ---------- construction ----------
    buildAtlas() {
      const t = this.s.textures.createCanvas('cosmos', 640, 256), c = t.context;
      const rg = (x, y, r, st) => {
        const g = c.createRadialGradient(x, y, 0, x, y, r);
        st.forEach(([o, a]) => g.addColorStop(o, 'rgba(255,255,255,' + a + ')'));
        c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
      };
      const F = (n, x, y, w, h, fn) => { c.save(); c.translate(x, y); fn(); c.restore(); t.add(n, 0, x, y, w, h); };
      F('e', 0, 0, 64, 64, () => rg(32, 32, 32, [[0, 1], [0.2, 0.85], [0.45, 0.3], [1, 0]]));
      F('q', 68, 0, 32, 32, () => rg(16, 16, 16, [[0, 1], [0.3, 0.9], [1, 0]]));
      F('d', 104, 0, 16, 16, () => rg(8, 8, 8, [[0, 1], [0.4, 0.6], [1, 0]]));
      F('a', 124, 0, 64, 64, () => { // atome : noyau + 3 orbites + électrons
        rg(32, 32, 9, [[0, 1], [0.5, 0.9], [1, 0]]);
        c.lineWidth = 1.4; c.strokeStyle = 'rgba(255,255,255,.55)';
        for (let k = 0; k < 3; k++) {
          const th = k * 1.0472, ph = k * 2.1 + 0.6;
          c.beginPath(); c.ellipse(32, 32, 27, 10, th, 0, TAU); c.stroke();
          rg(32 + 27 * Math.cos(ph) * Math.cos(th) - 10 * Math.sin(ph) * Math.sin(th),
             32 + 27 * Math.cos(ph) * Math.sin(th) + 10 * Math.sin(ph) * Math.cos(th), 4.5, [[0, 1], [0.5, 0.8], [1, 0]]);
        }
      });
      F('m', 192, 0, 64, 64, () => { // molécule (forme d'eau)
        c.strokeStyle = 'rgba(255,255,255,.7)'; c.lineWidth = 3.5; c.lineCap = 'round';
        c.beginPath(); c.moveTo(14, 20); c.lineTo(32, 38); c.lineTo(50, 20); c.stroke();
        rg(32, 38, 11, [[0, 1], [0.6, 0.9], [1, 0]]); rg(14, 20, 7.5, [[0, 1], [0.6, 0.9], [1, 0]]); rg(50, 20, 7.5, [[0, 1], [0.6, 0.9], [1, 0]]);
      });
      F('s', 260, 0, 96, 96, () => { // étoile : cœur + halo + 4 branches
        rg(48, 48, 48, [[0, 1], [0.07, 1], [0.2, 0.5], [0.5, 0.12], [1, 0]]);
        for (let k = 0; k < 4; k++) {
          c.save(); c.translate(48, 48); c.rotate(k * Math.PI / 2);
          const g = c.createLinearGradient(0, 0, 46, 0); g.addColorStop(0, 'rgba(255,255,255,.9)'); g.addColorStop(1, 'rgba(255,255,255,0)');
          c.fillStyle = g; c.beginPath(); c.moveTo(0, -2); c.lineTo(46, 0); c.lineTo(0, 2); c.closePath(); c.fill(); c.restore();
        }
      });
      F('b', 0, 100, 128, 16, () => { // rayon d'énergie
        const g = c.createLinearGradient(0, 0, 128, 0); g.addColorStop(0, 'rgba(255,255,255,.95)'); g.addColorStop(1, 'rgba(255,255,255,0)');
        c.fillStyle = g; c.beginPath(); c.moveTo(0, 5); c.lineTo(128, 8); c.lineTo(0, 11); c.closePath(); c.fill();
      });
      F('r', 132, 100, 128, 128, () => { // onde de choc
        const g = c.createRadialGradient(64, 64, 44, 64, 64, 64);
        g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.55, 'rgba(255,255,255,.95)'); g.addColorStop(1, 'rgba(255,255,255,0)');
        c.fillStyle = g; c.beginPath(); c.arc(64, 64, 64, 0, TAU); c.fill();
      });
      [['g', 264], ['g2', 396]].forEach(([n, x]) => F(n, x, 100, 128, 128, () => { // nuage de gaz (2 variantes)
        for (let k = 0; k < 7; k++) rg(64 + (Math.random() - 0.5) * 28, 64 + (Math.random() - 0.5) * 28, 26 + Math.random() * 18, [[0, 0.26], [0.5, 0.12], [1, 0]]);
      }));
      t.refresh();
    }
    alloc() {
      const N = this.N, G = CU.CFG.genesis, gf = CU.mobile ? G.gasMobile : G.gasDesktop, mk = () => new Float32Array(N);
      this.x = mk(); this.y = mk(); this.vx = mk(); this.vy = mk(); this.ang = mk(); this.spin = mk(); this.sz = mk();
      this.off = mk(); this.pop = mk(); this.fa = mk(); this.r0 = mk(); this.a0 = mk();
      this.form = new Int8Array(N).fill(-1); this.fate = new Uint8Array(N); this.seed = new Uint8Array(N);
      this.dragF = new Float32Array(7); this.spr = [];
      for (let i = 0; i < N; i++) {
        const r = Math.random();
        this.fate[i] = r < gf ? 1 : r < gf + G.starFrac ? 2 : 0; // 1 = gaz, 2 = combustible d'étoile, 0 = poussière
        this.sz[i] = 0.7 + Math.random() * 0.7; this.off[i] = Math.random(); this.ang[i] = Math.random() * TAU;
        this.spin[i] = (Math.random() - 0.5) * 1.6; this.seed[i] = (Math.random() * G.seeds) | 0;
        this.spr.push(this.s.add.image(0, 0, 'cosmos', 'q').setBlendMode(Phaser.BlendModes.ADD).setDepth(7).setVisible(false));
      }
    }
    buildFx() {
      const s = this.s, ADD = Phaser.BlendModes.ADD, im = (f, d) => s.add.image(0, 0, 'cosmos', f).setBlendMode(ADD).setDepth(d).setVisible(false);
      this.core = im('e', 9); this.halo = im('e', 8);
      this.rings = []; for (let i = 0; i < 6; i++) this.rings.push(im('r', 10));
      this.beams = []; for (let i = 0; i < 12; i++) this.beams.push(im('b', 9).setOrigin(0, 0.5));
      this.seeds = [];
      for (let j = 0; j < CU.CFG.genesis.seeds; j++) {
        this.seeds.push({ x: 0, y: 0, ign: 0, lit: false, age: 0, glow: im('e', 6), core: im('s', 8) });
      }
      this.placeSeeds();
    }
    placeSeeds() {
      this.seeds.forEach(sd => {
        const a = Math.random() * TAU, r = 110 + 330 * Math.sqrt(Math.random());
        sd.x = Math.cos(a) * r; sd.y = Math.sin(a) * r; sd.lit = false; sd.age = 0; sd.glow.setVisible(false); sd.core.setVisible(false);
      });
    }

    // ---------- états ----------
    idle() {
      this.state = 'void'; this.vt = 0; this.fa.fill(0);
      this.core.setTint(0xffffff).setPosition(0, 0).setVisible(true); this.halo.setTint(0x7ad8ff).setPosition(0, 0).setVisible(true);
    }
    start() {
      if (this.state !== 'void') return;
      const n = this.n, TI = [0x7ad8ff, 0xffffff, 0xc79bff];
      this.state = 'charge'; this.c = 0; this.nextShake = 0;
      for (let i = 0; i < this.N; i++) {
        const sp = this.spr[i];
        if (i >= n) { sp.setVisible(false); continue; }
        this.a0[i] = Math.random() * TAU; this.r0[i] = 160 + 420 * Math.sqrt(Math.random()); this.form[i] = -2;
        sp.setFrame('q').setTint(TI[i % 3]).setVisible(true).setAlpha(0.3);
      }
      this.s.events.emit('genesis', 'charge');
      vib([30, 70, 40, 60, 50, 50, 60, 40, 70, 30, 80, 20, 90]);
    }
    bang() {
      const s = this.s, n = this.n;
      this.state = 'run'; this.t = 0; this.stage = -1; this.pa = 0; this.lit = 0;
      for (let i = 0; i < this.N; i++) {
        const sp = this.spr[i];
        if (i >= n) { sp.setVisible(false); continue; }
        const a = Math.random() * TAU, v = 120 + 1050 * Math.pow(Math.random(), 1.7);
        this.x[i] = this.y[i] = 0; this.vx[i] = Math.cos(a) * v; this.vy[i] = Math.sin(a) * v;
        this.form[i] = 0; this.fa[i] = 0; this.pop[i] = 1;
        sp.setFrame('e').setTint(0xffffff).setAlpha(1).setRotation(0).setPosition(0, 0).setVisible(true);
      }
      const K = this.seeds.length, step = (S[7] - S[6] - 3) / K;
      this.seeds.forEach((sd, j) => { sd.ign = S[6] + 0.4 + j * step; });
      // flash, onde de choc, rayons, cœur incandescent
      s.events.emit('bang');
      this.core.setVisible(true).setTint(0xffffff).setPosition(0, 0).setScale(0.6).setAlpha(1);
      this.halo.setVisible(true).setTint(0xffa040).setPosition(0, 0).setScale(1.2).setAlpha(0.9);
      s.tweens.killTweensOf([this.core, this.halo]);
      s.tweens.add({ targets: this.core, scale: 1100 / 64, alpha: 0, duration: 1700, ease: 'Expo.easeOut', onComplete: () => this.core.setVisible(false) });
      s.tweens.add({ targets: this.halo, scale: 1500 / 64, alpha: 0, duration: 3200, ease: 'Cubic.easeOut', onComplete: () => this.halo.setVisible(false) });
      this.ring(0, 0, 0xffffff, 2000, 1000); this.ring(0, 0, 0x7ad8ff, 1400, 1500); this.ring(0, 0, 0xff2bd6, 2600, 2100);
      const BT = [0x7ad8ff, 0xffe6a0, 0xff9ae8];
      this.beams.forEach((b, i) => {
        const L = 500 + Math.random() * 900;
        b.setPosition(0, 0).setRotation(Math.random() * TAU).setTint(BT[i % 3]).setVisible(true).setAlpha(0.95).setScale(0.2, 1.4 + Math.random() * 1.6);
        s.tweens.killTweensOf(b);
        s.tweens.add({ targets: b, scaleX: L / 128, alpha: 0, duration: 900 + Math.random() * 700, ease: 'Cubic.easeOut', onComplete: () => b.setVisible(false) });
      });
      s.cameras.main.shake(900, 0.018);
      s.cam.z = 2.2; this.zoomTo(0.8, 5000, 'Cubic.easeOut');
      vib(260);
      s.events.emit('genesis', 'run');
    }
    finish() {
      const s = this.s;
      this.state = 'done'; s.born = true; s.planet.reveal(3800);
      ['neb', 0, 1, 2, 'dust'].forEach(w => s.bg.reveal(w, 2500));
      this.zoomTo(1, 3200, 'Sine.easeInOut');
      s.events.emit('stage', 7, ST[7]); s.events.emit('genesis', 'done'); vib([40, 60, 40]);
    }
    reset() {
      if (this.state === 'charge' || this.state === 'void') return;
      const s = this.s;
      s.tweens.killTweensOf([this.core, this.halo].concat(this.rings, this.beams));
      this.spr.forEach(sp => sp.setVisible(false).setFrame('q').setRotation(0).setAlpha(1));
      this.form.fill(-1); this.fa.fill(0);
      this.rings.concat(this.beams).forEach(o => o.setVisible(false));
      this.placeSeeds(); this.n = this.N; this.speed = 1; this.stage = -1; this.t = 0; this.fin = false; this.lit = 0;
      s.bg.hide(); s.planet.hide(); s.born = false;
      this.zoomTo(1, 700, 'Sine.easeOut');
      this.idle(); s.events.emit('genesis', 'void');
    }
    toggleSpeed() { this.speed = this.speed > 1 ? 1 : 3; return this.speed; }
    zoomTo(z, ms, ease) {
      const s = this.s, o = { v: s.cam.z };
      if (this.zt) this.zt.stop();
      this.zt = s.tweens.add({ targets: o, v: z, duration: ms, ease, onUpdate: () => { s.cam.z = o.v; s.events.emit('zoom', o.v); } });
    }
    ring(x, y, col, size, ms) {
      const s = this.s, r = this.rings[this.ri++ % this.rings.length];
      s.tweens.killTweensOf(r);
      r.setPosition(x, y).setTint(col).setVisible(true).setAlpha(0.9).setScale(0.05);
      s.tweens.add({ targets: r, scale: size / 128, alpha: 0, duration: ms, ease: 'Cubic.easeOut', onComplete: () => r.setVisible(false) });
    }

    // ---------- interaction : le joueur attise la matière ----------
    tap(wx, wy) {
      const n = this.n, t = this.t;
      this.ring(wx, wy, t < S[4] ? 0xfff0a0 : 0xa8c8ff, 300, 700);
      vib(12);
      if (t < S[4]) { // matière encore chaude : onde qui repousse et réchauffe
        for (let i = 0; i < n; i++) {
          const dx = this.x[i] - wx, dy = this.y[i] - wy, d2 = dx * dx + dy * dy;
          if (d2 < 40000) { const d = Math.sqrt(d2) + 1, k = (1 - d / 200) * 300; this.vx[i] += dx / d * k; this.vy[i] += dy / d * k; this.pop[i] = 0.8; }
        }
        return;
      }
      // gaz/poussières : on déplace une graine d'étoile sous le doigt, la matière y afflue
      let best = null, bd = 1e12;
      this.seeds.forEach(sd => { if (sd.lit) return; const d = (sd.x - wx) * (sd.x - wx) + (sd.y - wy) * (sd.y - wy); if (d < bd) { bd = d; best = sd; } });
      if (!best) return;
      best.x = wx; best.y = wy; best.ign = Math.min(best.ign, t + 0.7);
      for (let i = 0; i < n; i++) {
        const dx = wx - this.x[i], dy = wy - this.y[i], d2 = dx * dx + dy * dy;
        if (d2 < 90000) { const d = Math.sqrt(d2) + 1; this.vx[i] += dx / d * 140; this.vy[i] += dy / d * 140; this.pop[i] = 0.6; }
      }
    }
    ignite(sd) {
      const s = this.s, warm = Math.random() < 0.5 ? 0xffc890 : 0xa8c8ff;
      sd.lit = true; sd.age = 0; sd.glow.setTint(warm); sd.core.setTint(warm === 0xffc890 ? 0xfff0d0 : 0xe0f0ff);
      this.ring(sd.x, sd.y, 0xfff0c0, 420, 900); vib(20);
      this.lit++;
      if (this.lit === 1) s.bg.reveal(0, 3000);
      else if (this.lit === 3) s.bg.reveal(1, 3000);
      else if (this.lit === 5) s.bg.reveal(2, 3000);
      else if (this.lit === 7) s.bg.reveal('dust');
    }

    // ---------- boucle ----------
    update(ms) {
      const dt = Math.min(ms, 50) / 1000;
      this.quality(ms);
      if (this.state === 'void') this.tickVoid(dt);
      else if (this.state === 'charge') this.tickCharge(dt);
      else this.tickRun(dt * this.speed);
    }
    capTo(n) { n = Math.max(200, n | 0); if (n < this.n) { this.n = n; for (let i = n; i < this.N; i++) if (this.spr && this.spr[i]) this.spr[i].setVisible(false); } }
    // Adaptation : si la machine peine, on réduit le nombre de particules actives
    quality(ms) {
      this.qa += ms; if (this.qa < 1500) return; this.qa = 0;
      if (this.state !== 'run' && this.state !== 'done') return;
      const fps = this.s.game.loop.actualFps;
      if (fps < 40 && this.n > 200) {
        this.n = Math.max(200, (this.n * 0.8) | 0);
        for (let i = this.n; i < this.N; i++) this.spr[i].setVisible(false);
      }
    }
    tickVoid(dt) { // le néant : une singularité qui pulse + mousse quantique
      this.vt += dt; const p = 0.5 + 0.5 * Math.sin(this.vt * 2.4), m = Math.min(24, this.n);
      this.core.setScale((10 + 6 * p) / 64).setAlpha(0.85);
      this.halo.setScale((70 + 34 * p) / 64).setAlpha(0.14 + 0.1 * p);
      for (let i = 0; i < m; i++) {
        const sp = this.spr[i];
        if (this.fa[i] <= 0) {
          if (Math.random() < 0.05) {
            const a = Math.random() * TAU, r = 30 + Math.random() * 150;
            sp.setFrame('q').setTint(i & 1 ? 0x7ad8ff : 0xc79bff).setPosition(Math.cos(a) * r, Math.sin(a) * r).setVisible(true); this.fa[i] = 1;
          }
        } else {
          this.fa[i] -= dt * 1.6;
          if (this.fa[i] <= 0) sp.setVisible(false);
          else sp.setAlpha(this.fa[i] * (Math.random() < 0.5 ? 0.7 : 0.4)).setScale((5 + 4 * Math.random()) / 32);
        }
      }
    }
    tickCharge(dt) { // la matière du vide est aspirée vers un point de plus en plus brillant
      const s = this.s, n = this.n;
      this.c = Math.min(1, this.c + dt / CU.CFG.genesis.charge);
      const c = this.c, e = c * c, k = 1 - Math.pow(c, 2.2), rot = e * 3.2, sc = (6 * (0.6 + 0.8 * c)) / 32;
      this.core.setScale((10 + 60 * e) / 64).setAlpha(1);
      this.halo.setScale((70 + 430 * e) / 64).setAlpha(0.14 + 0.6 * e);
      for (let i = 0; i < n; i++) {
        const sp = this.spr[i], a = this.a0[i] + rot, r = this.r0[i] * k;
        sp.x = Math.cos(a) * r; sp.y = Math.sin(a) * r; sp.setScale(sc * this.sz[i]); sp.alpha = 0.3 + 0.7 * c;
      }
      if (c >= this.nextShake) { s.cameras.main.shake(400, 0.002 + 0.007 * c); this.nextShake += 0.22; }
      s.cam.z = 1 + 0.5 * e; s.events.emit('zoom', s.cam.z);
      if (c >= 1) this.bang();
    }
    tickRun(dt) {
      const s = this.s, n = this.n, spr = this.spr, x = this.x, y = this.y, vx = this.vx, vy = this.vy, form = this.form, fate = this.fate;
      this.t += dt; const t = this.t;
      while (this.stage < 6 && t >= S[this.stage + 1]) { this.stage++; s.events.emit('stage', this.stage, ST[this.stage]); if (this.stage === 4) s.bg.reveal('neb', 9000); else if (this.stage > 0) vib(15); }
      if (!this.fin && t >= S[7]) { this.fin = true; this.finish(); }
      if ((this.pa += dt) > 0.25) { this.pa = 0; s.events.emit('progress', Math.min(1, t / S[7])); }
      for (let k = 0; k < 7; k++) this.dragF[k] = Math.exp(-DR[k] * dt);
      const hc = heat(t), ramp = Math.min(1, Math.max(0, (t - S[3]) / 10)), A = 26 * ramp, SW = 14 * ramp, seeds = this.seeds;
      for (let i = 0; i < n; i++) {
        let f = form[i];
        // transition de forme (étalée dans le temps → la matière apparaît progressivement)
        const K = f < 3 ? f + 1 : f === 3 ? (fate[i] === 1 ? 4 : 5) : (f === 5 && fate[i] === 2) ? 6 : -1;
        if (K >= 0 && t >= S[K] + this.off[i] * W[K]) { this.setForm(i, K); f = K; }
        const sp = spr[i], d = this.dragF[f]; let ax = vx[i] * d, ay = vy[i] * d, px = x[i], py = y[i];
        if (f >= 2) { // dérive organique + attraction vers les graines d'étoiles (filaments, amas)
          ax += Math.sin(t * 0.9 + i * 1.7) * 4 * dt; ay += Math.cos(t * 0.8 + i * 2.3) * 4 * dt;
          if (ramp > 0) {
            const sd = seeds[this.seed[i]], dx = sd.x - px, dy = sd.y - py, dd = Math.sqrt(dx * dx + dy * dy) + 1, a = A * Math.min(1, dd / 90), w = SW * Math.min(1, dd / 200);
            ax += (dx / dd * a - dy / dd * w) * dt; ay += (dy / dd * a + dx / dd * w) * dt;
          }
        }
        vx[i] = ax; vy[i] = ay; px += ax * dt; py += ay * dt; x[i] = px; y[i] = py;
        this.fa[i] += dt; const pop = this.pop[i]; if (pop > 0) this.pop[i] = pop - dt * 2.2;
        sp.x = px; sp.y = py;
        // rendu par forme
        let base = SZ[f] * this.sz[i] * (1 + 0.9 * Math.max(0, pop)), al = AL[f];
        if (f === 0) {
          const v = Math.sqrt(ax * ax + ay * ay);
          sp.rotation = Math.atan2(ay, ax); sp.setTint(hc); sp.setScale(base * (1 + Math.min(6, v / 140)) / 64, base / 64);
          sp.alpha = Math.min(1, Math.max(0.4, 1.2 - t * 0.2) + pop * 0.5); continue;
        }
        if (f === 1) al = 0.55 + 0.4 * Math.sin(t * 9 + i * 1.3);
        else if (f === 2 || f === 3) { al = 0.85 + 0.15 * Math.sin(t * 2 + i); sp.rotation = (this.ang[i] += this.spin[i] * dt); }
        else if (f === 4) { const g = Math.min(1, this.fa[i] / 3); base *= 0.35 + 0.65 * g * (2 - g); al = AL[4] * g * (0.85 + 0.3 * Math.sin(t * 0.6 + i)); sp.rotation = (this.ang[i] += this.spin[i] * 0.3 * dt); }
        else if (f === 5) al = 0.4 + 0.35 * Math.sin(t * 1.5 + i * 0.7);
        else { base *= Math.min(1, this.fa[i] / 1.2) * (1 + 0.12 * Math.sin(t * 5 + i)); al = 0.8 + 0.2 * Math.sin(t * 3 + i); }
        sp.setScale(base / FW[f]); sp.alpha = Math.min(1, al + Math.max(0, pop) * 0.5);
      }
      // graines : nuage qui s'alourdit, puis ignition d'une étoile
      for (let j = 0; j < seeds.length; j++) {
        const sd = seeds[j];
        if (!sd.lit && t >= sd.ign) this.ignite(sd);
        if (!sd.lit) { if (ramp > 0) sd.glow.setVisible(true).setPosition(sd.x, sd.y).setScale((110 + 70 * ramp) / 64).setAlpha(0.16 * ramp); continue; }
        sd.age += dt; const g = 1 - Math.exp(-sd.age * 1.8), pl = 1 + 0.08 * Math.sin(t * 4 + sd.x);
        sd.core.setVisible(true).setPosition(sd.x, sd.y).setScale(62 * g * pl / 96).setAlpha(Math.min(1, sd.age * 2));
        sd.glow.setPosition(sd.x, sd.y).setScale((60 + 230 * g) * pl / 64).setAlpha(0.32 * g + 0.05 * Math.sin(t * 3));
      }
    }
    setForm(i, K) {
      const sp = this.spr[i];
      this.form[i] = K; this.fa[i] = 0; this.pop[i] = 1;
      sp.setFrame(K === 4 ? (i & 1 ? 'g2' : 'g') : FR[K]);
      const P = PAL[K]; if (P) sp.setTint(P[(i * 7 + K * 3) % P.length]);
      sp.rotation = K >= 2 && K <= 4 ? this.ang[i] : 0;
    }
  };
})();
