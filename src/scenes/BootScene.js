CU.BootScene = class extends Phaser.Scene {
  constructor() { super('Boot'); }
  create() {
    const dot = (k, w, soft) => {
      const t = this.textures.createCanvas(k, w, w), c = t.context, r = w / 2, g = c.createRadialGradient(r, r, 0, r, r, r);
      g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(soft, 'rgba(255,255,255,.35)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      c.fillStyle = g; c.fillRect(0, 0, w, w); t.refresh();
    };
    dot('s1', 4, 0.3); dot('s2', 8, 0.4); dot('s3', 20, 0.15); dot('glow', 256, 0.55); dot('neb', 256, 0.05);
    this.scene.start('Universe');
  }
};
