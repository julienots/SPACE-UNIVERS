// ===== QUALITÉ GRAPHIQUE ADAPTATIVE (v0.5) =====
// 4 paliers manuels (bas / moyen / haut / ultra) ; en mode auto, surveille le FPS entre bas et haut.
window.CU = window.CU || {};
CU.Q = (function () {
  // Ultra privilégie la netteté des planètes et des surfaces. Il reste manuel :
  // le mode adaptatif ne le sélectionne jamais afin de préserver les mobiles.
  const T = { low: { poolMul: 0.5, dpr: 1 }, med: { poolMul: 0.75, dpr: 1.05 }, high: { poolMul: 1, dpr: 1.25 }, ultra: { poolMul: 1.2, dpr: 1.55 } }, ORDER = ['low', 'med', 'high'];
  const Q = { tier: CU.mobile ? 'med' : 'high', poolMul: 1, dpr: 1.5, auto: true, fps: 60, listeners: [] };
  function apply(t) { const safe = T[t] ? t : (CU.mobile ? 'med' : 'high'); Q.tier = safe; Q.poolMul = T[safe].poolMul; Q.dpr = T[safe].dpr; Q.listeners.forEach(f => { try { f(Q); } catch (e) {} }); }
  Q.set = function (m) { // 'auto' | 'low' | 'med' | 'high' | 'ultra'
    const requested = m === 'auto' || T[m] ? m : 'auto';
    CU.Save.d.quality = requested; CU.Save.mark(); Q.auto = requested === 'auto';
    apply(requested === 'auto' ? (CU.mobile ? 'med' : 'high') : requested); bad = good = 0;
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
