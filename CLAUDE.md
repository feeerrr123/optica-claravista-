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
  pages/              Home · Servicios · Monturas · Nosotros · Cita · Contacto
```

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

## Pendiente

- [ ] Rellenar marcadores con datos de una óptica real para el pitch.
- [ ] Sustituir fotos de muestra por fotos reales del cliente.
- [ ] Mapa real en Contacto (embed).
- [ ] Conectar el formulario de cita (Supabase / Formspree).
- [ ] Revisar `DotField` en anchos intermedios (trazos anchos en bandas apaisadas).
- [ ] Confirmar el deploy de Vercel conectado al repo.
