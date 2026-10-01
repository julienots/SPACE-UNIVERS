CU.game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: CU.CFG.bg,
  banner: false,
  scale: { mode: Phaser.Scale.RESIZE, width: '100%', height: '100%' },
  render: { antialias: !CU.mobile, powerPreference: 'high-performance', batchSize: 2048 },
  fps: { target: 60, smoothStep: true },
  input: { activePointers: 2 },
  scene: [CU.BootScene, CU.UniverseScene]
});

// v0.6 : le jeu démarre directement dans l'espace 3D (monde ouvert) ; l'ancien écran Phaser reste en veille derrière.
(function () { const t = setInterval(() => { const sc = CU.game.scene && CU.game.scene.getScene('Universe'); if (sc && sc.cosmos && CU.game.loop) { clearInterval(t); document.body.classList.add('open'); CU.Modes.open('inf'); } }, 120); })();
