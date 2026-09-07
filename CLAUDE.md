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
RGB** (`"37 99 235"`). Tailwind las consume con `rgb(var(--c-x) / <alpha-value>)`,
así que `bg-primary`, `text-ink`, `bg-primary/10`, etc. funcionan.

Para reshadear la web entera: cambiar ~10 líneas del `:root`. Hay 2 variantes de
ejemplo comentadas en el archivo (B "clínica cálida", C "azul noche").

## Animación

- Framer Motion. Curva del proyecto: `[0.16, 1, 0.3, 1]`. Duraciones 150–500 ms.
- Todo respeta `useReducedMotion()`.
- `Reveal` usa `viewport={{ once: true }}` — el contenido queda visible tras la
  primera aparición; no re-anima al volver a hacer scroll.

## Pendiente (iterar página a página)

- [ ] Elegir paleta definitiva (ver recomendaciones que te pasé en el chat).
- [ ] Página **Servicios** (detalle de cada uno).
- [ ] Página **Monturas** (grid + filtros hombre/mujer/niño/sol, imágenes de muestra).
- [ ] Página **Sobre nosotros** (historia, equipo, valores).
- [ ] Página **Pide cita** (formulario UI: nombre, teléfono, email, servicio, fecha).
- [ ] Página **Contacto** (mapa placeholder, horario, WhatsApp, dirección).
- [ ] Rellenar `[ciudad]`, `[teléfono]`, `[TU ESTUDIO]`, año de fundación.
- [ ] Mejorar la ilustración del hero (ahora es un SVG básico).
- [ ] Revisar con `impeccable` cuando el diseño visual esté más cerca del final.
