CU.Hud = {
  init(s) {
    const $ = id => document.getElementById(id), c = s.cam, g = s.genesis;
    const SUB = {
      void: "Le néant… Appuie sur BIG BANG pour créer l'univers",
      charge: "L'énergie se concentre…",
      run: "Touche l'espace pour agir sur la matière",
      done: 'Glisse, pince pour zoomer · zoome à fond pour changer d\'échelle'
    };
    $('zin').onclick = () => c.zoom(1.3);
    $('zout').onclick = () => c.zoom(1 / 1.3);
    $('home').onclick = () => { c.reset(); s.cosmos.home(); };
    s.events.on('zoom', z => { $('zoom').textContent = '×' + z.toFixed(2); });
    // Cosmos : niveaux univers / galaxie / système / planète
    const chips = document.querySelectorAll('#lv button');
    chips.forEach(b => { b.onclick = () => s.cosmos.go(+b.dataset.l); });
    s.events.on('level', (l, txt) => { chips.forEach(b => b.classList.toggle('on', +b.dataset.l === l)); $('lvl').textContent = txt; });
    s.events.on('genesis', st => { if (st === 'done') s.cosmos.start(); else if (st === 'void') s.cosmos.reset(); });
    // Big Bang
    $('bang').onclick = () => g.start();
    $('fast').onclick = () => { $('fast').classList.toggle('on', g.toggleSpeed() > 1); };
    $('again').onclick = () => { $('fast').classList.remove('on'); g.reset(); };
    s.events.on('genesis', st => { document.body.dataset.g = st; $('sub').textContent = SUB[st]; });
    s.events.on('bang', () => { const f = $('flash'); f.classList.remove('go'); void f.offsetWidth; f.classList.add('go'); });
    s.events.on('stage', (i, st) => {
      $('sn').textContent = st.n; $('sd').textContent = st.d;
      const b = $('stage'); b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
    });
    s.events.on('progress', p => { $('prog').style.width = (p * 100).toFixed(1) + '%'; });
  }
};
