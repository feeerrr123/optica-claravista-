import { randomUUID, randomBytes } from 'crypto'
import { supabaseAdmin } from '../_lib/supabaseAdmin.js'
import { modoDemo, cfg } from '../_lib/config.js'
import { crearEvento } from '../_lib/googleCalendar.js'
import { enviarEmail, plantillaConfirmacion } from '../_lib/email.js'
import { huecosDelDia, formatoDiaLargo } from '../../src/lib/horario.js'

const SERVICIOS_VALIDOS = [
  'Graduación de la vista',
  'Adaptación de lentes de contacto',
  'Gafas de sol graduadas',
  'Revisión visual infantil',
  'Aún no lo sé',
]

function validar(body) {
  const errores = []
  for (const campo of ['nombre', 'telefono', 'email', 'fecha', 'hora']) {
    if (!body[campo] || typeof body[campo] !== 'string') errores.push(campo)
  }
  if (body.fecha && !/^\d{4}-\d{2}-\d{2}$/.test(body.fecha)) errores.push('fecha')
  if (body.hora && !/^\d{2}:\d{2}$/.test(body.hora)) errores.push('hora')
  if (body.servicio && !SERVICIOS_VALIDOS.includes(body.servicio)) errores.push('servicio')
  return errores
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' })

  const body = req.body || {}
  const errores = validar(body)
  if (errores.length) return res.status(400).json({ error: 'Datos incompletos o inválidos.', campos: errores })

  const servicio = body.servicio || 'Aún no lo sé'
  const duracion = servicio === 'Adaptación de lentes de contacto' ? 45 : 30
  const { nombre, telefono, email, fecha, hora, mensaje = '' } = body

  // El hueco pedido tiene que existir de verdad en el horario de apertura.
  const fechaObj = new Date(`${fecha}T00:00:00`)
  if (!huecosDelDia(fechaObj, duracion).includes(hora)) {
    return res.status(400).json({ error: 'Ese hueco no existe en el horario de la óptica.' })
  }

  if (modoDemo()) {
    // Sin Supabase: no hay nada real que guardar. Devolvemos éxito simulado
    // para que la demo se pueda enseñar igualmente, dejándolo bien claro.
    return res.status(200).json({ demo: true, ok: true })
  }

  const token = randomBytes(16).toString('hex')
  const db = supabaseAdmin()

  const { data: fila, error } = await db
    .from('citas')
    .insert({ id: randomUUID(), nombre, telefono, email, servicio, mensaje, fecha, hora, duracion_min: duracion, token })
    .select()
    .single()

  if (error) {
    // La restricción única (fecha, hora) salta si alguien acaba de coger ese hueco.
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Ese hueco se acaba de reservar. Elige otro, por favor.' })
    }
    console.error('[citas:crear]', error.message)
    return res.status(500).json({ error: 'No se pudo guardar la cita.' })
  }

  const fechaLarga = formatoDiaLargo(fechaObj)
  const eventId = await crearEvento({
    fecha,
    hora,
    duracionMin: duracion,
    resumen: `${servicio} — ${nombre}`,
    descripcion: `Tel: ${telefono} · Email: ${email}${mensaje ? `\n${mensaje}` : ''}`,
  })
  if (eventId) await db.from('citas').update({ google_event_id: eventId }).eq('id', fila.id)

  const gestionUrl = cfg.appBaseUrl ? `${cfg.appBaseUrl}/cita/gestionar/${token}` : `/cita/gestionar/${token}`
  const envio = await enviarEmail({
    to: email,
    subject: 'Tu cita en Óptica Claravista',
    html: plantillaConfirmacion({ nombre, servicio, fechaLarga, hora, gestionUrl }),
  })

  return res.status(200).json({ demo: false, ok: true, token, emailEnviado: envio.enviado })
}
