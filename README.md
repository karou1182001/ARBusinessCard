# AR Business Card (MindAR + Three.js) — Starter

Este proyecto te deja lista una **tarjeta de presentación en AR** (WebAR) gratis y con control total.

---

## 0) Requisitos
- **VS Code** (ya lo tienes) y un servidor local para pruebas:
  - Extensión **Live Server** *(recomendado)*, o
  - `python -m http.server 8080`, o
  - `npm i -g serve && serve .`
- **HTTPS** para pruebas en teléfono (despliega a Netlify/Vercel).
- Un video `MP4` ligero (720p ~2–5 MB).

> La cámara **no funciona** con `file://`. Debes usar **localhost** o **HTTPS**.

---

## 1) Estructura
```
ar-card-starter/
  index.html
  app.js
  styles.css
  /assets
    demo.mp4          <- coloca aquí tu video (renómbralo así)
  /targets
    my-card.mind      <- coloca aquí tu archivo target de MindAR
```

---

## 2) Generar el archivo target (.mind)
1. Prepara la imagen **de tu tarjeta** (buena calidad, con detalles/contraste).
2. Abre **MindAR Studio** (herramienta online).
3. Sube tu imagen, genera el target y **descarga** el `.mind`.
4. Guárdalo en `/targets/my-card.mind`.

> Consejos: evita plastificado brillante; imprime con buen contraste.

---

## 3) Configurar contenido
- Coloca tu video en `/assets/demo.mp4` (mismo nombre).
- En `app.js`, cambia el enlace del botón:
  ```js
  btn.href = "https://tu-portfolio-o-linktree.com";
  ```
- Si tu video no es 16:9, ajusta el plano:
  ```js
  const geometry = new THREE.PlaneGeometry(ancho, alto);
  ```

---

## 4) Probar en **VS Code**
- Instala extensión **Live Server** → botón **Go Live**.
- Abre `http://localhost:5500` (o el puerto indicado).
- Permite **acceso a la cámara**.
- Muestra la imagen de tu tarjeta a la cámara (puede ser impresa o en otra pantalla).
- Deberías ver el video superpuesto y el botón flotante.

> Si el video no inicia en iOS, toca la pantalla una vez (limitación de autoplay).

---

## 5) Desplegar en la web (HTTPS)
**Netlify (rápido):**
1. Entra a https://app.netlify.com → **Add new site** → **Deploy manually**.
2. Arrastra la carpeta del proyecto (o conecta tu repo).
3. Obtendrás un URL `https://...netlify.app` (HTTPS).

**Vercel:**
1. `npm i -g vercel`
2. En la carpeta del proyecto: `vercel`
3. Obtén un URL `https://...vercel.app` (HTTPS).

---

## 6) QR y pruebas en teléfonos
- Genera un **QR** que apunte a tu URL HTTPS.
- Prueba en **iPhone (Safari)** y **Android (Chrome)**.
- Checa luz, distancia, ángulo, y calidad de impresión.

---

## 7) Tips para conferencia
- Mantén el peso total de assets **< 3–5 MB**.
- Ten **fallback** (un enlace a un video de demo) por si algún móvil viejo falla.
- Usa **UTM** en tu URL para medir escaneos.
- Evita reflejos en la tarjeta (mejor acabado mate).

¡Listo! Edita, personaliza y presume que **lo hiciste tú**.
