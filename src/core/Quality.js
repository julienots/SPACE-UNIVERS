// ===== QUALITÉ GRAPHIQUE ADAPTATIVE (v0.5) =====
// 3 paliers (bas / moyen / haut) ; en mode auto, surveille le FPS et descend (ou remonte) d'un palier.
window.CU = window.CU || {};
CU.Q = (function () {
  const T = { low: { poolMul: 0.5, dpr: 1 }, med: { poolMul: 0.75, dpr: 1.05 }, high: { poolMul: 1, dpr: 1.25 } }, ORDER = ['low', 'med', 'high'];
  const Q = { tier: CU.mobile ? 'med' : 'high', poolMul: 1, dpr: 1.5, auto: true, fps: 60, listeners: [] };
  function apply(t) { Q.tier = t; Q.poolMul = T[t].poolMul; Q.dpr = T[t].dpr; Q.listeners.forEach(f => { try { f(Q); } catch (e) {} }); }
  Q.set = function (m) { // 'auto' | 'low' | 'med' | 'high'
    CU.Save.d.quality = m; CU.Save.mark(); Q.auto = m === 'auto';
    apply(m === 'auto' ? (CU.mobile ? 'med' : 'high') : m); bad = good = 0;
  };
  let bad = 0, good = 0;
  setInterval(function () {
    if (!Q.auto || document.hidden || !CU.game || !CU.game.loop) return;
    const m = document.getElementById('mode'); if (m && !m.hidden) return; // boucle Phaser en veille
    const f = Q.fps = CU.game.loop.actualFps || 60, i = ORDER.indexOf(Q.tier);
    if (f < 38) { good = 0; if (++bad >= 2 && i > 0) { bad = 0; apply(ORDER[i - 1]); } }
    else if (f > 57) { bad = 0; if (++good >= 6 && i < ORDER.length - 1) { good = 0; apply(ORDER[i + 1]); } }
    else bad = good = 0;
  }, 2000);
  Q.set(CU.Save.d.quality || 'auto');
  return Q;
})();
