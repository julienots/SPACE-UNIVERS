// ===== PANNEAUX HOLOGRAPHIQUES (v0.5) : Stats · Créer · Évolution · Réglages =====
window.CU = window.CU || {};
CU.Panels = {
  init(s) {
    const $ = id => document.getElementById(id), Sv = CU.Save, d = Sv.d, S = CU.Sound;
    const NAMES = { star: 'Étoile', galaxy: 'Galaxie', planet: 'Planète', life: 'Vie (ADN)', bh: 'Trou noir' };
    const COST = { star: [10, 5], planet: [15, 10], life: [40, 30], bh: [60, 80], galaxy: [100, 100] };
    const NEED = { planet: ['star', 1, 'une étoile'], life: ['planet', 1, 'une planète'], bh: ['star', 3, '3 étoiles'] };
    const UPC = k => Math.round(20 * Math.pow(1.6, d.up[k]));
    let tab = 'stats', open = false, running = false;
    const box = $('hp'), body = $('hpb'), toast = $('toast');
    const fmt = n => n >= 1000 ? (n / 1000).toFixed(1) + 'k' : String(Math.floor(n));
    const rate = () => ({ e: 1 + d.up.energy * 0.8 + d.made.star * 0.5, m: 0.5 + d.up.matter * 0.5 + d.made.galaxy });
    function say(t) { toast.textContent = t; toast.classList.remove('go'); void toast.offsetWidth; toast.classList.add('go'); }
    function el(tag, cls, html, p) { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; if (p) p.appendChild(e); return e; }
    function render() {
      body.innerHTML = '';
      document.querySelectorAll('#hpt button').forEach(b => b.classList.toggle('on', b.dataset.t === tab));
      const r = rate();
      if (tab === 'stats') {
        const age = d.t * 0.5; // 1 s de jeu = 0,5 Ma d'univers (échelle symbolique)
        [['Âge de l\'univers', age.toFixed(1) + ' Ma'], ['Énergie', fmt(d.res.energy) + '  (+' + r.e.toFixed(1) + '/s)'], ['Matière', fmt(d.res.matter) + '  (+' + r.m.toFixed(1) + '/s)'],
         ['Étoiles créées', d.made.star], ['Galaxies créées', d.made.galaxy], ['Planètes créées', d.made.planet], ['Formes de vie', d.made.life], ['Trous noirs', d.made.bh], ['Big Bangs', d.bangs],
         ['Qualité', CU.Q.tier + (CU.Q.auto ? ' (auto)' : '') + ' · ' + Math.round(CU.Q.fps) + ' fps']]
          .forEach(a => el('div', 'kv', '<span>' + a[0] + '</span><b>' + a[1] + '</b>', body));
      } else if (tab === 'create') {
        el('div', 'hint2', 'Dépense de l\'énergie et de la matière pour façonner ton univers.', body);
        Object.keys(COST).forEach(k => {
          const c = COST[k], n = NEED[k], lock = n && d.made[n[0]] < n[1], ok = !lock && d.res.energy >= c[0] && d.res.matter >= c[1];
          const b = el('button', 'it' + (ok ? '' : ' off'), '<b>' + NAMES[k] + '</b><span>' + (lock ? 'Requiert ' + n[2] : '⚡' + c[0] + '  ◈' + c[1]) + '</span><em>' + d.made[k] + '</em>', body);
          b.onclick = () => {
            if (!ok) { S.deny(); return; }
            d.res.energy -= c[0]; d.res.matter -= c[1]; d.made[k]++; Sv.mark(); S.create(); say('✦ ' + NAMES[k] + ' créé(e)');
            if ((k === 'star' || k === 'planet' || k === 'galaxy') && CU.Modes) { toggle(false); CU.Modes.open('ex'); } else if (k === 'life' && CU.Modes) { toggle(false); CU.Modes.open('life'); } else if (k === 'bh' && CU.Modes) { toggle(false); CU.Modes.open('bh'); } else render();
          };
        });
      } else if (tab === 'evo') {
        el('div', 'hint2', 'Améliore les lois de ton univers : production plus rapide.', body);
        [['energy', 'Rayonnement', 'Énergie +0,8/s'], ['matter', 'Gravité', 'Matière +0,5/s']].forEach(a => {
          const c = UPC(a[0]), ok = d.res.energy >= c;
          const b = el('button', 'it' + (ok ? '' : ' off'), '<b>' + a[1] + ' · niv. ' + d.up[a[0]] + '</b><span>' + a[2] + ' · ⚡' + c + '</span><em>▲</em>', body);
          b.onclick = () => { if (!ok) { S.deny(); return; } d.res.energy -= c; d.up[a[0]]++; Sv.mark(); S.create(); render(); };
        });
      } else {
        el('div', 'hint2', 'Réglages', body);
        const snd = el('button', 'it', '<b>Sons</b><span>Effets et ambiance</span><em>' + (d.sound ? 'ON' : 'OFF') + '</em>', body);
        snd.onclick = () => { S.toggle(); $('snd').textContent = d.sound ? '🔊' : '🔇'; render(); };
        [['auto', 'Auto'], ['low', 'Bas'], ['med', 'Moyen'], ['high', 'Haut'], ['ultra', 'Ultra']].forEach(a => {
          const b = el('button', 'it' + (d.quality === a[0] ? ' sel' : ''), '<b>Qualité · ' + a[1] + '</b><span>' + (a[0] === 'auto' ? 'S\'adapte au FPS' : a[0] === 'ultra' ? 'Textures 4K · relief fin · batterie élevée' : 'Particules ×' + ({ low: 0.5, med: 0.75, high: 1 })[a[0]]) + '</span><em>' + (d.quality === a[0] ? '●' : '○') + '</em>', body);
          b.onclick = () => { CU.Q.set(a[0]); S.ui(); render(); };
        });
        const rs = el('button', 'it off', '<b>Effacer la sauvegarde</b><span>Touche 2 fois pour confirmer</span><em>✕</em>', body); let arm = 0;
        rs.onclick = () => { if (!arm) { arm = 1; rs.classList.remove('off'); setTimeout(() => { arm = 0; rs.classList.add('off'); }, 3000); S.deny(); } else { Sv.reset(); S.ui(); render(); say('Sauvegarde effacée'); } };
      }
    }
    function toggle(v) { open = v == null ? !open : v; box.hidden = !open; if (open) { S.ui(); render(); } }
    $('m-panel').onclick = () => toggle();
    $('hpx').onclick = () => toggle(false);
    document.querySelectorAll('#hpt button').forEach(b => { b.onclick = () => { tab = b.dataset.t; S.ui(); render(); }; });
    $('snd').textContent = d.sound ? '🔊' : '🔇';
    $('snd').onclick = () => { S.toggle(); $('snd').textContent = d.sound ? '🔊' : '🔇'; if (open) render(); };
    // Production de ressources + temps d'univers (1 Hz, uniquement après le Big Bang et hors écran de mode)
    setInterval(() => {
      if (!running || document.hidden) return; const r = rate();
      d.res.energy = Math.min(9999, d.res.energy + r.e); d.res.matter = Math.min(9999, d.res.matter + r.m); d.t++; Sv.mark();
      if (open) { if (tab === 'stats') render(); }
      $('res').textContent = '⚡ ' + fmt(d.res.energy) + '   ◈ ' + fmt(d.res.matter);
    }, 1000);
    $('res').textContent = '⚡ ' + fmt(d.res.energy) + '   ◈ ' + fmt(d.res.matter);
    // Sons liés aux événements du jeu
    s.events.on('genesis', st => {
      if (st === 'charge') { S.charge(); d.bangs++; Sv.mark(); }
      running = st === 'run' || st === 'done';
      S.ambient(running);
      if (st === 'void') { running = false; }
    });
    s.events.on('bang', () => S.bang());
    s.events.on('stage', () => S.stage());
    s.events.on('level', () => S.zoom());
    // Qualité : réduit en direct les particules actives de la genèse (l'augmentation s'applique au prochain Big Bang)
    CU.Q.listeners.push(q => { const g = s.genesis; if (g && g.capTo) g.capTo(Math.round(g.N0 * q.poolMul)); });
    document.addEventListener('pointerdown', e => { if (e.target.closest && e.target.closest('button') && !e.target.closest('#hp')) S.tap(); }, true);
  }
};
