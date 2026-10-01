// ===== SAUVEGARDE LOCALE (v0.5) : localStorage, écriture différée (pas de I/O dans la boucle de jeu) =====
window.CU = window.CU || {};
CU.Save = (function () {
  const K = 'cu_save_v5';
  const def = () => ({ v: 5, sound: true, quality: 'auto', res: { energy: 50, matter: 20 }, up: { energy: 0, matter: 0 },
    made: { star: 0, galaxy: 0, planet: 0, life: 0, bh: 0 }, t: 0, bangs: 0 });
  const d = def(); let dirty = false;
  try {
    const s = JSON.parse(localStorage.getItem(K) || 'null');
    if (s && s.v === 5) { Object.assign(d, s); ['res', 'up', 'made'].forEach(k => { d[k] = Object.assign(def()[k], s[k]); }); }
  } catch (e) { /* sauvegarde illisible : on repart de zéro */ }
  const S = {
    d,
    mark() { dirty = true; },
    flush() { if (!dirty) return; dirty = false; try { localStorage.setItem(K, JSON.stringify(d)); } catch (e) { /* quota / mode privé */ } },
    reset() { delete d.seed; delete d.ex; Object.assign(d, def()); dirty = true; S.flush(); }
  };
  setInterval(S.flush, 5000);
  addEventListener('pagehide', S.flush);
  document.addEventListener('visibilitychange', () => { if (document.hidden) S.flush(); });
  return S;
})();
