# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Comprador de la demo (audiencia real):** dueños de ópticas locales en España —
la persona a la que el usuario (un estudio que hace webs para negocios locales)
le va a enseñar este sitio en frío para venderle una web. Tiene que verlo y
pensar "quiero esto para mi óptica".

**Visitante del sitio que retrata:** persona que necesita revisarse la vista o
cambiar de gafas, casi siempre desde el móvil y desde búsqueda local / Google
Maps. Segundo perfil: padres que buscan revisión infantil.

## Product Purpose

Web de demostración multipágina de una óptica ficticia ("Óptica Claravista").
Sirve como pieza de portfolio / muestra de venta. Éxito = que un óptico real la
vea y quiera contratar una web así. Objetivo secundario: que funcione como
plantilla base reutilizable para clientes reales del nicho óptica/salud visual.

## Positioning

La óptica que retrata: "medimos con calma y no te vendemos de más". Óptica de
barrio, dos generaciones, mismo local desde 1998, seguimiento después de la
compra (ajuste de graduación gratis el primer mes). Frente a las cadenas: oficio,
trato y honestidad, no volumen ni promociones.

La demo en sí: se diferencia de la web-de-óptica genérica (azul médico, foto de
familia feliz, tres tarjetas) por tener un punto de vista y craft real.

## Operating Context

- Rituales del oficio que son materia real del sitio: la graduación / refracción
  ("¿mejor así o así?"), la receta (OD/OS, esfera, cilindro, eje), la caja de
  lentes de prueba, el frontofocómetro, el foróptero, la prueba de montura
  delante del espejo, el ajuste de varillas y plaquetas.
- El visitante llega con una duda concreta: "hace 3 años que no me reviso",
  "se me han roto", "el cole dice que el niño no ve bien".
- Se decide en segundos desde el móvil; la acción es **pedir cita**.

## Capabilities and Constraints

- **Stack (ya existe):** React 18 + Vite + Tailwind 3 + React Router 6 + Framer
  Motion. Deploy Vercel vía GitHub (`feeerrr123/optica-claravista-`). SPA rewrite
  en `vercel.json`.
- **Páginas:** Inicio, Servicios, Monturas (con filtros hombre/mujer/niño/sol),
  **Juegos para la vista**, Sobre nosotros, Pide cita, Contacto.
- **Juegos para la vista:** 4 mini-juegos en canvas (color, agudeza, contraste,
  visión 3D), de fácil a difícil, con progreso guardado y un "carné visual" final
  compartible. **Son juegos, no diagnóstico** — aviso visible en cada uno y en el
  carné; el resultado nunca afirma un valor clínico. Convierten hacia "pide cita".
- **Formulario de cita:** hoy solo UI (muestra confirmación, no envía). Pendiente
  conectar a Supabase (tabla `leads`, como en Óptica Nazareth) o Formspree —
  **después** de cerrar el diseño.
- **Chatbot:** widget flotante con FAQ predefinidas, sin IA ni backend.
- **Regla de color/tema:** paleta centralizada en variables CSS (`src/index.css`,
  canal RGB) para poder recolorear rápido.
- **framer-motion:** no anidar `AnimatePresence mode="wait"` (rompió form, filtro
  y navegación; documentado en CLAUDE.md).
- **Imágenes reales:** el usuario las quiere. Serán stock verificado (Unsplash /
  Pexels de gafas, examen visual, montura, taller), marcadas como material de
  sustitución. Un catálogo de monturas real puede servir de referencia de datos.

## Brand Commitments

- Nombre provisional: **Óptica Claravista** (cambiable).
- **Marca ficticia** — el footer lo dice: "marca ficticia · proyecto de
  demostración · diseño de [TU ESTUDIO]".
- Referencias visuales que el usuario ha hecho vinculantes (sin expandir aquí):
  **superpower.com**, **seed.com**, **fixaplan.com**. Registro literal; la
  dirección visual se decide en new-work.
- Ambición declarada por el usuario: audaz — "que diga *quiero esto*", no
  "que un óptico conservador lo apruebe".
- Marcadores a rellenar con datos reales: `[ciudad]`, `[provincia]`, `[teléfono]`,
  `[calle y número]`, `[código postal]`, `[TU ESTUDIO]`, año de fundación,
  nombres del equipo, líneas de autobús.

## Evidence on Hand

- No hay óptica real detrás. **No inventar como reales:** reseñas con nombre y
  apellido, certificaciones concretas, acuerdos con marcas, premios, JSON-LD /
  OG con datos de un negocio real.
- Cifras de negocio (nº de clientes, valoración, años) van marcadas "dato de
  ejemplo" en la propia página.
- Se puede tomar un catálogo de monturas real solo como referencia de nombres,
  materiales y rangos de precio plausibles.

## Product Principles

1. **La acción es pedir cita.** Todo lo demás sostiene esa decisión; la cita
   tiene que estar siempre a un clic.
2. **Demostrar el oficio, no afirmarlo.** Enseñar cómo se mide y cómo se elige
   montura, con especificidad que una cadena no puede copiar y pegar.
3. **Móvil primero de verdad.** La mayoría entra desde el teléfono tras una
   búsqueda local.
4. **Honestidad como producto.** Nada de promesas redondas, ventas cruzadas ni
   urgencia falsa; el tono es de consulta que te cuida.
5. **Reutilizable.** Contenido real intercambiable por marcadores claros; el
   sistema visual debe aguantar el cambio de negocio.

## Accessibility & Inclusion

Público general y mayores incluidos: contraste alto, tipografía legible a tamaño
grande, objetivos táctiles amplios, foco visible, `prefers-reduced-motion`
respetado. La revisión infantil implica también a familias.
