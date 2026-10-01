window.CU = window.CU || {};
CU.mobile = /Android|iPhone|iPad|iPod|Mobi/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && Math.min(screen.width, screen.height) < 900);
CU.CFG = {
  bg: '#03000f',
  zoom: { min: 0.4, max: 3, start: 1 },
  bounds: 1600,
  planet: { r: 130, n: CU.mobile ? 320 : 448, map: CU.mobile ? [512, 256] : [768, 384] },
  colors: { cyan: 0x00f0ff, magenta: 0xff2bd6, violet: 0x7a3cff, blue: 0x2a6bff },
  // Big Bang : budget de particules (mobile = plus léger), proportions de matière, nombre de "graines" d'étoiles
  genesis: { poolMobile: 420, poolDesktop: 900, gasMobile: 0.07, gasDesktop: 0.11, starFrac: 0.09, seeds: 8, charge: 1.7 }
};
