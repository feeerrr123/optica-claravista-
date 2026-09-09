# Óptica Claravista — DESIGN.md

Sistema visual construido (no intención). Dirección **"La línea de puntos"**,
elegida por el cliente sobre la tirada de impeccable (seed `a0a1eac2`, new-work
redesign, modo **Persuade**). Referencias vinculantes: superpower.com, seed.com,
fixaplan.com — tipografía sans grande y segura, un acento que manda, mucho aire,
foto real, un dispositivo propio.

## Idea

El examen de la vista, hecho visible: un campo de puntos de colores que se
resuelve en un mensaje que puedes (o casi) leer. Leer lo que hay en los puntos es
lo que mide esta óptica. Rechaza: azul médico, foto de familia feliz, tres
tarjetas de features, eyebrow sobre el titular.

## Color (`src/index.css`, variables `--c-*`, canal RGB)

Tomado del test de Ishihara real: tierras cálidas de luminancia parecida.

| token | hex aprox | uso |
|---|---|---|
| `bg` | `#f6f2e9` | papel cálido, fondo |
| `surface` | `#fcfaf4` | superficie elevada, tarjeta de formulario/chatbot |
| `surface-2` | `#f0ebdf` | secciones alternas |
| `ink` | `#26231d` | texto (marrón casi negro, nunca gris) |
| `ink-soft` | `#6a6354` | texto secundario, tintado |
| `line` / `line-strong` | `#e2dbcb` / `#cdc4b0` | **toda división es filete de 1px, nunca sombra de tarjeta** |
| `accent` / `accent-dark` | `#bf5636` / `#9e4228` | arcilla — **la acción** (CTA, enlaces, activos). Nada más lo usa como relleno. |
| `--dot-fig-*` | rojo-teja | solo dentro de `<DotField>` |
| `--dot-gnd-*` | salvia / teal / oliva / topo | solo dentro de `<DotField>` |

Sección oscura (confianza, "cómo trabajamos"): fondo `ink`, texto `bg` y `bg/70`.

`::selection`, caret, scrollbar y foco tematizados del acento (ver `index.css`).

## Tipografía

- **Display**: **Bricolage Grotesque** (opsz 12–96, 500/700/800), `letter-spacing:
  -0.02em`. Todos los `h1/h2/h3` y `.font-display`. Titulares hasta ~3.2rem.
- **Texto**: **Hanken Grotesk** (400–700). Cuerpo 15–19px, medida `.measure` = 64ch.
- **Datos**: **Spline Sans Mono** (`.font-mono`, `tabular-nums` por defecto).
  Cifras (graduaciones, precios, años, horario), etiquetas en versalitas con
  tracking amplio, numeración de pasos. Mono = medida/dato, no disfraz técnico.

## El dispositivo — `<DotField text="…" />`

Campo de puntos en `<canvas>` con aire de lámina de Ishihara. Sesgado a la
**legibilidad** (el mensaje tiene que leerse): glifo grande, puntos pequeños y
densos (`gap ≈ W/74`), dilatación del trazo (`gap·1.35`), puntos figura algo
mayores. Figura rojo-teja saturado; fondo verdes/grises de luminancia parecida.

- **Animación** ("se resuelve"): al entrar en pantalla, los puntos de la figura
  pasan del color de fondo al de figura en ~850 ms, con un rebasamiento de brillo
  a mitad = **imagen residual** (persistencia de la visión).
- **Robustez**: SIEMPRE acaba pintando el estado legible. `reduced-motion` o
  pestaña oculta → mensaje ya resuelto, sin animación. `setTimeout` de seguridad
  fuerza el estado final si `requestAnimationFrame` va lento.
- Uso: portada ("VES") y CTA final ("CITA"). Dos momentos, no papel pintado.

## Movimiento

- Momento propio: el `DotField` resolviéndose + la imagen residual (clase
  `.afterimage` en botones y toggles: una marca de acento que se desvanece al
  soltar).
- `Reveal` (fade + 12px al entrar en viewport, `once`) para el contenido; discreto.
- `PageTransition` (fade + 12px al montar). **Sin `AnimatePresence` a nivel de
  ruta** (rompía la navegación).
- Curva del proyecto `cubic-bezier(0.16, 1, 0.3, 1)`. Todo respeta `reduced-motion`.

## Composición

- Ancho `max-w-shell` = 76rem. Contenedor con `px-5 sm:px-8`.
- **División por filete**, no por tarjeta con sombra. Rejillas con `gap-px` sobre
  `bg-line` para hairlines internas.
- Ritmo de lección: bloques numerados (01–05, 01–04) con más aire encima del
  titular que debajo. Horario en Contacto = **tabla real** ordenada por día.
- Header sticky translúcido (`bg-bg/85 backdrop-blur-md`), filete inferior.
- **"Pide cita" siempre aislada con aire**: en el header (separada `pl-4 sm:pl-8`)
  y como acción única de cada CTA.
- Foto real (`<Photo>`): marco de proporción fija, `ring-1 ring-inset ring-line`,
  `filter: contrast(1.05) saturate(1.04)`, carga diferida salvo `priority`.
  Todas son **stock de Unsplash marcado para sustituir** (`src/data/media.js`).

## Pendiente

Ver `CLAUDE.md`. Lo visual: revisar el `DotField` a anchos intermedios (los
trazos se ensanchan en bandas muy apaisadas); valorar reducir el uso de `Reveal`.
