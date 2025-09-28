document.addEventListener('DOMContentLoaded', () => {
  const sceneEl = document.querySelector('a-scene');
  
  sceneEl.addEventListener('loaded', () => {
    const target = document.querySelector('#target'); // zappar-image-target
    const video = document.querySelector('#miVideo');
    const videoPlane = document.querySelector('#videoPlane');
    const playPauseBtn = document.querySelector('#playPauseBtn');
    const muteUnmuteBtn = document.querySelector('#muteUnmuteBtn');
    const imagenSuperiorEl = document.querySelector('#imagenSuperiorEl');
    const scanningOverlay = document.getElementById('ui-custom-tracking-overlay');
    
    let hideImageTimeout;
    let isTargetEverFound = false;

    // ==================== CONTROL DEL VIDEO ====================
    playPauseBtn.addEventListener('click', () => {
      if (!isTargetEverFound) return;
      if (video.paused) {
        video.play();
        playPauseBtn.textContent = 'Pausar';
      } else {
        video.pause();
        playPauseBtn.textContent = 'Reproducir';
      }
    });

    muteUnmuteBtn.addEventListener('click', () => {
      if (!isTargetEverFound) return;
      video.muted = !video.muted;
      muteUnmuteBtn.textContent = video.muted ? 'Activar Sonido' : 'Silenciar';
    });

    // ==================== EVENTOS DE ZAPPAR ====================
    target.addEventListener('targetFound', () => {
      isTargetEverFound = true;
      scanningOverlay.classList.add('hidden');
      
      if (video.paused) {
        video.play();
        playPauseBtn.textContent = 'Pausar';
      }

      // Restablecer imagen superior
      imagenSuperiorEl.setAttribute('material', 'opacity', 1);
      imagenSuperiorEl.removeAttribute('animation');
      clearTimeout(hideImageTimeout);

      // Desvanecer imagen después de 5 segundos
      hideImageTimeout = setTimeout(() => {
        imagenSuperiorEl.setAttribute('animation', {
          property: 'material.opacity',
          from: 1,
          to: 0,
          dur: 1500,
          easing: 'easeInQuad'
        });
      }, 5000);
    });

    target.addEventListener('targetLost', () => {
      video.pause();
      playPauseBtn.textContent = 'Reproducir';
      scanningOverlay.classList.remove('hidden');

      clearTimeout(hideImageTimeout);
      imagenSuperiorEl.setAttribute('visible', true);
      imagenSuperiorEl.setAttribute('material', 'opacity', 1);
    });

    // ==================== LÓGICA DE REDES SOCIALES ====================
    const links = {
      linkedinBtn: 'https://www.linkedin.com/in/mariazapatam/',
      portfolioBtn: 'https://mariazapata.vercel.app/',
      emailBtn: 'mailto:mariazapatamontano@gmail.com?subject=AR%20App&body=Hi,%20me%20interesa%20saber%20más%20sobre%20la%20tarjeta%20de%20presentación%20en%20realidad%20aumentada.'
    };

    for (const [id, url] of Object.entries(links)) {
      const button = document.querySelector(`#${id}`);
      button.addEventListener('click', () => {
        window.open(url, '_blank');
      });
    }

    // ==================== SUAVIZADO OPCIONAL ====================
    // Zappar ya hace smoothing internamente, pero si quieres suavizar aún más:
    /*
    let targetPosition = { x: 0, y: 0, z: 0 };
    let smoothingFactor = 0.1;

    function smoothPosition() {
      let currentPosition = target.object3D.position;
      targetPosition.x += (currentPosition.x - targetPosition.x) * smoothingFactor;
      targetPosition.y += (currentPosition.y - targetPosition.y) * smoothingFactor;
      targetPosition.z += (currentPosition.z - targetPosition.z) * smoothingFactor;
      videoPlane.setAttribute('position', targetPosition);
    }

    setInterval(smoothPosition, 16);
    */
  });
});
