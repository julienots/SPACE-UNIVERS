CU.CameraController = class {
  constructor(s) {
    this.s = s; this.c = s.cameras.main; this.x = 0; this.y = 0; this.vx = 0; this.vy = 0; this.d0 = 0; this.z = CU.CFG.zoom.start;
    s.input.addPointer(1);
    s.input.on('pointerdown', () => { this.vx = this.vy = 0; });
    s.input.on('pointermove', p => {
      const i = s.input;
      if (!p.isDown || (i.pointer1.isDown && i.pointer2.isDown)) return;
      this.vx = -(p.x - p.prevPosition.x) / this.z; this.vy = -(p.y - p.prevPosition.y) / this.z;
      this.x += this.vx; this.y += this.vy;
    });
    s.input.on('wheel', (p, o, dx, dy) => this.zoom(dy > 0 ? 0.9 : 1.1));
  }
  zoom(f) {
    const { min, max } = CU.CFG.zoom;
    const raw = this.z * f, cs = this.s.cosmos;
    this.z = Phaser.Math.Clamp(raw, min, max);
    // Zoom au-delà des limites = changement d'échelle (univers ↔ galaxie ↔ système ↔ planète)
    if (cs && cs.on && !cs.busy && (raw > max || raw < min)) { this.ov = (this.ov || 0) + Math.log(f); if (Math.abs(this.ov) > 0.4) { const d = this.ov > 0 ? 1 : -1; this.ov = 0; cs.step(d); } } else this.ov = 0;
    this.s.events.emit('zoom', this.z);
  }
  reset() { this.x = this.y = this.vx = this.vy = 0; this.z = 1; this.s.events.emit('zoom', 1); }
  update() {
    const i = this.s.input, a = i.pointer1, b = i.pointer2, B = CU.CFG.bounds;
    if (a.isDown && b.isDown) {
      const d = Phaser.Math.Distance.Between(a.x, a.y, b.x, b.y);
      if (this.d0) this.zoom(d / this.d0);
      this.d0 = d;
    } else this.d0 = 0;
    this.ov = (this.ov || 0) * 0.96;
    if (!i.activePointer.isDown) { this.x += this.vx; this.y += this.vy; this.vx *= 0.92; this.vy *= 0.92; }
    this.x = Phaser.Math.Clamp(this.x, -B, B); this.y = Phaser.Math.Clamp(this.y, -B, B);
    this.c.setZoom(this.c.zoom + (this.z - this.c.zoom) * 0.2);
    this.c.centerOn(this.x, this.y);
  }
};
