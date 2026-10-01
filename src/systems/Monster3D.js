/* ===== CREATURES 3D DU MONDE =====
   Les créatures ne sont JAMAIS générées automatiquement.
   Elles apparaissent uniquement après une action du joueur.
   Dragon + serpent 3D : déplacement lent, recherche d'une planète et consommation visuelle.
*/
(function () {
  const X = window.CU = window.CU || {};
  const M = { root:null, scene:null, camera:null, renderer:null, clock:null, creature:null, planets:[], target:null, type:'dragon', raf:0, resize:null };
  const TAU=Math.PI*2;
  const mobile = () => !!X.mobile;

  function mat(T,c,rough=.65,metal=.05,emit=0){ return new T.MeshStandardMaterial({color:c,roughness:rough,metalness:metal,emissive:emit?c:0,emissiveIntensity:emit}); }
  function sphere(T,r,material,seg=16){ return new T.Mesh(new T.SphereGeometry(r,seg,Math.max(8,seg>>1)),material); }
  function tube(T,points,r,material){ return new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points),Math.max(5,points.length*2),r,8,false),material); }

  function buildDragon(T,seed){
    const root=new T.Group(), body=mat(T,0x253a42,.5,.12), belly=mat(T,0x71858a,.62,.04), wing=mat(T,0x17252d,.72,.08), bone=mat(T,0xb5c0b8,.72,.03), eye=mat(T,0xffb52e,.18,.02,3);
    const torso=sphere(T,1.65,body,20); torso.scale.set(1.5,.95,2.15); root.add(torso);
    const neck=new T.Mesh(new T.CylinderGeometry(.65,.95,2.5,14),body); neck.position.z=1.9; neck.rotation.x=-.35; root.add(neck);
    const head=sphere(T,1.05,body,20); head.scale.set(1.05,.9,1.35); head.position.set(0,1.0,3.15); root.add(head);
    const snout=sphere(T,.55,belly,16); snout.scale.set(1,.65,1.2); snout.position.set(0,.78,4.05); root.add(snout);
    for(const s of [-1,1]){
      const e=sphere(T,.18,eye,12); e.position.set(s*.43,1.27,3.95); root.add(e);
      const horn=new T.Mesh(new T.ConeGeometry(.18,.9,10),bone); horn.position.set(s*.62,1.75,3.0); horn.rotation.z=s*.3; root.add(horn);
      const arm=new T.Mesh(new T.CylinderGeometry(.22,.32,1.8,10),body); arm.position.set(s*1.55,.1,2.1); arm.rotation.z=s*.65; root.add(arm);
      for(let c=0;c<3;c++){const cl=new T.Mesh(new T.ConeGeometry(.08,.55,8),bone);cl.position.set(s*(1.75+c*.12),-.65,2.0+c*.15);cl.rotation.z=s*1.25;root.add(cl);}
      const w=new T.Mesh(new T.ConeGeometry(1.9,.18,5),wing); w.scale.set(1,1,1.8); w.position.set(s*1.35,.75,.7); w.rotation.set(s*.12,s*.18,s*(.72)); root.add(w);
    }
    for(let i=0;i<8;i++){const sp=new T.Mesh(new T.ConeGeometry(.18+i*.018,.7+i*.05,6),bone);sp.position.set(0,.8-i*.18,1.0-i*.65);sp.rotation.x=Math.PI;root.add(sp);}
    const tailPts=[]; for(let i=0;i<8;i++) tailPts.push(new T.Vector3(0,-.15-i*.08,-1.6-i*1.0)); root.add(tube(T,tailPts,.32,body));
    root.userData.kind='dragon'; root.userData.phase=(seed||1)%1000; return root;
  }

  function buildSerpent(T,seed){
    const root=new T.Group(), skin=mat(T,0x244f39,.46,.08), belly=mat(T,0x9aaf6a,.68,.02), eye=mat(T,0x73ffba,.12,.01,4), bone=mat(T,0xbac7a5,.75,.02);
    const segs=[];
    for(let i=0;i<22;i++){
      const m=skin.clone(); const s=sphere(T,Math.max(.26,.72-i*.018),m,14); s.position.z=-i*.55; s.position.y=Math.sin(i*.45)*.08; root.add(s); segs.push(s);
    }
    const head=sphere(T,.92,skin,18); head.scale.set(1.0,.85,1.25); head.position.z=.7; root.add(head);
    const jaw=sphere(T,.46,belly,14); jaw.scale.set(1,.45,1.25); jaw.position.set(0,-.22,1.15); root.add(jaw);
    for(const s of [-1,1]){const e=sphere(T,.16,eye,10);e.position.set(s*.4,.35,1.35);root.add(e); const f=new T.Mesh(new T.ConeGeometry(.08,.55,8),bone);f.position.set(s*.48,.55,1.0);f.rotation.z=s*.3;root.add(f);}
    root.userData.kind='serpent'; root.userData.segs=segs; root.userData.phase=(seed||2)%1000; return root;
  }

  // Une silhouette immédiatement lisible à grande distance : un noyau blindé,
  // huit bras segmentés et des cristaux emissifs. Contrairement à un sprite,
  // tous les éléments restent de vrais volumes éclairés par WebGL.
  function buildLeviathan(T,seed){
    const root=new T.Group(), shell=mat(T,0x27306a,.3,.28), plate=mat(T,0x6974ba,.42,.18), dark=mat(T,0x10142d,.56,.15), glowMat=mat(T,0x57eaff,.16,.1,4.5), tooth=mat(T,0xd9edff,.38,.08);
    const core=sphere(T,2.2,shell,28); core.scale.set(1.25,.9,1.25); root.add(core);
    const crown=sphere(T,1.2,plate,22); crown.scale.set(1,.65,.7); crown.position.set(0,.75,1.7); root.add(crown);
    const jaw=sphere(T,1.05,dark,20); jaw.scale.set(1.15,.35,.8); jaw.position.set(0,-.55,2.05); root.add(jaw);
    for(const side of [-1,1]) for(let i=0;i<4;i++){
      const a=(i-1.5)*.46, x=side*(1.25+Math.abs(a)*.25), pts=[];
      for(let j=0;j<7;j++) pts.push(new T.Vector3(x+side*j*.28,.12+Math.sin(a+j*.55)*.25,1.0+a-j*.86));
      const arm=tube(T,pts,.22,plate); arm.userData.arm=i+(side>0?4:0); root.add(arm);
      const tip=sphere(T,.28,glowMat,12);tip.position.copy(pts[pts.length-1]);root.add(tip);
    }
    for(let i=0;i<9;i++){const a=i*TAU/9, crystal=new T.Mesh(new T.ConeGeometry(.18,.85,6),glowMat);crystal.position.set(Math.cos(a)*1.72,.25,Math.sin(a)*1.72);crystal.lookAt(0,0,0);crystal.rotateX(Math.PI*.5);root.add(crystal);}
    for(const side of [-1,1]){const eye=sphere(T,.22,glowMat,14);eye.position.set(side*.58,.35,2.28);root.add(eye);for(let i=0;i<3;i++){const t=new T.Mesh(new T.ConeGeometry(.09,.48,7),tooth);t.position.set(side*.28,-.65,2.63-i*.24);t.rotation.x=Math.PI;root.add(t);}}
    root.userData.kind='leviathan'; root.userData.phase=(seed||3)%1000; return root;
  }

  function makePlanet(T,i){
    const colors=[0x2b72d6,0x4e9b57,0xc88948,0x8dbbd8,0xb85b4e,0x9d76c9];
    const r=1.1+(i%3)*.35, p=sphere(T,r,mat(T,colors[i%colors.length],.78,.02),20); p.position.set(-7+i*2.8,((i%2)*2-1)*1.5,-4-(i%3)*2); p.userData.radius=r; p.userData.alive=true; return p;
  }
  function rebuildPlanets(T){ M.planets.forEach(p=>M.scene.remove(p)); M.planets=[]; for(let i=0;i<6;i++){const p=makePlanet(T,i);M.planets.push(p);M.scene.add(p);} M.target=null; }
  function chooseTarget(){ let best=null,bd=1e9; if(!M.creature)return; for(const p of M.planets){if(!p.userData.alive)continue;const d=M.creature.position.distanceTo(p.position);if(d<bd){bd=d;best=p;}} M.target=best; }

  function animateCreature(dt){
    if(!M.creature)return; const T=window.THREE, t=M.clock.elapsedTime, c=M.creature;
    if(!M.target || !M.target.userData.alive) chooseTarget();
    if(M.target){
      const target=M.target.position.clone(); target.y+=Math.sin(t*.7)*.35;
      const dir=target.clone().sub(c.position), d=dir.length();
      if(d>1.7){dir.normalize(); c.position.addScaledVector(dir,dt*(c.userData.kind==='dragon'?.42:.34)); const look=target.clone(); c.lookAt(look);}
      else { // la créature mange lentement la planète
        M.target.scale.multiplyScalar(Math.max(0,1-dt*.22));
        c.rotation.z=Math.sin(t*2.2)*.06;
        if(M.target.scale.length()<.12){ M.target.userData.alive=false; M.target.visible=false; chooseTarget(); }
      }
    }
    if(c.userData.kind==='dragon'){
      c.position.y += Math.sin(t*.9+c.userData.phase)*dt*.12;
      c.children.forEach((q,i)=>{ if(i%7===0) q.rotation.x=Math.sin(t*2+i)*.18; });
    }else if(c.userData.segs){
      c.userData.segs.forEach((s,i)=>{s.position.x=Math.sin(t*1.7-i*.55)*(.16+i*.008);s.position.y=Math.sin(t*1.1-i*.25)*.10;});
    }else if(c.userData.kind==='leviathan'){
      c.rotation.y+=dt*.18;
      c.children.forEach((q,i)=>{if(q.userData.arm!=null)q.rotation.y=Math.sin(t*1.5+q.userData.arm)*.22; if(i%5===0)q.rotation.z=Math.sin(t*2+i)*.035;});
    }
  }

  function open(data={}){
    if(!window.THREE)return;
    const T=window.THREE;
    if(!M.root){
      M.root=document.createElement('div');M.root.id='monster3d';
      M.root.innerHTML='<div class="m3d-top"><b id="m3dTitle">CRÉATURE 3D</b><span id="m3dInfo">Aucune créature n’apparaît automatiquement</span></div><button id="m3dClose">✕</button><div id="m3dCanvas"></div><div class="m3d-actions"><button data-kind="dragon">🐉 DRAGON</button><button data-kind="serpent">🐍 SERPENT</button><button data-kind="leviathan">🦑 TITAN</button></div><div class="m3d-bottom">Volumes WebGL • matériaux PBR • prédateur colossal</div>';
      document.body.appendChild(M.root); M.root.querySelector('#m3dClose').onclick=close;
      M.root.querySelectorAll('.m3d-actions button').forEach(b=>b.onclick=()=>spawn(b.dataset.kind));
    }
    M.root.classList.add('on');
    if(!M.renderer){
      const host=M.root.querySelector('#m3dCanvas');M.scene=new T.Scene();M.scene.background=new T.Color(0x02040a);M.scene.fog=new T.FogExp2(0x02040a,.012);
      M.camera=new T.PerspectiveCamera(48,1,.1,300);M.camera.position.set(0,2.5,18);
      M.renderer=new T.WebGLRenderer({antialias:!mobile(),alpha:false,powerPreference:'high-performance'});M.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,mobile()?1:1.5));M.renderer.outputColorSpace=T.SRGBColorSpace;M.renderer.toneMapping=T.ACESFilmicToneMapping;M.renderer.toneMappingExposure=1.05;host.appendChild(M.renderer.domElement);M.clock=new T.Clock();
      M.scene.add(new T.AmbientLight(0x7890a0,1.25));const key=new T.DirectionalLight(0xffffff,2.2);key.position.set(5,8,10);M.scene.add(key);const rim=new T.PointLight(0x22ddff,8,40);rim.position.set(-8,3,4);M.scene.add(rim);
      const sg=new T.BufferGeometry(),a=new Float32Array((mobile()?350:650)*3);for(let i=0;i<a.length;i++)a[i]=(Math.random()-.5)*70;sg.setAttribute('position',new T.BufferAttribute(a,3));M.scene.add(new T.Points(sg,new T.PointsMaterial({color:0xaedbff,size:mobile()?.045:.055,sizeAttenuation:true})));
      M.resize=()=>{const r=host.getBoundingClientRect(),w=Math.max(1,r.width),h=Math.max(1,r.height);M.camera.aspect=w/h;M.camera.updateProjectionMatrix();M.renderer.setSize(w,h,false);};addEventListener('resize',M.resize,{passive:true});
      const loop=()=>{M.raf=requestAnimationFrame(loop);if(!M.root.classList.contains('on'))return;const dt=Math.min(.05,M.clock.getDelta());animateCreature(dt);M.renderer.render(M.scene,M.camera);};loop();
    }
    rebuildPlanets(T); spawn(data.kind || data.type || 'dragon',data.seed||Date.now(),data.name); M.resize();
  }
  function spawn(kind='dragon',seed=Date.now(),name=''){
    if(!M.scene||!window.THREE)return; const T=window.THREE;if(M.creature)M.scene.remove(M.creature);M.type=kind;M.creature=kind==='serpent'?buildSerpent(T,seed):kind==='leviathan'?buildLeviathan(T,seed):buildDragon(T,seed);M.creature.position.set(0,1,10);M.creature.scale.setScalar(kind==='leviathan'?1.35:1);M.scene.add(M.creature);M.camera.position.set(0,2.5,19);M.camera.lookAt(0,0,0);if(M.target)M.target.userData.alive=false;chooseTarget();const title=M.root.querySelector('#m3dTitle'),info=M.root.querySelector('#m3dInfo');title.textContent=kind==='serpent'?'🐍 SERPENT 3D':kind==='leviathan'?'🦑 TITAN LÉVIATHAN 3D':'🐉 DRAGON 3D';info.textContent=name ? name + ' • aperçu 3D' : 'Créé par le joueur • déplacement lent • mange les planètes';}
  function close(){if(M.root)M.root.classList.remove('on');}
  X.Monster3D={open,close,spawn};
})();
