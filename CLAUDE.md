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
    Chatbot.jsx       widget flotante con IA real (Gemini), ver sección propia abajo
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

## Pide cita (`/cita`) — flujo de 3 pasos, con backend real

`src/pages/Cita.jsx`: **datos → calendario → confirmación**, con un stepper
igual en estilo al de Juegos. Desde esta sesión ya no es solo frontend: hay
funciones de servidor (`/api`) que hablan con Supabase, Google Calendar y
Resend. **Todo tiene "modo demo" de reserva**: si falta configuración, las
rutas simulan éxito en vez de romperse — así la demo pública sigue enseñable
mientras se termina de conectar todo.

1. **Tus datos**: nombre, teléfono, email, servicio, mensaje. Validación propia.
   Al enviar, se guardan en estado (`datos`) y se pasa al paso 2.
2. **Día y hora**: `<Agenda>` (`src/components/Agenda.jsx`). Tira horizontal de
   los próximos 12 días **abiertos** (salta domingos) y la rejilla de huecos
   del día. La duración sale del servicio del paso 1 (lentillas → 45 min, el
   resto → 30). La disponibilidad real se pide a `GET /api/disponibilidad`;
   si falla o no hay backend, cae al hash local de siempre (mismo aspecto,
   claramente marcado "huecos de muestra").
3. **Confirmación**: al elegir hora, `POST /api/citas` — guarda en Supabase,
   crea el evento en Google Calendar y manda el email con Resend (los tres
   "best effort": si Google o el email fallan, la cita se guarda igual). El
   texto de la pantalla cambia según `resultado.demo`. Desde aquí: "Cambiar
   día u hora" (reutiliza `PATCH /api/citas/:token`, sin perder los datos) o
   "Pedir otra cita" (reinicia todo).

**`/cita/gestionar/:token`** (`src/pages/GestionarCita.jsx`): el cliente ve su
cita, y si quedan más de 12h puede cambiarla (`PATCH`) o cancelarla (`DELETE`
→ `estado='cancelada'`, libera el hueco, borra el evento de Google). Con menos
de 12h, el servidor devuelve 403 y la página muestra "llama al [teléfono]" —
**la ventana de 12h se comprueba siempre en el servidor**, nunca solo en el
navegador (`puedeGestionar()` en `horario.js`, en hora de Madrid de verdad, no
la del reloj del proceso — Vercel corre en UTC).

`src/lib/horario.js` es la fuente de verdad del horario —
**L–V 9:30–13:30 y 16:30–19:00 · Sábado 10:00–13:00 · Domingo cerrado** — y la
comparten el cliente y las funciones de `/api` (import relativo directo,
mismo archivo, cero duplicación). Cambiar el horario de la óptica es tocar
`TRAMOS` una vez, ahí.

Aviso: `role="status" aria-live="polite"` (`anuncio`) anuncia cada cambio de
paso, igual que en Juegos.

### El backend (`/api`)

```
api/
  _lib/config.js          lee las env vars, decide si estamos en "modo demo"
  _lib/supabaseAdmin.js   cliente de Supabase con la clave de SERVICIO (nunca la anon)
  _lib/googleCalendar.js  crear/actualizar/borrar evento (googleapis + refresh token)
  _lib/email.js           enviarEmail() vía REST de Resend, sin SDK
  disponibilidad.js       GET  /api/disponibilidad?fecha=&duracion=
  citas/index.js          POST /api/citas   (crear)
  citas/[token].js        GET/PATCH/DELETE /api/citas/:token  (ver/cambiar/cancelar)
supabase/schema.sql       tabla `citas` — pegar una vez en el SQL Editor de Supabase
scripts/autorizar-google.mjs  autorización de Google Calendar (se corre EN TU máquina, no aquí)
.env.example              todas las variables que hacen falta, documentadas
```

**Variables de entorno** (Vercel → Settings → Environment Variables; local →
copiar `.env.example` a `.env.local`, nunca subir el real): `SUPABASE_URL`,
`SUPABASE_SERVICE_ROLE_KEY`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`,
`GOOGLE_REFRESH_TOKEN`, `GOOGLE_CALENDAR_ID`, `RESEND_API_KEY`, `RESEND_FROM`,
`APP_BASE_URL`, `TELEFONO_CONTACTO`, `GEMINI_API_KEY` (esta última para el
asistente con IA, ver su sección propia más abajo — Google AI Studio,
aistudio.google.com, gratis).

**Puesta en marcha** (por orden):
1. Supabase: crear proyecto → pegar `supabase/schema.sql` en el SQL Editor →
   copiar `Project URL` y la clave **`service_role`** (Settings → API).
2. Google Cloud: proyecto nuevo → activar "Calendar API" → pantalla de
   consentimiento OAuth en modo prueba (añadirte como test user) → crear
   credenciales OAuth ("Web application", redirect URI
   `http://localhost:3939/oauth2callback`) → `npm run autorizar:google` en tu
   propio ordenador con `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` en
   `.env.local` → abrir el enlace que imprime, aceptar con la cuenta del
   calendario de la óptica → copia el `GOOGLE_REFRESH_TOKEN` que suelta.
3. Resend: cuenta gratuita → API Key.
4. Pegar las 10 variables en Vercel y volver a desplegar.

**Importante — modo prueba de Google**: mientras la app no esté verificada
por Google, el refresh token caduca cada 7 días; toca correr
`autorizar:google` otra vez. Para un cliente real que paga, hace falta pasar
la app a producción (verificación de Google) o meter Zapier/Make en medio
(su integración con Google ya está verificada, sin esta caducidad).

**Límite de las pruebas en local**: `npm run dev` (Vite puro) NO ejecuta
`/api/*` como funciones — solo sirve el código fuente tal cual, así que
`fetch('/api/...')` no devuelve JSON real. El frontend lo detecta
(`peticionJSON` en `src/lib/api.js` comprueba el `Content-Type`) y falla con
un aviso en vez de fingir éxito. Para probar el flujo de verdad hace falta
`vercel dev` (necesita `vercel login`) o la web ya desplegada en Vercel.

## Asistente con IA (`Chatbot.jsx`, flotante en toda la web)

El chatbot ya no es un guion fijo de preguntas y respuestas — responde de
verdad con **Gemini (API gratuita de Google)**, vía la **Interactions API**
(la interfaz que Google recomienda desde junio de 2026; la antigua
`generateContent` sigue funcionando pero ya no es la recomendada — si se
retoca esto en el futuro, comprobar la documentación oficial antes de copiar
ejemplos viejos).

- `src/data/chatbot.js` — solo el saludo inicial y las preguntas sugeridas
  que aparecen como chips al abrir el chat (antes tenían también la
  respuesta fija; ya no hace falta, la genera el modelo).
- `src/components/Chatbot.jsx` — input de texto libre + chips de preguntas
  sugeridas (solo visibles antes del primer mensaje). Llama a
  `POST /api/chat` con `{ mensaje, interactionId }` vía `peticionJSON`;
  guarda el `interactionId` que devuelve Gemini para mantener el hilo de la
  conversación entre mensajes (no reenviamos el historial completo, Google
  lo guarda del lado del servidor).
- `api/chat.js` — valida el mensaje (no vacío, máx. 500 caracteres) y llama a
  `responderChat()`. Si `GEMINI_API_KEY` no está configurada, responde en
  "modo demo" con un aviso, igual que el resto del backend.
- `api/_lib/gemini.js` — construye la instrucción de sistema con los datos
  reales de la óptica (horario derivado de `horarioTexto()` en `horario.js`,
  para que nunca se desincronice como le pasó al guion viejo; servicios
  resumidos a mano porque `servicios.jsx` tiene JSX y no se puede importar
  desde una función de servidor en Node puro) y llama a
  `ai.interactions.create({ model, input, system_instruction,
  previous_interaction_id })` con el SDK oficial `@google/genai`.

**Regla dura, no negociable**: el asistente contesta dudas oculares
generales (ej. "¿es normal no ver bien mi móvil de cerca?") de forma
educativa, pero **nunca diagnostica** y siempre remite a pedir cita para
saber de verdad qué pasa — mismo espíritu que el `<Aviso>` de los Juegos.
Además, tiene una regla explícita de derivar a urgencias médicas de verdad
ante síntomas que suenen graves (pérdida de visión repentina, destellos de
luz nuevos, dolor ocular fuerte, trauma) — probado en local antes de
desplegar y responde correctamente. La instrucción completa está en
`construirInstruccion()` dentro de `api/_lib/gemini.js`; cualquier cambio de
tono o alcance se toca ahí, en un único sitio.

**Por qué Gemini y no Claude aquí**: cuota gratuita mucho más generosa para
un volumen bajo (un chatbot de una óptica de barrio), que encaja con el
resto de la infraestructura (todo pensado para aguantar en el nivel
gratuito el mayor tiempo posible). Si en el futuro se añade una Fase 2 (que
el propio chatbot reserve la cita, con function calling contra
`/api/citas`), conviene revisar si la fiabilidad de Gemini seguir
instrucciones complejas es suficiente para esa acción con consecuencias
reales, o si compensa cambiar de modelo para esa pieza en concreto.

**Sin probar en producción todavía**: probado en local contra la API real de
Gemini (llamada directa, sin pasar por `/api`, porque `npm run dev` no
ejecuta funciones de servidor) — funciona, con horario correcto y las dos
reglas de seguridad (no diagnóstico, derivar a urgencias) comportándose bien.
Falta pegar `GEMINI_API_KEY` en Vercel y volver a desplegar para probarlo de
verdad end-to-end en el sitio público.

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
  La prop `pulso` (solo activa en el "VES" de la portada) hace que los puntos rojos
  latan de intenso a claro cada ~2,6 s una vez resuelta la lámina: `PULSE_DEPTH` es
  el tope de cuánto se aclaran — subirlo hasta acercarse a 1 haría que el rojo se
  confunda con el fondo y se pierda la palabra. Solo corre con movimiento permitido,
  pestaña visible y lámina en pantalla.
  La prop `interactivo` (también solo en el "VES" de la portada) hace que el cursor
  o el dedo aparten los puntos cercanos (repulsión + muelle, `PUSH`/`SPRING`/`DAMP`)
  y los iluminen (`GLOW`). Es siempre transitorio: en reposo todos los offsets son
  exactamente 0. No quitar `snapBack` (temporizador de 1,6 s que devuelve todo a su
  sitio si el bucle se atasca con puntos desplazados) ni el gate de
  `prefers-reduced-motion`. Los eventos son de puntero sin `preventDefault`, para
  no romper el scroll vertical en móvil.
  En el panel de vista previa de Claude `requestAnimationFrame` no dispara, así que
  allí ni el latido ni la interacción se ven: para probarlos, sustituir
  `requestAnimationFrame` por un `setTimeout`, volver a montar la portada
  (navegar a otra ruta y volver) y lanzar `PointerEvent` sobre el contenedor.
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
decorativo, banda de cifras con filete en vez de grid genérico.

**Backend de citas: Supabase, Google Calendar y Resend verificados en vivo en
producción** (ver sección "Pide cita" arriba) — el checklist de puesta en
marcha está cerrado del todo. Reserva real de prueba hecha en `/cita` en el
sitio desplegado: se guardó en la tabla `citas` de Supabase (confirmado en el
Table Editor), creó el evento en el Google Calendar de la cuenta autorizada
(confirmado visualmente) y llegó el email de confirmación (a spam la primera
vez — normal con el remitente de pruebas `onboarding@resend.dev` sin dominio
propio verificado).

Un par de tropiezos reales durante la puesta en marcha, por si se repiten con
otro cliente: (1) al añadir las env vars a mano en Vercel es fácil escribir
mal el nombre de la key (pasó con `SUPABASE_KEY` en vez de `SUPABASE_URL`) —
mejor pegar todas de golpe en formato `.env` en el campo "Key" del modal de
Vercel, que las separa solo; (2) `googleapis` devuelve `invalid_client` si el
Client ID/Secret no coinciden exactamente con los de Google Cloud — un
carácter mal copiado basta (nos pasó con una "I" mayúscula confundida con
"l" minúscula). Se depura mirando **Vercel → Deployments → [el deploy] →
Logs**, filtrando por Error: ahí aparece el `console.error` con el motivo
exacto (`[google] no se pudo crear el evento: ...`).

## Pendiente

- [ ] Rellenar marcadores con datos de una óptica real para el pitch.
- [ ] Sustituir fotos de muestra por fotos reales del cliente.
- [ ] Mapa real en Contacto (embed).
- [x] Crear el proyecto de Supabase real y pegar `supabase/schema.sql`.
- [x] Crear el proyecto de Google Cloud y correr `npm run autorizar:google`
      con el calendario de prueba (ver checklist en "Pide cita" arriba).
- [x] Crear cuenta de Resend y pegar la API key.
- [x] Probar el flujo entero en vivo: reservar, cambiar día/hora y cancelar,
      confirmando en cada paso que Supabase y Google Calendar reflejan bien
      el cambio (evento movido, no duplicado; fila en `estado='cancelada'`,
      no borrada) y que llega el email. Todo probado en producción y OK.
      El bloqueo real a <12h sigue solo probado a nivel de lógica
      (`puedeGestionar()`, test de Node: +13h permite, +6h bloquea) — probarlo
      en vivo con una cita real a menos de 12h es opcional, no bloqueante.
- [ ] Decidir, antes de vender esto a un cliente real: ¿verificar la app ante
      Google, o meter Zapier/Make en medio? (ver la conversación sobre esto:
      en modo prueba el token de Google caduca cada 7 días).
- [ ] Pegar `GEMINI_API_KEY` en Vercel y volver a desplegar — probado en
      local contra la API real (ver sección "Asistente con IA" arriba), pero
      falta la prueba end-to-end en el sitio público a través de `/api/chat`.
- [ ] Panel privado del dueño (`/admin`, con login de Supabase Auth) — sobre
      la mesa como siguiente proyecto grande, todavía sin empezar.
- [ ] Revisar `DotField` en anchos intermedios (trazos anchos en bandas apaisadas).
- [ ] Confirmar el deploy de Vercel conectado al repo.
