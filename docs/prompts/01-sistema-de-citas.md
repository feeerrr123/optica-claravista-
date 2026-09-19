# 1 · Sistema de citas online (Supabase + Google Calendar + Resend)

## Qué es y cuándo usarlo

Reserva de citas de verdad para un negocio local: el cliente elige día y hora
en un calendario, la cita se guarda en una base de datos, aparece en el Google
Calendar del negocio y le llega un email con un enlace para cambiarla o
cancelarla hasta 12 h antes. Sirve para cualquier negocio con citas (óptica,
dentista, peluquería, fisio, taller...).

Referencia en el repo: commit `fa17670`. Archivos clave: `src/pages/Cita.jsx`,
`src/components/Agenda.jsx`, `src/pages/GestionarCita.jsx`,
`src/lib/horario.js`, `src/lib/api.js`, carpeta `api/`, `supabase/schema.sql`,
`scripts/autorizar-google.mjs`, `vercel.json`, `.env.example`.

## Antes de empezar (lo que tienes que hacer tú)

Claude no crea cuentas ni maneja contraseñas. Tú:

1. **Supabase** — crea un proyecto. Cuando Claude te dé `supabase/schema.sql`,
   pégalo en el SQL Editor y ejecútalo ("Success. No rows returned" es lo
   correcto). Luego necesitas:
   - **Project URL**: `https://<Project ID>.supabase.co` (el Project ID sale en
     Settings → General; no aparece como campo aparte).
   - **Clave `service_role`**: Settings → API Keys → pestaña **"Legacy anon,
     service_role API keys"**. Es la que usa el código; no la `anon`.
2. **Google Cloud** — proyecto nuevo, activar **Google Calendar API**, y en
   **Google Auth Platform**: botón *Comenzar*, nombre de la app, tipo de
   público **Externo**, añadir como **usuario de prueba** el email de la cuenta
   cuyo calendario se usará. En *Clientes* → crear cliente → **Aplicación web**
   con la URI de redireccionamiento `http://localhost:3939/oauth2callback`.
   Copia el Client ID y el Client Secret en ese momento: el secreto no se
   puede volver a ver.
3. **Autorizar el calendario**: con Client ID y Secret en `.env.local`, corre
   `npm run autorizar:google`, abre el enlace que imprime con la cuenta del
   negocio, pulsa *Avanzado → Ir a ... (no seguro)* y acepta. El script guarda el
   `GOOGLE_REFRESH_TOKEN`.
4. **Resend** — cuenta gratuita → API Keys → crear clave (`re_...`, solo se ve
   una vez).
5. **Vercel** — pega las variables de entorno **todas de golpe en formato
   `.env`** en el campo "Key" del modal *Add Environment Variable* (las separa
   solo; a mano se cuelan errores), marca Production/Preview/Development y
   **haz Redeploy** (los cambios de variables no se aplican solos).

## El prompt

```text
Quiero montar un sistema de citas online con backend real para [NEGOCIO], un
[TIPO DE NEGOCIO] en [CIUDAD].

DATOS DEL NEGOCIO
- Horario: [p. ej. L-V 9:30-13:30 y 16:30-19:00; sábado 10:00-13:00; domingo cerrado]
- Servicios y duración de cada uno: [p. ej. graduación 30 min, lentillas 45 min]
- Zona horaria: [Europe/Madrid]
- Teléfono que se muestra cuando ya no se puede gestionar online: [TELÉFONO]
- Idioma de la web y de los emails: [español]

PROYECTO DE REFERENCIA
Ya existe este sistema funcionando en producción en:
[RUTA LOCAL DEL REPO DE REFERENCIA, p. ej. C:\Claude Proyectos\demos-web\optica-claravista]
Léelo antes de proponer nada, y copia y adapta en vez de reescribir. Mira en
concreto: src/pages/Cita.jsx, src/components/Agenda.jsx,
src/pages/GestionarCita.jsx, src/lib/horario.js, src/lib/api.js, la carpeta
api/, supabase/schema.sql, scripts/autorizar-google.mjs, vercel.json,
.env.example y la sección "Pide cita" de su CLAUDE.md.

QUÉ DEBE HACER
1. Tres pasos: datos del cliente (nombre, teléfono, email, servicio, mensaje,
   con validación propia) → elegir día y hora → confirmación. Anuncia cada
   paso con un aviso aria-live.
2. El calendario muestra los próximos 12 días abiertos (salta los cerrados) y
   una rejilla de huecos cuya duración depende del servicio elegido. La
   disponibilidad real sale del servidor; si falla, cae a huecos de muestra.
3. El horario vive en UN solo archivo, src/lib/horario.js, en JavaScript puro
   (sin JSX) porque lo importan a la vez el navegador y las funciones de
   servidor por ruta relativa. Cambiar el horario = tocar un objeto ahí.
4. Backend en funciones serverless de Vercel dentro de /api:
   - GET /api/disponibilidad?fecha=&duracion=
   - POST /api/citas (crear)
   - GET/PATCH/DELETE /api/citas/:token (ver, cambiar, cancelar)
   - _lib/config.js (lee variables de entorno y decide el "modo demo"),
     _lib/supabaseAdmin.js, _lib/googleCalendar.js, _lib/email.js.
5. Base de datos en Supabase, tabla `citas`, con: índice único parcial sobre
   (fecha, hora) donde estado = 'confirmada' (así el doble booking es
   imposible a nivel de base de datos, no solo de código), un token único por
   cita para el enlace de gestión, RLS activado SIN políticas (solo se accede
   con la clave service_role desde el servidor; esa clave jamás va al
   navegador).
6. Cambiar o cancelar solo hasta 12 h antes. La comprobación se hace SIEMPRE en
   el servidor, con la hora real de la zona horaria del negocio (no la del
   reloj del proceso: Vercel corre en UTC), usando Intl.DateTimeFormat con
   formatToParts. Pasado el límite, el servidor responde 403 y la página
   muestra "llama al [teléfono]". Cancelar = estado 'cancelada' (no se borra la
   fila) y se libera el hueco.
7. Al reservar: guardar en Supabase, crear el evento en Google Calendar y
   mandar el email de confirmación con Resend (llamada REST con fetch, sin
   SDK), con el enlace /cita/gestionar/:token. Google y el email son "best
   effort": si fallan, la cita se guarda igual y el fallo se registra con
   console.error. Al cambiar o cancelar, se actualiza o borra el evento.
8. Si el usuario cambia sus datos al volver atrás tras reservar, el PATCH debe
   aplicar también esos campos, no perderlos.
9. "Modo demo": si falta la configuración de Supabase, las rutas simulan éxito
   y la pantalla lo dice claramente. Nada debe romperse.
10. Un envoltorio peticionJSON que compruebe el Content-Type: en `vite dev` las
    rutas /api NO se ejecutan (se sirve el código fuente) y no debe
    interpretarse como éxito.
11. vercel.json con el rewrite de SPA EXCLUYENDO /api. .gitignore con .env y
    .env.* (salvo .env.example). Un .env.example documentando todas las
    variables: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN, GOOGLE_CALENDAR_ID,
    RESEND_API_KEY, RESEND_FROM, APP_BASE_URL, TELEFONO_CONTACTO.

CÓMO TRABAJAR
- Primero explícame el plan y confirma conmigo. Después construye.
- Prueba la lógica de negocio directamente en Node con req/res simulados
  (modo demo, hueco inválido, ventana de 12 h con +13 h y +6 h).
- Dime con claridad qué NO has podido probar en vivo (Google, Supabase y
  Resend necesitan mis cuentas).
- Guíame paso a paso, con los nombres exactos de los botones, para las cuentas.
```

## Tropiezos reales (léelos antes de empezar)

- **Nombre mal escrito en Vercel**: se guardó `SUPABASE_KEY` en vez de
  `SUPABASE_URL` y el sitio siguió en modo demo. Pega las variables en bloque.
- **`invalid_client` de Google** en los logs: el Client Secret llevaba una "I"
  mayúscula confundida con una "l" minúscula. Ante `invalid_client`, revisa el
  secreto carácter a carácter (o vuelve a pegar el bloque completo).
- **Dónde ver el error de verdad**: Vercel → Deployments → el deploy → **Logs**,
  filtrando por Error. Ahí sale `[google] no se pudo crear el evento: ...`.
- **La reserva funciona pero no hay evento**: Google y el email son "best
  effort", así que la web parece ir bien aunque estén rotos. Mira los logs.
- **Redeploy no basta**: si cambiaste código, hay que hacer push. "Redeploy"
  solo repite el commit anterior con las variables nuevas.
- **`.env.local` duplicado**: `autorizar:google` añade `GOOGLE_REFRESH_TOKEN` al
  final del archivo; si ya había una línea vacía, quedan dos y la primera gana.
- **El email cae en spam** con el remitente de pruebas `onboarding@resend.dev`.
  Con ese remitente, Resend normalmente solo entrega al email de tu propia
  cuenta hasta que verifiques un dominio.
- **En Vercel, "Needs Attention"** junto a una variable es solo la
  recomendación de guardarla como Secret; no es un error.
- **`npm run dev` no ejecuta `/api`**. Para probar de verdad hace falta la web
  desplegada (o `vercel dev`, que exige `vercel login`).

## Cómo comprobar que funciona

1. Reserva una cita de prueba en la web desplegada. Ya no debe decir "Demo" y
   debe aparecer el enlace "Gestionar esta cita".
2. Supabase → Table Editor → `citas`: la fila está, con estado `confirmada`.
3. El evento aparece en el Google Calendar de la cuenta autorizada.
4. Llega el email (mira spam).
5. Desde el enlace de gestión: cambia el día/hora (el evento se mueve, no se
   duplica) y cancela (el evento desaparece y la fila pasa a `cancelada`).
6. Prueba una cita a menos de 12 h: debe bloquear el cambio con el mensaje del
   teléfono.

## Costes y límites

- **Vercel**: el plan Hobby (gratis) es para proyectos personales; para un
  cliente que paga hace falta Pro (~20 $/mes), y ese coste es **por cuenta**, no
  por cliente.
- **Resend gratis**: 100 emails al día y 3.000 al mes; sobra para una óptica de
  barrio.
- **Supabase gratis**: pausa el proyecto tras unos 7 días sin actividad. Con
  poco tráfico, las reservas pueden fallar hasta reactivarlo a mano. Pro (~25 $/mes)
  lo evita y se paga **por proyecto**.
- **Google en modo prueba**: el refresh token caduca a los 7 días; hay que
  repetir `npm run autorizar:google`. Para un cliente de pago: verificar la app
  ante Google (se hace una vez por aplicación de Google Cloud) o pasar por
  Zapier/Make, que ya tienen su integración verificada.
