// Horario de apertura y huecos de cita de Óptica Claravista.
// L–V 9:30–13:30 y 16:30–19:00 · Sábado 10:00–13:00 · Domingo cerrado.
// Horas en minutos desde las 00:00 para no arrastrar objetos Date de más.

const TRAMOS = {
  1: [[570, 810], [990, 1140]], // lunes
  2: [[570, 810], [990, 1140]], // martes
  3: [[570, 810], [990, 1140]], // miércoles
  4: [[570, 810], [990, 1140]], // jueves
  5: [[570, 810], [990, 1140]], // viernes
  6: [[600, 780]], // sábado 10:00–13:00
  0: [], // domingo, cerrado
}

export const DURACION_DEFECTO = 30 // minutos

const pad = (n) => String(n).padStart(2, '0')
const minutosAHora = (m) => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`

export function abierto(fecha) {
  return (TRAMOS[fecha.getDay()] || []).length > 0
}

// Huecos de `duracion` minutos que caben en los tramos de ese día.
export function huecosDelDia(fecha, duracion = DURACION_DEFECTO) {
  const tramos = TRAMOS[fecha.getDay()] || []
  const huecos = []
  for (const [ini, fin] of tramos) {
    for (let m = ini; m + duracion <= fin; m += duracion) {
      huecos.push(minutosAHora(m))
    }
  }
  return huecos
}

// Hash determinista (misma fecha+hora siempre da el mismo resultado) para
// simular que algunos huecos ya están reservados, sin backend de verdad.
function hash(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0
  return Math.abs(h)
}

export function ocupado(fecha, hora) {
  return hash(`${fecha.toDateString()}_${hora}`) % 5 === 0 // ~1 de cada 5
}

// Próximos `n` días con apertura, empezando mañana.
export function proximosDiasAbiertos(n, desde = new Date()) {
  const dias = []
  const cursor = new Date(desde)
  cursor.setDate(cursor.getDate() + 1)
  cursor.setHours(0, 0, 0, 0)
  let tope = 0
  while (dias.length < n && tope < n * 3) {
    if (abierto(cursor)) dias.push(new Date(cursor))
    cursor.setDate(cursor.getDate() + 1)
    tope++
  }
  return dias
}

const sinPunto = (s) => s.replace('.', '')

export const formatoDiaCorto = (fecha) => ({
  semana: sinPunto(fecha.toLocaleDateString('es-ES', { weekday: 'short' })),
  dia: fecha.getDate(),
  mes: sinPunto(fecha.toLocaleDateString('es-ES', { month: 'short' })),
})

export const formatoDiaLargo = (fecha) =>
  sinPunto(fecha.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }))

// 'YYYY-MM-DD' en el calendario LOCAL del visitante (no usar toISOString: eso
// pasa a UTC y en España puede devolver el día anterior de madrugada).
export const fechaISO = (fecha) => `${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-${pad(fecha.getDate())}`

/* ── Ventana de 12h para cambiar/cancelar — misma lógica en cliente y servidor ──
 * Se compara todo como "hora de pared de Madrid" para no depender de en qué
 * huso horario corre el proceso (el servidor de Vercel corre en UTC). Un
 * cambio de hora oficial justo en las 12h del límite puede desviarse una
 * hora; aceptable para una demo, a revisar si esto pasa a producción. */
const ZONA = 'Europe/Madrid'
const VENTANA_MS = 12 * 60 * 60 * 1000

function comoInstante(fechaISOStr, horaHHMM) {
  return new Date(`${fechaISOStr}T${horaHHMM}:00Z`).getTime()
}

function ahoraEnZona() {
  const partes = new Intl.DateTimeFormat('en-CA', {
    timeZone: ZONA,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(new Date())
  const p = Object.fromEntries(partes.map((x) => [x.type, x.value]))
  return comoInstante(`${p.year}-${p.month}-${p.day}`, `${p.hour}:${p.minute}`)
}

// ¿Se puede cambiar/cancelar todavía? (quedan más de 12h para la cita)
export function puedeGestionar(fechaISOStr, horaHHMM) {
  return ahoraEnZona() < comoInstante(fechaISOStr, horaHHMM) - VENTANA_MS
}
