// ============================================================================
// AR BUSINESS CARD - Overlay 3D sobre image target (MindAR + Three.js)
// Video arriba + fila de botones anclados a la tarjeta
// ============================================================================

(async () => {
  const status = document.getElementById("status");
  const container = document.getElementById("ar");

  // 1) MindAR con renderer transparente (sin fondo negro)
  const mind = new MINDAR.IMAGE.MindARThree({
    container,
    imageTargetSrc: "./targets/my-card.mind",
    // Esto hace que el WebGL sea transparente y se vea la cámara
    rendererParameters: { alpha: true, antialias: true },
  });

  const { renderer, scene, camera } = mind;

  // 2) Anchor (ancla) del target índice 0
  const anchor = mind.addAnchor(0);

  // Un grupo para ordenar todo el overlay sobre la tarjeta
  const cardGroup = new THREE.Group();
  anchor.group.add(cardGroup);

  // === Dimensiones de trabajo (ajústalas a tu tarjeta real) =================
  // Imagina tu tarjeta como un rectángulo de ~90mm x 55mm.
  // Aquí lo “normalizamos” a unidades 3D: ancho total ≈ 1.6, alto ≈ 1.0
  const CARD_W = 1.6;   // ancho “virtual” de la tarjeta
  const CARD_H = 1.0;   // alto  “virtual” de la tarjeta

  // 3) VIDEO ARRIBA ----------------------------------------------------------
  // Crea elemento <video> (silencioso para autoplay en móvil)
  const video = document.createElement("video");
  video.src = "./assets/demo.mp4"; // tu video
  video.loop = true;
  video.muted = true;
  video.playsInline = true;
  video.preload = "auto";

  const videoTex = new THREE.VideoTexture(video);
  videoTex.encoding = THREE.sRGBEncoding;

  // Proporción 16:9 (ajusta si tu video es diferente)
  const VIDEO_W = CARD_W * 0.9;          // ocupa 90% del ancho de la tarjeta
  const VIDEO_H = VIDEO_W * (9 / 16);

  const videoGeo = new THREE.PlaneGeometry(VIDEO_W, VIDEO_H);
  const videoMat = new THREE.MeshBasicMaterial({ map: videoTex, toneMapped: false });

  const videoPlane = new THREE.Mesh(videoGeo, videoMat);
  // Posicionamos el video hacia la parte superior de la tarjeta
  videoPlane.position.set(0, CARD_H * 0.18, 0); // y=0.18 ≈ “parte superior”
  cardGroup.add(videoPlane);

  // 4) FILA DE BOTONES (abajo) ----------------------------------------------
  // Cargador de texturas para íconos PNG
  const loader = new THREE.TextureLoader();
  const iconLinkedIn = loader.load("./assets/icon-linkedin.png");
  const iconGlobe    = loader.load("./assets/icon-globe.png");
  const iconMail     = loader.load("./assets/icon-mail.png");

  // Materiales con transparencia activada
  const matLI  = new THREE.MeshBasicMaterial({ map: iconLinkedIn, transparent: true });
  const matWWW = new THREE.MeshBasicMaterial({ map: iconGlobe,    transparent: true });
  const matMail= new THREE.MeshBasicMaterial({ map: iconMail,     transparent: true });

  // Botones como pequeños planos cuadrados
  const BTN_SIZE = 0.18; // tamaño de cada botón
  const btnGeo = new THREE.PlaneGeometry(BTN_SIZE, BTN_SIZE);

  const btnLI   = new THREE.Mesh(btnGeo, matLI);
  const btnWWW  = new THREE.Mesh(btnGeo, matWWW);
  const btnMAIL = new THREE.Mesh(btnGeo, matMail);

  // Distribución en fila (x: izquierda-centro-derecha, y: parte baja)
  const ROW_Y = -CARD_H * 0.22;
  const SPACING = BTN_SIZE * 1.4;
  btnLI.position.set(-SPACING, ROW_Y, 0);
  btnWWW.position.set(0,        ROW_Y, 0);
  btnMAIL.position.set( SPACING,ROW_Y, 0);

  cardGroup.add(btnLI, btnWWW, btnMAIL);

  // 5) INTERACCIÓN (raycasting) ---------------------------------------------
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const clickables = [btnLI, btnWWW, btnMAIL, videoPlane]; // si quieres click en el video también

  function handleTap(ev) {
    const touch = ev.touches ? ev.touches[0] : ev;
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(clickables, true);
    if (!hits.length) return;

    const obj = hits[0].object;
    if (obj === btnLI)   window.open("https://www.linkedin.com/in/tu-usuario", "_blank");
    if (obj === btnWWW)  window.open("https://mariazapata.vercel.app/", "_blank");
    if (obj === btnMAIL) window.open("mailto:tu_correo@ejemplo.com", "_blank");
    if (obj === videoPlane) {
      // ejemplo: pausar/reanudar con toque
      if (video.paused) video.play().catch(()=>{}); else video.pause();
    }
  }

  renderer.domElement.addEventListener("click", handleTap);
  renderer.domElement.addEventListener("touchstart", handleTap, { passive: true });

  // 6) EVENTOS DEL TARGET (mostrar/ocultar, autoplay iOS) -------------------
  const tryPlay = () => {
    video.play().catch(() => {/* en iOS puede requerir toque */});
  };

  anchor.onTargetFound = () => {
    status.textContent = "Target detectado ✅ Toca una vez si el video no inicia";
    // “desbloqueo” de autoplay en iOS: primer toque reproduce
    const unlock = () => { tryPlay(); window.removeEventListener("touchstart", unlock); window.removeEventListener("click", unlock); };
    window.addEventListener("touchstart", unlock, { once: true });
    window.addEventListener("click", unlock, { once: true });
    tryPlay();
  };

  anchor.onTargetLost = () => {
    status.textContent = "Apunta la cámara a tu tarjeta para ver la experiencia";
    try { video.pause(); } catch {}
  };

  // 7) INICIAR AR ------------------------------------------------------------
  try {
    status.textContent = "Solicitando cámara…";
    await mind.start();
    status.innerHTML = 'Apunta la cámara a tu tarjeta <span class="badge">WebAR</span>';
  } catch (e) {
    status.textContent = "Error iniciando cámara. Usa HTTPS o localhost y permite el acceso.";
    console.error(e);
  }

  // 8) LOOP DE RENDER --------------------------------------------------------
  renderer.setAnimationLoop(() => renderer.render(scene, camera));
})();
