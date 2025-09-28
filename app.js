// Este es el punto de partida. Se asegura de que el script no se ejecute hasta que todo el HTML se haya cargado y esté listo.
document.addEventListener('DOMContentLoaded', () => {
  
  // Selecciona el componente principal de A-Frame, la escena.
  const sceneEl = document.querySelector('a-scene');
  
  // Espera a que A-Frame haya cargado completamente la escena y todos sus componentes internos.
  sceneEl.addEventListener('loaded', () => {

    // --- SELECCIÓN DE ELEMENTOS ---
    // Se crean constantes para tener acceso rápido y fácil a los elementos clave del HTML.
    const target = document.querySelector('#target'); // La entidad que representa el marcador.
    const video = document.querySelector('#miVideo'); // El elemento <video>.
    const playPauseBtn = document.querySelector('#playPauseBtn'); // Botón de Pausar/Reproducir.
    const muteUnmuteBtn = document.querySelector('#muteUnmuteBtn'); // Botón de Silenciar/Activar Audio.
    const imagenSuperiorEl = document.querySelector('#imagenSuperiorEl'); // La imagen 3D que se desvanece.
    const scanningOverlay = document.getElementById('ui-custom-tracking-overlay'); // La pantalla de escaneo.

    // --- VARIABLES DE ESTADO ---
    let hideImageTimeout; // Guardará el temporizador para la animación de la imagen. Permite cancelarlo si es necesario.
    let isTargetEverFound = false; // Variable CRÍTICA: Actúa como un interruptor.

    // --- CONTROL DEL VIDEO ---
    playPauseBtn.addEventListener('click', () => {
      // Si el marcador nunca ha sido encontrado, la función se detiene aquí.
      if (!isTargetEverFound) return;
      
      // Si el video está pausado, lo reproduce.
      if (video.paused) {
        video.play();
        playPauseBtn.textContent = 'Pausar';
      } else {
        video.pause(); // Si se está reproduciendo, lo pausa.
        playPauseBtn.textContent = 'Reproducir'; // Actualiza el texto del botón.
      }
    });

    // Lógica para el botón de Silenciar/Activar Sonido.
    muteUnmuteBtn.addEventListener('click', () => {
      if (!isTargetEverFound) return; // Misma barrera de seguridad.
      
      // Invierte el estado de 'muted' (silenciar/activar sonido).
      video.muted = !video.muted;
      
      // Actualiza el texto del botón según el nuevo estado de 'muted'.
      muteUnmuteBtn.textContent = video.muted ? 'Activar Sonido' : 'Silenciar';
    });

    // --- EVENTOS DE MINDAR ---
    // Se ejecuta cuando la cámara PIERDE de vista el marcador.
    target.addEventListener("targetLost", () => {
      video.pause(); // Pausa el video inmediatamente.
      playPauseBtn.textContent = 'Reproducir'; // Actualiza el botón.
      scanningOverlay.classList.remove('hidden'); // Muestra la pantalla de escaneo.
      
      clearTimeout(hideImageTimeout); // Cancela cualquier temporizador pendiente para desvanecer la imagen.
      
      // Restablece la imagen superior a su estado inicial.
      imagenSuperiorEl.setAttribute('visible', true);
      imagenSuperiorEl.setAttribute('material', 'opacity', 1);
    });

    // Se ejecuta cuando la cámara ENCUENTRA el marcador.
    target.addEventListener("targetFound", () => {
      // Cambia la variable de estado a 'true'.
      isTargetEverFound = true;
      
      if (video.paused) {
        video.play(); // Si el video estaba pausado, lo reproduce.
        playPauseBtn.textContent = 'Pausar'; // Actualiza el texto del botón.
      }
      
      scanningOverlay.classList.add('hidden'); // Oculta la pantalla de escaneo.
      
      // Restablece la opacidad de la imagen superior.
      imagenSuperiorEl.setAttribute('material', 'opacity', 1);
      imagenSuperiorEl.removeAttribute('animation'); // Elimina cualquier animación anterior.
      
      clearTimeout(hideImageTimeout); // Limpia cualquier temporizador pendiente.

      // Inicia un nuevo temporizador para desvanecer la imagen después de 5 segundos.
      hideImageTimeout = setTimeout(() => {
        imagenSuperiorEl.setAttribute('animation', {
          property: 'material.opacity', // La propiedad a animar (la opacidad del material).
          from: 1, // Valor inicial (totalmente opaco).
          to: 0, // Valor final (totalmente transparente).
          dur: 1500, // Duración de la animación (1.5 segundos).
          easing: 'easeInQuad' // Tipo de aceleración para el desvanecimiento suave.
        });
      }, 5000); // La animación se ejecuta después de 5 segundos.
    });

    // --- LÓGICA DE REDES SOCIALES ---
    // Objeto que asocia el ID de cada ícono con su URL correspondiente.
    const links = {
      facebookBtn: 'https://mariazapata.vercel.app/',
      youtubeBtn: 'https://mariazapata.vercel.app/',
      blogBtn: 'https://mariazapata.vercel.app/',
      instagramBtn: 'https://mariazapata.vercel.app/',
      whatsappBtn: 'https://mariazapata.vercel.app/',
      // ... otros enlaces de redes sociales.
    };
    
    // Este bucle recorre el objeto 'links' y asigna un evento de clic a cada ícono.
    for (const [id, url] of Object.entries(links)) {
      const button = document.querySelector(`#${id}`); // Selecciona el ícono por su ID.
      button.addEventListener('click', () => { // Añade el evento de clic.
        window.open(url, '_blank'); // Abre el enlace en una nueva pestaña.
      });
    }
  });
});
