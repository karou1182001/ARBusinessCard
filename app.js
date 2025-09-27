(async () => {
  const status = document.getElementById("status");
  const container = document.getElementById("ar");

  // Inicialización de MindAR
  const mind = new MINDAR.IMAGE.MindARThree({
    container,
    imageTargetSrc: "./targets/my-bcard.mind", // Asegúrate de que el archivo esté en el lugar adecuado
    rendererParameters: { alpha: true, antialias: true },
  });

  const { renderer, scene, camera } = mind;
  const anchor = mind.addAnchor(0);

  // Crear un grupo para los íconos
  const cardGroup = new THREE.Group();
  anchor.group.add(cardGroup);

  // Cargar los íconos de las redes sociales
  const loader = new THREE.TextureLoader();
  const iconLinkedIn = loader.load("./assets/icon-linkedin.png");
  const iconGlobe = loader.load("./assets/icon-globe.png");
  const iconMail = loader.load("./assets/icon-mail.png");

  const matLI = new THREE.MeshBasicMaterial({ map: iconLinkedIn, transparent: true });
  const matWWW = new THREE.MeshBasicMaterial({ map: iconGlobe, transparent: true });
  const matMail = new THREE.MeshBasicMaterial({ map: iconMail, transparent: true });

  // Tamaño y geometría de los íconos
  const BTN_SIZE = 0.18;
  const btnGeo = new THREE.PlaneGeometry(BTN_SIZE, BTN_SIZE);

  const btnLI = new THREE.Mesh(btnGeo, matLI);
  const btnWWW = new THREE.Mesh(btnGeo, matWWW);
  const btnMAIL = new THREE.Mesh(btnGeo, matMail);

  // Distribución de los íconos en fila
  const ROW_Y = -0.35;
  const SPACING = BTN_SIZE * 1.4;
  btnLI.position.set(-SPACING, ROW_Y, 0);
  btnWWW.position.set(0, ROW_Y, 0);
  btnMAIL.position.set(SPACING, ROW_Y, 0);

  cardGroup.add(btnLI, btnWWW, btnMAIL);

  // Manejo de clics
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const clickables = [btnLI, btnWWW, btnMAIL];

  function handleTap(ev) {
    const touch = ev.touches ? ev.touches[0] : ev;
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(clickables, true);
    if (!hits.length) return;

    const obj = hits[0].object;
    if (obj === btnLI) window.open("https://www.linkedin.com/in/mariazapatam/", "_blank");
    if (obj === btnWWW) window.open("https://mariazapata.vercel.app/", "_blank");
    if (obj === btnMAIL) window.open("mailto:mariazapatamontano@gmail.com", "_blank");
  }

  renderer.domElement.addEventListener("click", handleTap);
  renderer.domElement.addEventListener("touchstart", handleTap, { passive: true });

  // Evento cuando se detecta el target
  anchor.onTargetFound = () => {
    status.textContent = "Target detectado ✅";
  };

  // Evento cuando se pierde el target
  anchor.onTargetLost = () => {
    status.textContent = "Apunta la cámara a tu tarjeta";
  };

  // Iniciar AR
  try {
    status.textContent = "Solicitando cámara…";
    await mind.start();
    status.innerHTML = 'Apunta la cámara a tu tarjeta <span class="badge">WebAR</span>';
  } catch (e) {
    status.textContent = "Error iniciando cámara. Usa HTTPS o localhost y permite el acceso.";
    console.error(e);
  }

  // Loop de renderizado
  renderer.setAnimationLoop(() => renderer.render(scene, camera));
})();
