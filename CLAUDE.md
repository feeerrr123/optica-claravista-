# Óptica Claravista — guía para Claude Code

Web **demo multipágina** (marca ficticia) de una óptica. Prototipo para enseñar a
ópticas reales en el negocio de creación de webs para negocios locales.

**Marca ficticia. Ningún dato es real.** `[TU ESTUDIO]`, `[ciudad]`, `[teléfono]`,
etc. son marcadores de posición a rellenar.

## Stack

- **React 18 + Vite 6** · **React Router 6** · **Tailwind 3** · **Framer Motion 11**
- Sin backend. Formularios (cita, contacto) serán solo UI; Supabase más adelante.
- Deploy: **Vercel** (`vercel.json` ya tiene el rewrite SPA).

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

## Estructura

```
src/
  main.jsx            entry + BrowserRouter
  App.jsx             rutas + <AnimatePresence> para transición de página
  index.css           ← PALETA (variables CSS) + resets. Recolorear aquí.
  components/
    Layout.jsx        Navbar + Footer + Chatbot + skip-link
    Navbar.jsx        sticky, menú móvil animado, CTA "Pide tu cita"
    Footer.jsx
    Chatbot.jsx       widget flotante, FAQ predefinidas (sin IA)
    PageTransition.jsx  envuelve cada página (fade/slide 280ms)
    Reveal.jsx        fade-in al entrar en viewport (whileInView, once)
    Container.jsx     ancho máximo + padding lateral
    Button.jsx        variantes: primary / ghost / quiet
    StubPage.jsx      placeholder de páginas aún no construidas
  data/
    chatbot.js        guion del chatbot
    servicios.jsx     los 4 servicios + iconos SVG (JSX → .jsx, no .js)
  pages/
    Home.jsx          ← ÚNICA página construida
    Servicios/Monturas/Nosotros/Cita/Contacto .jsx  ← stubs
```

## Color (importante)

Toda la paleta vive en `src/index.css` como variables `--c-*` en formato **canal
RGB** (`"13 94 88"`). Tailwind las consume con `rgb(var(--c-x) / <alpha-value>)`,
así que `bg-primary`, `text-ink`, `bg-primary/10`, etc. funcionan.

**Paleta activa: petróleo + arena + cobre.** Para reshadear: cambiar ~10 líneas del
`:root`. Hay 2 variantes de ejemplo comentadas (A "azul confianza", C "azul noche").

## framer-motion — regla dura

**No anidar `AnimatePresence mode="wait"`.** Rompe el árbol. Las transiciones de
página son solo `initial`/`animate` al montar (`PageTransition`), sin `exit` y sin
`AnimatePresence` a nivel de ruta. Chatbot y menú móvil usan `AnimatePresence` en
modo por defecto (sync) y van bien porque están fuera de las rutas.

## Animación

- Framer Motion. Curva del proyecto: `[0.16, 1, 0.3, 1]`. Duraciones 150–500 ms.
- Todo respeta `useReducedMotion()`.
- `Reveal` usa `viewport={{ once: true }}` — el contenido queda visible tras la
  primera aparición; no re-anima al volver a hacer scroll.

## Estado

Las 6 páginas construidas. Deploy temporal de Vercel hecho (caduca; para
permanente: `vercel login && vercel deploy`, o GitHub + vercel.com).

## Pendiente

- [ ] Rellenar marcadores: `[ciudad]`, `[teléfono]`, `[TU ESTUDIO]`, año de
      fundación, nombres reales del equipo, dirección, líneas de bus.
- [ ] Sustituir ilustraciones de monturas por fotos reales de producto.
- [ ] Mapa real en Contacto (embed Google Maps / OpenStreetMap).
- [ ] Conectar el formulario de cita (Supabase o Formspree).
- [ ] Mejorar la ilustración del hero de Inicio.
- [ ] Deploy permanente + dominio.
- [ ] Pase con `impeccable` cuando el contenido real esté puesto.
