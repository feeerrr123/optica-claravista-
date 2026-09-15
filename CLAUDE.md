# Óptica Claravista — guía para Claude Code

Web **demo multipágina** (marca ficticia) de una óptica. Prototipo para enseñar a
ópticas reales en el negocio de creación de webs para negocios locales.

**Marca ficticia. Ningún dato es real.** `[TU ESTUDIO]`, `[ciudad]`, `[teléfono]`,
`[calle y número]`, nombres del equipo, año de fundación = marcadores a rellenar.

Ver `PRODUCT.md` (verdad de producto) y `DESIGN.md` (sistema visual). Dirección
visual **"La línea de puntos"** (impeccable, seed `a0a1eac2`, elegida por el
cliente). El contrato de dirección está en el `<!-- comentario -->` de `index.html`.

## Stack

- **React 18 + Vite 6** · **React Router 6** · **Tailwind 3** · **Framer Motion 11**
- Sin backend. Formulario de cita = solo UI (muestra confirmación). Pendiente
  conectar a Supabase (tabla `leads`, como Óptica Nazareth) o Formspree.
- Deploy: **Vercel vía GitHub** (`feeerrr123/optica-claravista-`). `vercel.json`
  tiene el rewrite SPA.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

## Estructura

```
src/
  main.jsx            entry + BrowserRouter
  App.jsx             rutas + <ScrollToTop>. SIN AnimatePresence de ruta.
  index.css           ← PALETA (variables --c-*, canal RGB) + resets + .afterimage
  lib/useTitle.js     <title> por página
  components/
    Layout.jsx        Navbar + Footer + Chatbot + skip-link
    Navbar.jsx        sticky, filete inferior, menú móvil, "Pide cita" aislada
    Footer.jsx        hairlines, horario en mono
    Chatbot.jsx       widget flotante, FAQ predefinidas (sin IA), datos en chatbot.js
    DotField.jsx      ★ el dispositivo: lámina de puntos que se resuelve en `text`
    Photo.jsx         foto con ratio fijo, ring, filtro cálido, carga diferida
    PageTransition.jsx  fade+12px al montar (sin exit)
    Reveal.jsx        fade-in al entrar en viewport (whileInView, once)
    Container.jsx · Button.jsx
  data/
    chatbot.js        guion del chatbot
    servicios.jsx     los 4 servicios con detalle (JSX → .jsx)
    media.js          fotos Unsplash (verificadas) + catálogo de monturas
  games/              juegos para la vista (ver abajo)
  lib/juegos.js       estado (localStorage) + puntuación + veredicto
  lib/horario.js      horario de apertura + huecos de cita (ver Cita abajo)
  components/Agenda.jsx  calendario de la página de Cita (ver abajo)
  pages/              Home · Servicios · Monturas · Juegos · Nosotros · Cita · Contacto
```

## Pide cita (`/cita`) — flujo de 3 pasos

`src/pages/Cita.jsx` ya no es un formulario suelto: es **datos → calendario →
confirmación**, con un stepper igual en estilo al de Juegos.

1. **Tus datos**: nombre, teléfono, email, servicio, mensaje. Validación propia
   (no `noValidate` del navegador). Al enviar, se guardan en estado (`datos`) y
   se pasa al paso 2 — no hay envío real todavía.
2. **Día y hora**: `<Agenda>` (`src/components/Agenda.jsx`). Tira horizontal de
   los próximos 12 días **abiertos** (salta domingos) y, debajo, la rejilla de
   huecos del día elegido. La duración de la cita sale del servicio elegido en
   el paso 1 (`Adaptación de lentes de contacto` → 45 min, el resto → 30) y se
   lo pasa a `huecosDelDia`.
3. **Confirmación**: resumen en una frase ("Nombre, para *servicio* el *día* a
   las *hora*") + el aviso de siempre de que es demo. Desde aquí se puede
   volver a cambiar hora (conserva los datos) o pedir otra cita (reinicia todo).

`src/lib/horario.js` es la fuente de verdad del horario:
**L–V 9:30–13:30 y 16:30–19:00 · Sábado 10:00–13:00 · Domingo cerrado.**
Los huecos "ya ocupados" salen de un hash determinista sobre fecha+hora (sin
backend, pero consistentes entre recargas) — no son reservas reales. Si cambia
el horario de la óptica, se toca solo `TRAMOS` en ese archivo.

Aviso: `role="status" aria-live="polite"` (`anuncio` en `Cita.jsx`) anuncia cada
cambio de paso, igual que en Juegos — mantiene el mismo patrón de accesibilidad
en todo el sitio.

## Juegos para la vista (`/juegos`)

Cuatro mini-juegos en `<canvas>`, de fácil a difícil, con carné visual al final.
`src/pages/Juegos.jsx` orquesta; `src/lib/juegos.js` guarda el progreso en
`localStorage` (`claravista.juegos.v1`), puntúa cada uno (1–5) y saca el veredicto.

- `games/Color.jsx` — Ishihara jugable (6 láminas, opción múltiple).
- `games/Agudeza.jsx` — anillo de Landolt que encoge; dirección del hueco.
- `games/Contraste.jsx` — parche de rejilla (Gabor) que se desvanece; inclinación.
- `games/Estereograma.jsx` — autostereograma SIRDS (puntos de colores) + guía de
  dos puntos + pista revelable.
- `games/Carne.jsx` — resumen; genera un PNG 1080×1350 (`navigator.share` en móvil,
  descarga en escritorio).
- `games/ui.jsx` — `Intro`, `Resultado`, `Rating`, `Aviso`, `ArrowPad`, `GameFrame`.

**Regla:** son juegos, NO diagnóstico. El `<Aviso>` va en cada intro y en el
carné. El resultado nunca afirma un valor clínico ("nivel X en este juego").
Los canvas con `putImageData` renderizan en un canvas offscreen a tamaño CSS y
luego `drawImage` (si no, el DPR descoloca la imagen).

## Color

Paleta en `src/index.css`, variables `--c-*` en **canal RGB** (`"38 35 29"`).
Tailwind: `bg-bg`, `text-ink`, `border-line`, `bg-accent`, `text-accent/60`, etc.

**Paleta activa: papel cálido + tierras de Ishihara + acento arcilla.** Detalle en
`DESIGN.md`. Los `--dot-*` son SOLO para `<DotField>`, nunca relleno de UI.

## Reglas duras

- **framer-motion:** NO anidar `AnimatePresence mode="wait"`. Rompió form, filtro
  y navegación. Transición de página = solo `initial/animate` en `PageTransition`.
  Chatbot y menú móvil usan `AnimatePresence` (modo sync) porque están fuera de rutas.
- **DotField:** siempre debe acabar pintando el mensaje legible. No quitar la red
  de seguridad (`setTimeout` que fuerza `paint(1)`), ni el camino `reduced-motion`.
- **División por filete de 1px, nunca sombra de tarjeta.** Sin eyebrow/kicker
  sobre los titulares.
- **Fotos:** todas son stock marcado para sustituir (`media.js`). No usar como
  reales en JSON-LD/OG.

## Estado

Las 6 páginas rediseñadas con la dirección "La línea de puntos". Build OK,
`detect.mjs` limpio. Revisión de acabado hecha en el hilo (el harness no tiene el
subagente `impeccable-finish-reviewer`).

Revisión crítica completa hecha y corregida: contraste AA del acento
(`--c-accent`), validación propia en el formulario de Cita, `aria-live` en los
juegos, meta-descripción por página + `robots.txt`, toggle de montura ya no
decorativo, banda de cifras con filete en vez de grid genérico. Demo lista
para pitch en cuanto a diseño/código; sigue faltando rellenar datos reales
(ver Pendiente).

## Pendiente

- [ ] Rellenar marcadores con datos de una óptica real para el pitch.
- [ ] Sustituir fotos de muestra por fotos reales del cliente.
- [ ] Mapa real en Contacto (embed).
- [ ] Conectar el formulario de cita + el calendario a un backend real
      (Supabase: guardar la reserva y marcar el hueco como ocupado de verdad,
      no con el hash de `horario.js`) o a un gestor de citas ya existente.
- [ ] Revisar `DotField` en anchos intermedios (trazos anchos en bandas apaisadas).
- [ ] Confirmar el deploy de Vercel conectado al repo.
