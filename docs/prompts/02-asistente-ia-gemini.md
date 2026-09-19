# 2 · Asistente de IA con Gemini (chat flotante de soporte)

## Qué es y cuándo usarlo

Un chat flotante en toda la web que responde de verdad (no un guion de
preguntas fijas): sabe el horario y los servicios reales del negocio y contesta
dudas generales del sector. Usa la API de Gemini de Google, que tiene nivel
gratuito, y se llama **desde el servidor** para que la clave no llegue nunca al
navegador. Sirve para cualquier negocio; lo que cambia es el contenido y las
**reglas de seguridad del sector**.

Referencia en el repo: commit `486f862`. Archivos clave: `api/chat.js`,
`api/_lib/gemini.js`, `api/_lib/config.js`, `src/components/Chatbot.jsx`,
`src/data/chatbot.js`, y `horarioTexto()` en `src/lib/horario.js`.

## Antes de empezar (lo que tienes que hacer tú)

1. **Clave de Gemini**: en Google AI Studio (aistudio.google.com) → *Get API
   key*. No la pegues en el chat: ponla tú en `.env.local` y en Vercel como
   `GEMINI_API_KEY` (Production/Preview/Development).
2. **Comprueba tus límites gratuitos** en `aistudio.google.com/rate-limit`:
   varían según el modelo y la cuenta, y cambian con el tiempo.
3. Después de subir el código, **Redeploy** en Vercel para que lea la clave.

## El prompt

```text
Quiero añadir a la web de [NEGOCIO] ([TIPO DE NEGOCIO]) un asistente de
soporte con IA, usando la API gratuita de Gemini de Google.

PROYECTO DE REFERENCIA
Ya existe funcionando en producción en:
[RUTA LOCAL DEL REPO DE REFERENCIA]
Léelo y adáptalo: api/chat.js, api/_lib/gemini.js, api/_lib/config.js,
src/components/Chatbot.jsx, src/data/chatbot.js y la sección "Asistente con
IA" de su CLAUDE.md.

IMPORTANTE SOBRE LA API
La API de Gemini cambió: desde junio de 2026 el interfaz recomendado es la
Interactions API, y la antigua generateContent quedó como "legacy". No uses
ejemplos de memoria: consulta la documentación oficial actual
(ai.google.dev/gemini-api/docs) antes de escribir código. Usa el SDK oficial
@google/genai (el de referencia usa la versión 2.x; según su documentación, la
3.x exige Node 22 o superior). Verifica los nombres de los campos con una
llamada real desde Node ANTES de desplegar.

QUÉ DEBE HACER
1. Widget flotante en toda la web: botón que abre un diálogo con mensajes,
   caja de texto libre, indicador "Escribiendo…", y unas preguntas sugeridas
   (chips) que solo se ven antes del primer mensaje.
2. El navegador llama a NUESTRO endpoint POST /api/chat con
   { mensaje, interactionId }. Solo el servidor habla con Gemini. La clave
   (GEMINI_API_KEY) solo vive en variables de entorno del servidor.
3. El endpoint valida el mensaje (texto no vacío, máximo 500 caracteres) y
   devuelve { respuesta, interactionId, demo }. El interactionId se guarda en
   el cliente (useRef) y se reenvía para mantener el hilo; así no hace falta
   reenviar todo el historial.
4. La instrucción de sistema se construye con los datos REALES del negocio:
   - el horario derivado del archivo único de horarios (una función
     horarioTexto()), nunca copiado a mano;
   - los servicios con su duración (no se puede importar un archivo con JSX
     desde una función de servidor en Node puro: deja un resumen en texto y
     márcalo para mantenerlo sincronizado);
   - cómo pedir cita y el teléfono de contacto;
   - "no inventes precios: dependen del caso y se confirman en la cita".
5. REGLAS DURAS del sector (no negociables) — para este negocio:
   [ESCRÍBELAS SEGÚN EL SECTOR. Ejemplo de óptica:
    a) No diagnostica: da información general y educativa, deja claro que solo
       una revisión presencial da un diagnóstico y anima a pedir cita.
    b) Si describen síntomas graves (pérdida de visión repentina, dolor ocular
       fuerte, destellos o moscas volantes nuevas, golpe o químico en el ojo,
       visión doble repentina), dice claramente que necesita atención médica
       HOY, no una cita normal.
    c) Si no sabe algo, lo dice y ofrece el teléfono.
    d) Nunca afirma ser médico ni profesional sanitario.
   Otros sectores: dentista (mismas reglas médicas), abogado o gestoría (no da
   asesoramiento legal ni fiscal, solo orienta), taller (no diagnostica averías
   por chat), etc.]
6. Respuestas cortas (2-4 frases), tono cercano, siempre en [español].
7. Aviso visible dentro del chat: "Información general, no un [diagnóstico /
   asesoramiento]. Para tu caso, [pide cita]".
8. Si GEMINI_API_KEY no está configurada, el endpoint responde en "modo demo"
   con un aviso. Si Gemini falla, el chat muestra un mensaje amable y nunca
   rompe la web.
9. Accesibilidad: un aviso aria-live que anuncie cuándo llega la respuesta,
   la caja de texto con etiqueta, y compatibilidad con prefers-reduced-motion.
10. Modelo: usa un alias tipo "gemini-flash-latest" para no tener que
    actualizar la versión cada vez que Google saca un modelo nuevo.

CÓMO TRABAJAR
- Explícame el plan primero. Después construye.
- Prueba la llamada real a Gemini con un script de Node: una pregunta normal,
  una pregunta del sector y una que dispare la regla de urgencia. Enséñame las
  respuestas.
- Comprueba el widget en el navegador. Ojo: `npm run dev` no ejecuta /api; la
  prueba real del chat es en la web desplegada.
- Antes de decir que está listo, recuérdame que hay que hacer push y pegar la
  clave en Vercel.
```

## Tropiezos reales

- **"No puedo escribir nada en el chat" en la web publicada**: el código nuevo
  no se había subido a GitHub, así que Vercel seguía sirviendo el chatbot viejo
  (solo botones, sin caja de texto). Pista rápida: si el saludo del chat es el
  antiguo, es que falta el push.
- **API que cambió**: la documentación oficial ya recomendaba la Interactions
  API cuando esto se construyó. Ejemplos antiguos de generateContent ya no son
  la vía recomendada.
- **Nombres de campos mezclados**: en el SDK de JavaScript, el constructor usa
  `apiKey`, pero los campos de la petición van en snake_case
  (`system_instruction`, `previous_interaction_id`). Comprobado con una llamada
  real desde Node antes de desplegar.
- **JSX en el servidor**: no se puede importar `servicios.jsx` desde `/api`;
  hay un resumen escrito a mano en `api/_lib/gemini.js` que hay que mantener.
- **Horario desincronizado**: el guion antiguo tenía un horario distinto del
  real. Por eso el horario sale ahora de `horarioTexto()`, derivado del archivo
  único de horarios.
- **La primera respuesta tarda**: en producción llegó a tardar unos 15 s en el
  primer mensaje (arranque en frío de la función más la respuesta del modelo).

## Cómo comprobar que funciona

1. Script de Node contra la API real: "¿qué horario tenéis?" debe dar el
   horario correcto.
2. Pregunta general del sector: respuesta prudente, sin diagnosticar, que
   remite a pedir cita.
3. Síntoma grave: debe mandar a urgencias, no seguir la conversación.
4. En la web desplegada: abrir el chat, escribir una pregunta y ver la
   respuesta. Mirar en Vercel → Logs que no haya `[gemini] no se pudo responder`.

## Costes y límites

- Gemini gratis: el límite diario y por minuto depende del modelo y de tu
  cuenta; mira `aistudio.google.com/rate-limit`. Para el tráfico de un negocio
  local pequeño suele bastar.
- Sin protección contra abuso más allá de los 500 caracteres. **Antes de
  venderlo a un cliente**, añade un límite por IP y un tope de mensajes por
  conversación, para que nadie agote la cuota.
- **Fase 2 posible**: que el asistente reserve citas él mismo (function calling
  contra `/api/citas`). Al ser una acción con consecuencias reales, valora si
  el modelo sigue instrucciones con la fiabilidad suficiente y añade siempre una
  confirmación explícita del cliente antes de reservar.
