// ===== EFFETS SONORES (v0.5) : 100 % synthétisés (WebAudio), aucun fichier. Voix limitées (pooling logique). =====
window.CU = window.CU || {};
CU.Sound = (function () {
  let ac = null, master = null, nbuf = null, voices = 0, amb = null;
  const MAXV = 8;
  function ctx() {
    if (!ac) {
      const A = window.AudioContext || window.webkitAudioContext; if (!A) return null;
      try { ac = new A(); master = ac.createGain(); master.gain.value = 0.5; master.connect(ac.destination); } catch (e) { ac = null; return null; }
    }
    if (ac.state === 'suspended') { try { ac.resume(); } catch (e) {} }
    return ac;
  }
  const on = () => CU.Save.d.sound;
  function voice(a, node, t, dur) { voices++; const done = () => { voices--; }; node.onended = done; node.start(t); node.stop(t + dur + 0.05); }
  function tone(f0, f1, dur, type, vol, delay) {
    if (!on() || voices >= MAXV) return; const a = ctx(); if (!a) return;
    const t = a.currentTime + (delay || 0), o = a.createOscillator(), g = a.createGain();
    o.type = type || 'sine'; o.frequency.setValueAtTime(f0, t); if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol || 0.2, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(master); voice(a, o, t, dur);
  }
  function noise(dur, vol, f0, f1) {
    if (!on() || voices >= MAXV) return; const a = ctx(); if (!a) return;
    if (!nbuf) { nbuf = a.createBuffer(1, a.sampleRate, a.sampleRate); const c = nbuf.getChannelData(0); for (let i = 0; i < c.length; i++) c[i] = Math.random() * 2 - 1; }
    const t = a.currentTime, s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
    s.buffer = nbuf; s.loop = true; f.type = 'lowpass'; f.frequency.setValueAtTime(f0, t); f.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.03); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(master); voice(a, s, t, dur);
  }
  const Z = {
    unlock() { ctx(); },
    tap() { tone(880, 1320, 0.09, 'sine', 0.12); },
    ui() { tone(520, 780, 0.07, 'triangle', 0.1); },
    deny() { tone(180, 120, 0.18, 'square', 0.08); },
    charge() { tone(50, 400, 1.7, 'sawtooth', 0.12); noise(1.7, 0.12, 200, 3000); },
    bang() { noise(2.6, 0.5, 6000, 80); tone(90, 28, 2.4, 'sine', 0.5); tone(1200, 200, 0.6, 'triangle', 0.12); },
    stage() { tone(440, 660, 0.35, 'sine', 0.12); tone(660, 990, 0.45, 'sine', 0.08, 0.1); },
    zoom() { noise(0.45, 0.14, 2500, 300); },
    create() { tone(330, 990, 0.3, 'sine', 0.15); tone(495, 1485, 0.4, 'triangle', 0.08, 0.08); },
    ambient(v) { // nappe grave continue (2 oscillateurs), démarrée/arrêtée à la demande
      const a = ctx(); if (!a) return;
      if (v && on() && !amb) {
        const g = a.createGain(), o1 = a.createOscillator(), o2 = a.createOscillator();
        g.gain.value = 0; g.gain.linearRampToValueAtTime(0.05, a.currentTime + 3);
        o1.frequency.value = 55; o2.frequency.value = 55.6; o1.connect(g); o2.connect(g); g.connect(master); o1.start(); o2.start(); amb = { g, o1, o2 };
      } else if (!v && amb) { const x = amb; amb = null; x.g.gain.linearRampToValueAtTime(0, a.currentTime + 1); x.o1.stop(a.currentTime + 1.1); x.o2.stop(a.currentTime + 1.1); }
    },
    toggle() { const d = CU.Save.d; d.sound = !d.sound; CU.Save.mark(); if (!d.sound) Z.ambient(false); else { Z.ambient(true); Z.ui(); } return d.sound; }
  };
  ['pointerdown', 'touchstart', 'keydown'].forEach(ev => addEventListener(ev, Z.unlock, { once: true, passive: true }));
  document.addEventListener('visibilitychange', () => { if (ac) { if (document.hidden) ac.suspend(); else ac.resume(); } });
  return Z;
})();
