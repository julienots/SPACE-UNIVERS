# Créateur d'univers — v0.8 (VOYAGE INFINI · VITESSE LUMIÈRE)

## v0.25 — vaisseaux détaillés + âge de l'univers
- **Compteur d'âge** : en haut, le nombre d'années exact de l'univers (ex. 13 800 000 000 ans) + l'ère en cours ; il monte avec ⏩ TEMPS.
- **Vaisseaux refaits** (≈270–440 polygones chacun) : fuselages loftés, verrière brillante, ailes à bords d'attaque, missiles, dérives, hublots, nacelles, dôme + anneau de feux pour la soucoupe.
- **Rendu** : éclairage clé + spéculaire + reflet des moteurs, liserés d'accent, réacteurs avec cœur blanc/étoile de diffraction qui vacillent, feux de navigation clignotants.
- **Non testé** : rendu réel et FPS sur téléphone (syntaxe + génération des maillages seulement).

## v0.22 — monde complet
- **Trous de ver** : sphères de verre iridescentes (~30 % des cubes de 3000 u) ; les traverser téléporte à 30–250 ku, et une porte de retour s'ouvre à l'arrivée. Visibles au radar (cyan) et au SCAN.
- **Vaisseau 3D** : maillage 3D réel (chasseur, navette, soucoupe), faces triées et ombrées, s'incline dans les virages, réacteurs lumineux ; couleur/coque/moteur via 🚀 Hangar.
- **Coordonnées & repères** : radar vu de dessus (cap en haut) en haut à gauche avec X/Y/Z en ku ; 📍 REPÈRE pose une balise (12 max, sauvegardées, sélectionnables en touchant le radar, visibles en 3D avec distance).
- **Atterrir sur les planètes** : 🪂 ATTERRIR (planète touchée) → approche auto puis entrée dans l'atmosphère (flamme de rentrée) et vol 3D au-dessus d'une surface procédurale (océans/îles, dunes, glace, lave, nuages de gaz), brume, soleil, étoiles en altitude. POUSSER avance, FREIN stoppe, ⚡ turbo, incliner le regard monte/descend ; 🚀 DÉCOLLER (ou monter > 1500 m) ramène en orbite.
- **Non testé** : rien n'a été lancé (syntaxe seulement) : FPS surface, tailles à l'écran.

## v0.21 — vaisseau + personnalisation
- **Ton vaisseau** (bas de l'écran) : 3 coques (Chasseur, Navette, Soucoupe), s'incline dans les virages, flammes selon la poussée / le warp, traînée lumineuse, nom affiché. Les lasers de ☄ DÉTRUIRE partent maintenant de ses ailes.
- **🚀 Hangar** (bouton en haut à droite) : coque, couleur (6), moteur (4), traînée, nom, interface (4 couleurs), et réglages d'univers : densité d'étoiles/planètes, de trous noirs, de nébuleuses (rares / normal / denses). Tout est sauvegardé. Les astres créés en dieu ne sont jamais masqués par ces réglages.
- **Poussière interstellaire** : traînées radiales quand tu avances (sensation de vitesse même dans le vide).
- **Non testé** : rendu réel, FPS Android, placement du vaisseau sur ton écran.

## v0.20 — réalisme
- **Supernovas naturelles** : une géante bleue meurt 60–200 Ma après sa naissance, explose en supernova (ses planètes disparaissent) et laisse un trou noir. Seulement quand le temps avance via ⏩ TEMPS (pas dans un univers déjà mûr au chargement).
- **Atmosphères** : halo coloré autour des planètes selon leur type (bleu océan, ocre désert, glace, lave, gaz).
- **Voie lactée** : bulbe galactique chaud + bandes de poussière sombres qui masquent les étoiles.
- **Non testé** : rendu réel, FPS Android.

## v0.19
- **Univers personnalisé** : 💥 BIG BANG demande une graine (mot ou nombre) ; même graine = même univers, partageable. Le numéro s'affiche au Big Bang.
- **🌀 SAUT** : saut quantique de 20 à 320 ku dans la direction du regard (l'univers est procédural et sans limite) ; les mondes créés en dieu restent là où tu les as posés.
- **Big Bang plus stylé** : singularité aveuglante avec flares en croix, 3 ondes de choc sphériques, matière en traînées de vitesse (plus longues au début) avec cœur bleu-blanc, secousse d'écran.
- **Réalisme** : jets relativistes aux pôles des trous noirs, flare anamorphique des étoiles quand tu les regardes de face.
- **Non testé** : rendu réel, FPS Android.

## v0.18 — Big Bang jouable + vraies nébuleuses
- **Big Bang en 3D réel** : plus de cinématique bloquante. La singularité est un point lumineux à 600 u devant toi ; boule de plasma qui se dilate (front dense + matière), couleur qui refroidit blanc → orange → rouge, légendes à chaque phase (singularité, inflation, nucléosynthèse, recombinaison, âges sombres). Tu voles librement, tu peux la traverser, et ⏩ TEMPS fait avancer l'âge pendant ce temps. La boule se dissipe en 60 s réelles.
- **Nébuleuses** : textures de gaz fractales (bruit fbm déformé, deux teintes, filaments chauds) en 3 couches, étoiles embarquées ; plus de croix de poussière. Même textures pour les nébuleuses du ciel.
- **Non testé** : rendu réel, FPS Android, temps de génération des textures au chargement (4 × 128 px).

## v0.17 — systèmes propres + orbites
- **Orbites affichées** (cercles fins bleus, doré pour la planète sélectionnée) autour de chaque étoile à planètes.
- **Systèmes propres** : orbites espacées de façon croissante (plus de chevauchements), quasi coplanaires (±3°), ceinture d'astéroïdes juste après la dernière planète.
- **Planète posée par le dieu** : après ~6 s elle est capturée par l'étoile la plus proche (≤ 3000 u), message à l'écran, et rejoint une orbite stable en douceur. Sans étoile à portée, elle reste errante.
- **Plus aucune attraction** sur le vaisseau (trous noirs compris) ; seul le franchissement de l'horizon reste fatal.
- **Non testé** : rendu réel, FPS Android.

## v0.16 — création de l'univers en direct
- 💥 BIG BANG remet l'âge de l'univers à ~100 ans : plasma incandescent qui refroidit (blanc → orange → rouge), puis âges sombres, puis les astres naissent un par un (étoiles dès 200 Ma avec flash d'allumage, trous noirs précoces, nébuleuses, galaxies du ciel, systèmes planétaires, monde natal vers 9 Ga).
- Le temps ne s'écoule QUE par ⏩ TEMPS (×50 / ×500 / ×5000 ; la 1re étape est exponentielle pour voir les débuts) ; retour à ×1 = pause. Navigation libre pendant ce temps. L'âge et l'ère s'affichent dans l'en-tête, avec un message à chaque nouvelle ère. Sauvegardé.
- Les astres créés par le dieu apparaissent tout de suite, quel que soit l'âge.
- **Non testé** : rendu réel, FPS Android, rythme des ères.

## v0.15
- **Zoom** : pincer / molette / boutons ＋ － (×0.35 à ×8), affiché dans l'en-tête.
- **☄ DÉTRUIRE** : les deux canons chargent puis tirent un laser sur la cible (étincelles à l'impact), puis explosion : onde de choc, débris, secousse d'écran ; une étoile finit en supernova (double onde, plus longue).
- **Ceintures d'astéroïdes** en orbite autour des étoiles à planètes ; **16 galaxies lointaines** (spirales et elliptiques) dans le ciel.
- **Non testé** : rendu réel, FPS Android.

## v0.14
- **Plus de dérive** : le vaisseau s'arrête en ~1 s après avoir relâché POUSSER ; la gravité des trous noirs n'agit que dans une zone de 9 rayons d'horizon (avant, elle t'attirait depuis très loin).
- **Soleils** : disque assombri au bord, taches, protubérances animées, spicules de diffraction, couronne.
- **Planètes** : la face éclairée est tournée vers leur étoile.
- **Nébuleuses** : 8 lobes colorés, filaments de poussière, étoiles naissantes ; 9 % des cellules (avant 5,5 %).
- **Non testé** : rendu réel, FPS Android.

## v0.13
- Repère joystick : un cercle avec croix et une boule lumineuse apparaissent là où tu poses le doigt dès que tu glisses pour regarder, suivent le doigt (boule bornée au cercle), puis s'estompent au relâchement. Un simple toucher (sélection d'astre) ne l'affiche pas.

## v0.12 — interface propre, ciel, trous noirs
- Boutons rangés en colonnes latérales (gauche : pouvoirs de dieu ; droite : scan, approche, natal, temps, big bang), icônes + petits libellés ; en bas seulement FREIN / POUSSER / LUMIÈRE.
- Ciel : bande de Voie lactée (800 étoiles lointaines + 18 nébuleuses colorées), fixe à l'infini, tourne avec le regard.
- Trous noirs 3× plus fréquents et plus gros : gravité newtonienne (g affiché), ils ne ralentissent plus le vaisseau, horizon des événements fatal (spaghettification → retour au monde natal), lentille gravitationnelle sur les étoiles, anneau de photons, disque d'accrétion avec effet Doppler, arche lentillée, temps ralenti et vignette rouge près du trou. Échappatoire : ⚡ LUMIÈRE.
- **Non testé** : rendu réel, FPS Android, équilibrage de la gravité.

## v0.11 — mode DIEU + navigation
- **Pouvoirs** : ✨ créer étoile / planète / trou noir devant toi, ☄ anéantir l'astre sélectionné (les planètes d'une étoile détruite disparaissent avec elle), 🔄 transformer (type de planète, couleur d'étoile). Tout est sauvegardé ; le Big Bang remet l'univers à zéro.
- **Navigation** : toucher un astre le sélectionne (cadre doré, nom, distance ; flèche au bord de l'écran s'il est hors champ). 🎯 APPROCHE y va seul, en vitesse lumière au-delà de 4000 u puis freinage. ⌂ MONDE NATAL = retour en un geste. Le SCAN et les pouvoirs agissent sur la sélection (ou le viseur).
- **Non testé** : rendu réel, FPS Android.

## v0.10 — systèmes stellaires réels
- Chaque étoile a 2–5 planètes en orbite (vraies orbites inclinées, périodes de Kepler) : brûlantes près de l'étoile, zone océanique au milieu, glacées/géantes au loin. Les planètes bougent vraiment ; le bouton ⏩ TEMPS (×1/×50/×500/×5000) accélère les orbites. Le SCAN donne l'étoile mère, l'orbite en UA et la durée de l'année.
- **Non testé** : rendu réel et FPS. Éclairage des planètes encore fixe (pas orienté vers l'étoile).

## v0.9 — monde ouvert : plus rien n'avance tout seul
- Le vaisseau est à l'arrêt : ▲ POUSSER (maintenir) = accélérer, ■ FREIN, ⚡ LUMIÈRE (maintenir) = warp. Clavier : W/S, Espace.
- 🔭 SCAN (fiche de l'astre visé : classe, température, rayon, gravité, atmosphère, lunes, distance en secondes-lumière), 🎯 APPROCHE (pilote auto vers l'astre visé, annulé par glisser/poussée/frein), 💥 BIG BANG (confirmation, séquence singularité → flash → inflation → noyaux → atomes → étoiles, puis nouvel univers).
- Lunes en orbite autour des planètes. Aucun menu.
- **Non testé** : rendu réel et FPS sur Android.

## v0.8 — changements
- **Nouveau mode de départ `Infini.js`** : espace sans fin généré à la volée (cellules de 900 u déterministes par graine, seul l'entourage est en mémoire). Étoiles 15 %, planètes 16 %, nébuleuses 5,5 %, trous noirs 1,5 % des cellules → de temps à autre, jamais deux fois pareil, position sauvegardée.
- **Commandes** : le vaisseau avance toujours ; glisser = diriger ; bouton ⚡ VITESSE LUMIÈRE (ou Espace) = warp (traînées d'étoiles, champ élargi, 150 u/s → 4500 u/s = 1 c). Freinage automatique près des astres, on ne les traverse pas. Viseur + nom/distance de l'astre visé.
- 🌌 = mode « Échelles » (univers → galaxie → système → planète), ∞ = retour au voyage infini.
- **Correctif v0.7** : l'init du bruit dans Explore3D appelait `CU.rng` au chargement, avant que Cosmos.js le définisse (le mode Échelles ne se chargeait pas dans la vraie page). Init désormais différée.
- Testé : chargement avec l'ordre réel des scripts (modes tl/bh/life/ex/inf enregistrés), 120 images en croisière + 3000 en warp, sauvegarde, réouverture, mode Échelles. **Non testé** : rendu visuel réel du voyage, FPS Android, sensation de vitesse.


## v0.7 — changements (Explore3D.js)
- **Navigation** : 1 seul bouton (▲ AVANCER, à maintenir) + glisser pour regarder. **Toucher un astre = pilotage automatique** (le vaisseau se tourne et y va). Vitesse automatique selon la distance (ralentit près des astres, pas de dépassement). ⬆ = remonter d'une échelle, ⌂ = monde natal. Clavier : W/S, Maj. Glisser annule le pilote auto.
- **Planètes** : relief fractal 3D sans couture (océans, continents, neige, glaces, lave, bandes gazeuses), sphère rendue pixel par pixel : éclairage par l'étoile, terminateur doux, reflet sur l'océan, atmosphère, nuages indépendants, lumières de ville côté nuit (mondes habités). Rendu mis en cache tant que la vue bouge peu ; résolution plafonnée (112 px mobile / 160 desktop, agrandie et lissée).
- **Étoiles** : halo, rayons animés, disque dégradé. **Galaxies** : sprite 256 px (4500 étoiles, régions roses, cœur lumineux) + 46 nébuleuses colorées le long des bras en vue Galaxie.
- Testé : syntaxe ; simulation headless (vol, tap → pilote auto jusqu'au niveau Planète, recul/remontée, sauvegarde) ; rendu réel de 3 planètes exporté en image et contrôlé. Mesures Node (PC) : texture ≈ 170–200 ms la 1re fois, rendu ≈ 0–17 ms/image. **Non testé** : FPS et ressenti sur Android, rendu visuel des étoiles/galaxies/nébuleuses.


## v0.6 — changements
- Le jeu démarre directement dans l'espace 3D (`Explore3D.js`) : plus de menus à traverser. Interface réduite à : titre + indice, ◀◀ / ▲ AVANCER / ⚡ (maintenir), ⌂ (retour au monde natal).
- **Vol libre** : glisser = regarder, maintenir ▲ = avancer dans la direction du regard, ⚡ = turbo, ◀◀ = reculer, pincer/molette = vitesse. Clavier : W/S (ou ↑/↓), Maj = turbo.
- **Échelles sans menu** : s'approcher d'une galaxie / étoile / planète y entre (fondu + flash), s'éloigner remonte d'un niveau. Toucher un objet y plonge aussi. Viseur central + nom/distance de la cible.
- Les anciens menus (☰ Créer/Évolution, Timeline, Trous noirs, Vie, BIG BANG) sont masqués en mode monde ouvert mais le code est conservé (retirer la classe `open` du `<body>` dans `main.js` pour les retrouver).
- Testé : syntaxe + simulation headless (canvas simulé) : vol, plongées par toucher, recul/remontée, sauvegarde. **Non testé** : rendu visuel réel, ressenti des commandes et FPS sur Android.


Jeu mobile HTML5 (Phaser 3.80) : tu es un dieu qui crée son univers.

## Lancer
Connexion internet requise (Phaser chargé depuis cdnjs). Ouvre `index.html`, ou sers le dossier : `npx serve .`

## Structure
- `src/config.js` : constantes (budget de particules mobile/desktop) · `src/utils/noise.js` : bruit procédural
- `src/scenes/` : Boot (textures), Universe (scène principale)
- `src/systems/` : Background (étoiles, nébuleuses, particules), CameraController (glisser + pincer), **Genesis (BIG BANG)**
- `src/objects/Planet.js` : planète pseudo-3D · `src/ui/Hud.js` : interface

## Fait
- v0.1 : interface tactile néon, étoiles en parallaxe, nébuleuses, caméra (glisser/pincer/zoom), planète pseudo-3D
- v0.2 : **bouton BIG BANG**. Néant (singularité qui pulse + mousse quantique) → charge (matière aspirée, tremblement, vibration) → flash blanc → explosion (ondes de choc, rayons, traînées d'énergie, zoom d'expansion)
- Séquence de ~31 s : énergie → particules → atomes → molécules → gaz → poussières → premières étoiles ; la matière apparaît progressivement (transitions étalées par particule)
- Interaction : toucher l'espace repousse l'énergie (avant le gaz), puis fait affluer la matière et allume une étoile sous le doigt
- Décor et planète existants révélés en fondu pendant/après la genèse ; boutons ⏩ (x3) et ↺ (nouvel univers)
- Mobile : 1 seul atlas de texture + pool d'images recyclées (420 sur mobile, 900 sur desktop), régulation automatique si le FPS chute

- v0.3 (étape 1) : **Cosmos** (`src/systems/Cosmos.js`) — 4 échelles : univers → galaxie → système solaire → planète
  - Univers : 7–9 galaxies procédurales (spirales 2–4 bras, elliptiques), inclinées, en rotation
  - Galaxie : spirale ~3 000–6 500 étoiles, 2 couches en rotation différentielle, 12 systèmes stellaires touchables
  - Système : étoile (6 classes), 3–6 planètes en orbite, orbites elliptiques, lunes
  - Planète : océans, continents, calottes, nuages indépendants, atmosphère, reflet spéculaire, éclairage selon l'étoile, anneaux, lunes ; types océanique / désertique / glacé / volcanique / géante gazeuse
  - Navigation : toucher un objet pour plonger, zoomer à fond (pincer/molette/+) pour descendre, dézoomer à fond pour remonter, puces Univers/Galaxie/Système/Planète, ◎ = retour à la planète natale
  - Planète natale (existante) conservée : c'est le « Monde natal » du système Héliora, galaxie ▼

## v0.4 — nouveautés (étape 1)
Trois boutons à gauche de l'écran (⏳ ⚫ 🧬) ouvrent des écrans plein écran (`src/modes/`). La boucle Phaser est mise en veille pendant ces écrans (batterie). Tout l'existant est conservé.

- **⏳ Timeline** (`Timeline.js`) : frise glissable Big Bang → matière → étoiles → galaxies → planètes → vie, animation qui évolue en continu (explosion → atomes → étoiles qui s'allument → spirale galactique → système planétaire → étincelles de vie), lecture auto ▶, liens vers Trous noirs et Vie.
- **⚫ Trous noirs** (`BlackHole.js`) : fond étoilé déformé par lentille gravitationnelle, ombre + anneau de photons, disque d'accrétion (~1100 particules, couleur par température, effet Doppler), image déformée du disque lointain (l'arche au-dessus du trou), gravité simulée, objets lancés au toucher (astéroïde / planète / étoile ; plonger ou orbiter), étirement + décalage vers le rouge + ralentissement du temps près de l'horizon, étoiles/planètes déchiquetées (la matière rejoint le disque), le trou noir grossit. Glisser ↕ = inclinaison, pincer/+/− = zoom (anneau de photons visible en zoomant), curseur de masse (stellaire → supermassif). Accessible aussi en touchant/zoomant sur le cœur de la galaxie (niveau Galaxie).
- **🧬 Vie** (`Life.js`) : 1) **Molécules** : atomes H/C/N/O/P, éclairs, liaisons par valence → eau, méthane, ammoniac… 2) **ADN** : double hélice animée en 3D, 24 bases = 6 gènes (taille, teinte, vitesse, membres, vision, métabolisme), toucher une base = mutation, curseurs = gènes modifiables, aperçu de la créature 3) **Cellule** : membrane, noyau, mitochondries, ribosomes, division avec mutation possible 4) **Organisme** : créature générée par le génome, vit et cherche la nourriture 5) **Évolution** : population, sélection naturelle (abondance / rareté / prédateur), mutations, courbes des traits moyens. Le génome est sauvegardé (localStorage).
- Optimisation Android : résolution du fond auto-adaptée au FPS, DPR plafonné à 1,5, pas d'allocation dans les boucles de particules, palettes précalculées.

## v0.5 — livraison 2 : EXPLORATION 3D (bouton 🌌)
**Terminé** — `src/modes/Explore3D.js`
- Vraie caméra 3D (projection perspective, tampons typés préalloués = pooling) : glisser = orbite, pincer/molette/+− = zoom, « ✥ Vol libre » = glisser déplace la caméra dans l'espace, rotation auto.
- Zoom continu univers → galaxie → système → planète : zoomer à fond sur un objet plonge dedans (caméra qui fonce + fondu + flash), dézoomer à fond remonte en restant sur l'objet quitté. Toucher un objet y plonge aussi. Puces de niveau pour sauter directement.
- Univers : 8+ galaxies spirales (sprites), toile cosmique 3D. Galaxie : jusqu'à 4 500 (mobile) / 7 000 étoiles en 3D, 12+ systèmes touchables, trou noir au centre. Système : étoile (6 classes), 3–6+ planètes sur orbites elliptiques inclinées, anneaux. Planète : texture générée (océans, continents, bandes, calottes, nuages), ombrage selon l'étoile, atmosphère, anneaux, lunes en 3D, vie (halo vert + lueurs).
- Reliée au menu Créer : étoiles, galaxies, planètes, vie et trous noirs créés apparaissent dans l'exploration (monde natal Héliora, galaxie Voie Héliora).
- Graine de l'univers + position (niveau/objet) sauvegardées : la partie reprend où tu l'as laissée. Nombre d'étoiles lié à la qualité adaptative.
- Testé en simulation headless (plongée jusqu'à la planète, remontée, tap, sauvegarde, réouverture). Non testé : rendu visuel réel et FPS sur Android.

**Reste à faire**
1. Test sur appareils Android réels et réglage des budgets.
2. Phaser en local (hors-ligne) : impossible depuis mon environnement sans réseau — télécharger phaser.min.js 3.80.1 dans `lib/` et changer la balise script.
3. Interface calquée sur ton image (image jamais reçue).
4. Emballage APK (Capacitor / ton projet de compilation APK).
5. Sons d'ambiance plus riches, textures de planète plus détaillées.

## v0.5-alpha1 — livraison 1 (rien supprimé, tout l'existant est conservé)
**Terminé**
- `src/core/Save.js` : sauvegarde locale (localStorage, écriture différée toutes les 5 s + à la fermeture) : ressources, améliorations, créations, temps, son, qualité.
- `src/core/Sound.js` : effets sonores synthétisés (WebAudio, 0 fichier) : clic, charge, Big Bang, étapes, changement d'échelle, création, ambiance. Max 8 voix simultanées. Bouton 🔊/🔇.
- `src/core/Quality.js` : qualité adaptative bas / moyen / haut / auto (surveille le FPS toutes les 2 s, descend vite, remonte lentement). Agit sur le budget de particules de la genèse (en direct à la baisse, au prochain Big Bang à la hausse) et sur la résolution des écrans Trous noirs / Vie.
- `src/ui/Panels.js` + CSS : panneau holographique néon ☰ avec 4 onglets : **Stats** (âge de l'univers, ressources, créations, FPS), **Créer** (étoile, galaxie, planète, vie, trou noir : coûts énergie/matière et prérequis), **Évolution** (Rayonnement, Gravité : production ×), **Réglages** (son, qualité, effacer la sauvegarde). Ressources ⚡ énergie et ◈ matière produites chaque seconde après le Big Bang.
- Créer « Vie » ouvre l'écran 🧬 Vie ; créer « Trou noir » ouvre l'écran ⚫ Trous noirs.
- Testé : vérification de syntaxe de tous les fichiers + test headless de Save / Sound / Quality / Panels (FPS bas → palier inférieur, plafond de particules, sauvegarde). Non testé : rendu réel Phaser et appareil Android (pas de réseau ici pour charger Phaser).

**Reste à faire**
1. Exploration libre 3D (vraie caméra 3D orbitale/libre) : aujourd'hui le jeu est en 2D pseudo-3D.
2. Zoom continu univers → galaxie → système → planète sans fondu.
3. Les objets créés via le menu Créer (étoile, galaxie, planète) ne sont pour l'instant que comptés : les faire apparaître dans le Cosmos.
4. Sauvegarder l'univers généré lui-même (graine du Cosmos) et reprendre la partie.
5. Pooling généralisé (Cosmos, planètes) et plafonds de particules par échelle.
6. Interface holographique alignée sur ton image (envoie-la-moi : je ne l'ai pas reçue, seul le ZIP est arrivé).
7. Phaser en local (hors-ligne) et emballage APK.
8. Transitions/animations supplémentaires entre écrans, réglage sur appareils réels.

## À faire (v0.4 suite)
- Test sur appareils réels (FPS trou noir / évolution), réglage des budgets
- Trou noir : jets relativistes, collision de 2 trous noirs, ondes gravitationnelles, trous noirs dans les galaxies de l'univers
- Vie : organelles plus riches, reproduction sexuée (croisement de 2 génomes), espèces nommées, arbre généalogique, environnements (planète choisie dans le Cosmos)
- Timeline : lien direct vers l'Univers/galaxie générés, sons
- Lien Vie ↔ Cosmos : faire apparaître la vie sur une planète océanique du niveau Planète

## À faire (v0.3 suite)
- Test sur appareils réels (FPS), réglage des budgets d'étoiles/planètes
- Rendu : relief/ombres portées des lunes, ceintures d'astéroïdes, étoiles binaires, comètes
- Sauvegarde de l'univers généré, noms cliquables / fiche d'info par objet
- Transitions plus fluides (zoom continu sans fondu)

## À faire (avant)
- Tester sur de vrais appareils Android (FPS, réglage du budget de particules)
- Sons (charge, explosion, ambiance) et option muet
- Formation des planètes à partir du disque de matière autour des étoiles
- Systèmes de jeu (ressources, sauvegarde de l'univers créé)
- Emballage Android (APK) et Phaser en local pour le hors-ligne
