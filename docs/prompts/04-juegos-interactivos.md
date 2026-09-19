# 4 · Juegos interactivos con carné compartible (para cualquier sector)

## Qué es y cuándo usarlo

Una página de 4 mini-juegos, ordenados de fácil a difícil, que enganchan al
visitante y acaban en una **tarjeta compartible** con su resultado. Es una
herramienta de captación: la gente juega, comparte la tarjeta y el negocio
aparece en sus redes y en sus chats. En Óptica Claravista son juegos de vista
(color, agudeza, contraste, visión 3D), pero **el mecanismo es genérico**:
funciona para cualquier negocio cambiando las 4 rondas, las puntuaciones y los
textos. Ver "Adaptar a otro sector" abajo.

Referencia en el repo: commits `fa0c77d` (los 4 juegos) y `cc4b2e1` (estereograma
más fácil). Archivos clave: `src/pages/Juegos.jsx`, `src/lib/juegos.js`,
`src/games/ui.jsx`, `src/games/Carne.jsx` y un archivo por juego
(`Color.jsx`, `Agudeza.jsx`, `Contraste.jsx`, `Estereograma.jsx`).

## Antes de empezar

No necesita cuentas ni claves. Solo un proyecto React (Vite) con un sistema de
diseño ya definido (colores, tipografías) que los juegos deben respetar.

## El prompt

```text
Quiero una sección de juegos interactivos para la web de [NEGOCIO], un
[TIPO DE NEGOCIO] en [CIUDAD]. La idea: 4 mini-juegos de fácil a difícil que
enganchen, y al terminar una tarjeta compartible con el resultado.

CONCEPTO
- Nombre de la sección y de la tarjeta: [p. ej. "Juegos para la vista" y
  "carné visual"].
- Las 4 rondas (de fácil a difícil): [DESCRIBE CADA UNA, o pídeme ideas: tienen
  que tener que ver con lo que hace el negocio y poder jugarse en 20-60 s].
- Qué gana el negocio: [p. ej. que el visitante pida cita al final].

PROYECTO DE REFERENCIA
Ya existe en producción (versión de la vista) en:
[RUTA LOCAL DEL REPO DE REFERENCIA]
Léelo antes de proponer nada: src/pages/Juegos.jsx, src/lib/juegos.js,
src/games/ui.jsx, src/games/Carne.jsx y un juego de ejemplo. Copia la
arquitectura y adáptala; no la reinventes.

ARQUITECTURA (respétala)
1. src/lib/juegos.js:
   - Array JUEGOS: { id, n, titulo, nivel, mide } por ronda.
   - Hook useJuegos(): estado en localStorage con clave versionada
     ("[negocio].juegos.v1"), sincronizado entre pestañas con el evento
     storage y a prueba de almacenamiento bloqueado (try/catch). Devuelve
     { state, guardar(id, resultado), reiniciar, hechos, todos, siguiente }.
   - Una función de puntuación por juego que convierte el resultado bruto en
     una valoración de 1 a 5.
   - Un objeto FRASES[juego][valoración] con la frase de cada resultado.
   - veredicto(state): a partir de la media, un título y un texto final.
2. src/pages/Juegos.jsx: cabecera con el aviso, contador "n / 4", botón
   "Empezar de cero", un Stepper de las 4 rondas (hecha / actual / pendiente),
   el juego actual (con `key` por id) o, al terminar, la tarjeta. Un aviso
   aria-live anuncia cada cambio ("Ronda 2 de 4...", "Valoración 4 de 5").
3. src/games/ui.jsx con las piezas compartidas: Rating (puntos 1-5), Aviso,
   GameFrame (recuadro con filete), Intro (pantalla de introducción de la
   ronda) y Resultado (valoración + frase + botón siguiente).
4. Cada juego es un componente que recibe onDone y lo llama con
   { raw: {...}, rating }. Muestra Intro → el juego → Resultado.
5. src/games/Carne.jsx: resumen en pantalla (veredicto + una fila por juego) y
   botón "guardar / compartir". Genera un PNG de 1080×1350 con un <canvas>
   (fondo, título, fecha, los 5 puntos de valoración de cada ronda con su frase, veredicto,
   aviso legal y la dirección web). En móvil usa navigator.canShare({files})
   + navigator.share; si no está disponible o falla, descarga el archivo. Si
   el usuario cancela el diálogo de compartir (AbortError), no hagas nada.
6. Al final, una llamada a la acción hacia [pedir cita / contactar].

REGLA DURA — es un JUEGO, no [diagnóstico / asesoramiento / promesa]
- El aviso ("Es un juego...") aparece en la introducción de cada ronda y en la
  tarjeta. Nunca afirmes un valor [clínico / técnico / legal] real: el texto
  dice "en este juego", nunca "tienes X".
- Los textos del veredicto animan a [consultar con un profesional / pasarse por
  el negocio], no diagnostican.

CALIDAD Y ACCESIBILIDAD
- Móvil primero: botones grandes (mínimo 64 px), sin gestos raros, nada que
  dependa del hover. Compruébalo a 375 px.
- Ordena de verdad por dificultad. Si una ronda es demasiado difícil, añade
  una ayuda opcional en vez de dejar al usuario atascado.
- Cada ronda dura entre 20 y 60 segundos. El progreso se guarda: si el usuario
  se va, sigue donde lo dejó.
- Sin AnimatePresence mode="wait" anidados (rompen formularios, filtros y la
  navegación). Transiciones simples con initial/animate.
- Con canvas: si usas putImageData, renderiza en un canvas fuera de pantalla al
  tamaño CSS y luego drawImage sobre el canvas visible; putImageData ignora la
  transformación de escala del DPR y descoloca la imagen.
- Respeta prefers-reduced-motion y usa aria-live para resultados.

CÓMO TRABAJAR
- Explícame primero las 4 rondas que propones y cómo puntúa cada una. Espera mi
  confirmación antes de construir.
- Verifica en el navegador cada ronda, el guardado a mitad, el reinicio y la
  tarjeta (descarga en escritorio, compartir en móvil). Para lo que dibuja un
  canvas, no te fíes solo de capturas: comprueba los píxeles con JavaScript.
```

## Adaptar a otro sector (ejemplos de partida)

Las 4 rondas son la parte que hay que inventar para cada negocio. Ejemplos
para dar a Claude como punto de partida (siempre de fácil a difícil):

- **Clínica dental**: 1) *Mitos y verdades* (test rápido), 2) *Cepillado a
  tiempo* (reflejos), 3) *Memoria de rutina* (secuencias), 4) *Adivina el
  tratamiento* (más difícil). Tarjeta: "Tarjeta de sonrisa".
- **Instalador solar**: 1) *Mitos de la energía solar*, 2) *Estima tu factura*
  (deslizador), 3) *Orienta el panel* (ángulo y hora), 4) *Predice el ahorro*.
  Tarjeta: "Tarjeta del ahorrador".
- **Gimnasio o fisio**: reflejos, memoria de secuencias, cuenta atrás de
  respiración, puzle de postura. Sin promesas de salud.

La tarjeta y el veredicto son lo compartible: ponles nombre y estilo propios
del negocio.

## Ejemplo de referencia: los 4 juegos de la vista

Por si los quieres reutilizar tal cual en otra óptica o clínica:

- **Color (fácil)**: 6 láminas tipo Ishihara, opción múltiple. Puntúa por
  porcentaje de aciertos.
- **Agudeza (normal)**: anillo de Landolt (una "C") que encoge; se indica hacia
  dónde apunta el hueco. Puntúa por el paso más pequeño superado.
- **Contraste (difícil)**: parche de rejilla (Gabor) que se desvanece; se
  indica su inclinación. Puntúa por el contraste mínimo detectado.
- **Visión 3D (muy difícil)**: autostereograma de puntos de colores (SIRDS) con
  una guía de dos puntos y una pista opcional que revela el contorno.

## Tropiezos reales

- **Estereograma demasiado difícil** (el propio usuario lo dijo). Se arregló
  reduciendo la separación de los ojos (de ~64-96 px a 38-44 px), agrandando la
  forma oculta, aplanando la profundidad, añadiendo una guía de convergencia de
  dos puntos y haciendo que la pista revele el contorno Y mueva la figura
  ("ondeo") para verla por movimiento aparente.
- **Imagen descolocada con canvas**: `putImageData` ignora la escala del DPR;
  Contraste y Estereograma salían en un cuadrante. Solución: canvas fuera de
  pantalla + `drawImage`.
- **Autostereograma en negro**: el sentido de la relación entre puntos estaba
  al revés (`same[derecha] = izquierda`). Debe ser `same[izquierda] = derecha`.
- **Navegación rota**: dos `AnimatePresence mode="wait"` anidados bloqueaban
  formularios, filtros y rutas. Quitados; solo initial/animate.
- **Capturas engañosas**: en el panel de vista previa los canvas a veces no
  salen en las capturas aunque estén pintados. Verifica con datos de píxeles y
  con `getBoundingClientRect`.
- **Redacción**: nunca escribir que el resultado "mide" algo real. Todos los
  textos dicen "en este juego".

## Cómo comprobar que funciona

1. Juega las 4 rondas de principio a fin; la dificultad debe subir de verdad.
2. A mitad de partida, recarga la página: debe seguir donde lo dejaste. "Empezar
   de cero" debe reiniciar.
3. La tarjeta se ve completa en pantalla; en escritorio descarga un PNG de
   1080×1350; en móvil abre el menú de compartir.
4. Lectores de pantalla: cada cambio de ronda se anuncia.
5. A 375 px de ancho no hay scroll horizontal ni botones pequeños.

## Costes y límites

Sin coste. Es 100 % en el navegador (nada de backend), así que no hay cuentas
que crear. Si algún día quieres contar cuántas tarjetas se comparten, habría
que añadir analítica aparte.
