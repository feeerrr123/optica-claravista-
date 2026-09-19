# 3 · Animación de puntos: una palabra que emerge, late y reacciona al cursor

## Qué es y cuándo usarlo

Una lámina de puntos de colores (aire de test de Ishihara) en la que una
palabra corta —"VES", "CITA", el nombre de la marca— se lee por diferencia de
tono. Al entrar en pantalla la palabra "se resuelve"; después los puntos
rojos **laten** (de más a menos intensidad) y, si pasas el cursor o el dedo, los
puntos cercanos **se apartan y brillan**, como una pupila que se abre, y
vuelven a su sitio con un muelle. Es el elemento firma de la portada. Sirve
para cualquier marca: cambian la palabra y la paleta.

Referencia en el repo: commits `fb9d498` (latido + cursor) y `701d02c` (segundo
uso). Archivo: `src/components/DotField.jsx`; usado en `src/pages/Home.jsx` con
`<DotField text="VES" pulso interactivo />`.

## Antes de empezar

No necesita cuentas ni claves. Requiere un proyecto React (Vite) con Tailwind
o CSS propio para la altura del contenedor.

## El prompt

```text
Quiero una animación de portada para [MARCA / NEGOCIO]: una lámina de puntos
de colores, estilo test de Ishihara, donde se lee la palabra "[PALABRA]"
(3-4 letras funcionan mejor).

PROYECTO DE REFERENCIA
Ya existe en producción en:
[RUTA LOCAL DEL REPO DE REFERENCIA]
Lee src/components/DotField.jsx y la regla "DotField" de su CLAUDE.md y
adáptalo. Cambia solo la palabra, la paleta y los tamaños; conserva la
arquitectura y las redes de seguridad.

CÓMO FUNCIONA (respétalo)
1. Un <canvas> dentro de un contenedor con role="img" y aria-label descriptivo.
   Se dibuja a resolución real (DPR limitado a 2) y se reconstruye al
   redimensionar (con debounce) y cuando terminan de cargar las fuentes.
2. La palabra se pinta en un canvas fuera de pantalla, a tamaño CSS, en negrita
   gruesa; ese canvas es la máscara. Una cuadrícula de puntos (filas
   alternas desplazadas medio hueco, con un pequeño temblor aleatorio) decide
   qué puntos son "figura" mirando la máscara, con una dilatación para
   engordar los trazos y que se lea.
3. Colores: figura = rojo saturado; fondo = verdes y grises de luminancia
   parecida, para que solo se distingan por tono. Paleta configurable
   ([COLORES DE LA MARCA]).
4. Intro: cuando la lámina entra en pantalla (IntersectionObserver), los puntos
   de la figura pasan del color de fondo al suyo en ~850 ms, con un pequeño
   destello. Si el observer no dispara, un temporizador lo lanza a los 600 ms.
5. Prop `pulso`: con la lámina ya resuelta, los puntos rojos oscilan ~cada
   2,6 s entre su color y un tono más claro (una onda suave, con un pequeño
   desfase según la posición horizontal). El tope de aclarado (PULSE_DEPTH) es
   alto pero nunca tanto que el rojo se confunda con el fondo. Para no
   repintar miles de puntos por frame, los puntos de fondo se dibujan una vez en
   una capa cacheada y solo se repintan los de la figura.
6. Prop `interactivo`: el cursor o el dedo repelen los puntos cercanos
   (radio proporcional al ancho, fuerza mayor cuanto más cerca) con un muelle
   que los devuelve; los puntos rojos cercanos se iluminan con un brillo cálido
   que entra y sale suave. Mientras hay puntos desplazados se repinta todo; en
   reposo se vuelve a la vía barata y los desplazamientos son exactamente 0.
7. Eventos de puntero (no de ratón) SIN preventDefault, para no romper el
   scroll vertical en móvil; el navegador cancela el gesto y todo vuelve a su
   sitio. En táctil, el efecto se suelta a los ~350 ms de levantar el dedo.

REGLAS DURAS
- El mensaje SIEMPRE debe acabar legible. Mantén la red de seguridad: un
  temporizador que fuerza el estado resuelto aunque requestAnimationFrame vaya
  lento, y otro (~1,6 s) que devuelve todos los puntos a su sitio si la
  animación se atasca con puntos desplazados.
- Respeta prefers-reduced-motion: se pinta el estado resuelto y no se activa ni
  el latido ni el cursor.
- El latido y la interacción solo corren con la pestaña visible y la lámina en
  pantalla (IntersectionObserver + visibilitychange).
- Sin eyebrow encima del titular ni sombras de tarjeta: respeta el sistema de
  diseño del proyecto.
- No uses más de dos láminas por página.

CÓMO PROBARLO
En el panel de vista previa de Claude Code, requestAnimationFrame e
IntersectionObserver NO disparan y la página puede figurar como oculta. No
saques conclusiones de capturas. Para verificar de verdad:
  1. Sustituye requestAnimationFrame por un setTimeout de ~16 ms,
     IntersectionObserver por un doble que siempre diga "visible", y fuerza
     document.visibilityState = 'visible'.
  2. Vuelve a montar la portada (navega a otra ruta y vuelve).
  3. Mide el color medio de los píxeles rojos del canvas cada 300 ms: debe
     oscilar (en el proyecto de referencia, entre ~195 y ~221 de rojo).
  4. Lanza PointerEvent 'pointermove' sobre el contenedor y comprueba que
     bajan los píxeles rojos junto al cursor y que, tras 'pointerleave',
     vuelven al valor de reposo.
  5. Simula el atasco (requestAnimationFrame que no hace nada) y comprueba que
     el temporizador de seguridad restaura el estado de reposo exacto.
Dime claramente que en el panel no se puede ver la animación real.
```

## Tropiezos reales

- **Palabra ilegible al principio**: la primera versión ("VES BIEN") no se
  leía. Solución: palabras cortas, puntos más pequeños y densos, dilatación de
  los bordes y una separación de tono mucho más fuerte entre figura y fondo.
- **Destello al arrancar**: pintar la figura, resetearla y animarla producía un
  parpadeo feo. Ahora solo se pinta el fondo hasta que empieza la intro.
- **requestAnimationFrame parado en el panel de vista previa**: no es un fallo
  del código. Por eso existe el temporizador de seguridad y la forma de probar
  con dobles (arriba).
- **El temporizador de seguridad pisaba el latido**: la red de seguridad de la
  intro repintaba el estado estático a mitad del latido. Se cancela en cuanto
  la intro termina bien.
- **Errores "no definido" en consola** durante el desarrollo: eran versiones
  intermedias del recargado en caliente; se confirman como historial si no
  aparecen tras una carga limpia.
- **Escalabilidad**: unos ~5.000 puntos por lámina. Repintar todos cada frame es
  aceptable solo mientras hay interacción; por eso existe la capa cacheada.

## Cómo comprobar que funciona

En un navegador normal: al llegar a la lámina la palabra se resuelve; después
respira suavemente; al pasar el cursor por encima se abre un hueco radial con
brillo cálido y, al retirarlo, todo vuelve exacto. Con "reducir movimiento"
activado en el sistema, la lámina queda quieta y legible. En móvil, un toque
hace el efecto y el scroll sigue funcionando.

## Costes y límites

Sin coste. En móviles muy antiguos, bajar el número de puntos (subir `gap`) o
quitar `interactivo` si va justo.
