CU.Background = class {
  // opt.hidden : le décor (nébuleuses, étoiles, poussières) attend d'être révélé par le Big Bang
  constructor(s, opt = {}) {
    const R = Phaser.Math.Between, F = Phaser.Math.FloatBetween, ADD = Phaser.BlendModes.ADD, C = CU.CFG.colors;
    this.s = s; this.neb = []; this.layers = [];
    [C.cyan, C.magenta, C.violet, C.blue, C.magenta].forEach((c, i) => {
      const o = s.add.image(R(-900, 900), R(-700, 700), 'neb').setTint(c).setAlpha(F(0.22, 0.4)).setScale(F(2.2, 3.6))
        .setScrollFactor(0.25 + i * 0.04).setBlendMode(ADD).setDepth(-20);
      this.neb.push({ o, a: o.alpha, on: true });
    });
    [['s1', 260, 0.1], ['s2', 110, 0.25], ['s3', 36, 0.5]].forEach(([k, n, f], i) => {
      const b = s.add.blitter(0, 0, k).setScrollFactor(f).setDepth(-10 + i);
      for (let j = 0; j < n; j++) b.create(R(-2200, 2200), R(-2200, 2200));
      const L = { b, dur: 1500 + i * 900, on: true, tw: null };
      this.layers.push(L); this.pulse(L);
    });
    this.dust = s.add.particles(0, 0, 's2', {
      x: { min: -1200, max: 1200 }, y: { min: -900, max: 900 }, lifespan: 6000, frequency: 120, maxAliveParticles: 70,
      speedX: { min: -8, max: 8 }, speedY: { min: -8, max: 8 }, scale: { start: 0.7, end: 0 }, alpha: { start: 0.8, end: 0 },
      tint: [C.cyan, C.magenta, 0xffffff], blendMode: 'ADD'
    }).setDepth(5);
    this.dustOn = true;
    if (opt.hidden) this.hide();
  }
  pulse(L) { L.tw = this.s.tweens.add({ targets: L.b, alpha: { from: 0.55, to: 1 }, duration: L.dur, yoyo: true, repeat: -1 }); }
  hide() {
    const s = this.s;
    this.neb.forEach(n => { s.tweens.killTweensOf(n.o); n.on = false; n.o.setVisible(false); });
    this.layers.forEach(L => { if (L.tw) { L.tw.stop(); L.tw = null; } s.tweens.killTweensOf(L.b); L.on = false; L.b.setVisible(false); });
    this.dust.stop(); if (this.dust.killAll) this.dust.killAll(); this.dust.setVisible(false); this.dustOn = false;
  }
  // what : 'neb' (nébuleuses) · 0/1/2 (couches d'étoiles) · 'dust' (particules flottantes)
  reveal(what, ms = 2000) {
    const s = this.s;
    if (what === 'neb') this.neb.forEach((n, i) => {
      if (n.on) return; n.on = true; n.o.setVisible(true).setAlpha(0);
      s.tweens.add({ targets: n.o, alpha: n.a, duration: ms, delay: i * ms * 0.1, ease: 'Sine.easeOut' });
    });
    else if (what === 'dust') { if (this.dustOn) return; this.dustOn = true; this.dust.setVisible(true); this.dust.start(); }
    else {
      const L = this.layers[what]; if (!L || L.on) return;
      L.on = true; L.b.setVisible(true).setAlpha(0);
      s.tweens.add({ targets: L.b, alpha: 0.55, duration: ms, onComplete: () => this.pulse(L) });
    }
  }
};
