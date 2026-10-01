CU.UniverseScene = class extends Phaser.Scene {
  constructor() { super('Universe'); }
  create() {
    this.cameras.main.setBackgroundColor(CU.CFG.bg);
    // Avant le Big Bang : le néant. Décor et planète existent mais attendent d'être révélés par la genèse.
    this.bg = new CU.Background(this, { hidden: true });
    this.planet = new CU.Planet(this, 0, 0, CU.CFG.planet.r);
    this.planet.hide(); this.born = false;
    this.genesis = new CU.Genesis(this);
    this.cam = new CU.CameraController(this);
    this.cosmos = new CU.Cosmos(this);
    CU.Hud.init(this);
    CU.Panels.init(this);
    this.events.emit('genesis', 'void');
  }
  update(t, dt) { this.genesis.update(dt); if (this.born && this.cosmos.homeVisible) this.planet.update(dt); this.cosmos.update(dt); this.cam.update(); }
};
