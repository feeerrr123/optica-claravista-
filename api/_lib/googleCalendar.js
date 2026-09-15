import { google } from 'googleapis'
import { cfg, googleListo } from './config.js'

function clienteCalendario() {
  const auth = new google.auth.OAuth2(cfg.googleClientId, cfg.googleClientSecret)
  auth.setCredentials({ refresh_token: cfg.googleRefreshToken })
  return google.calendar({ version: 'v3', auth })
}

// fecha 'YYYY-MM-DD', hora 'HH:MM', duracionMin: minutos.
// Devuelve el id del evento creado, o null si Google no está configurado o falla
// (una cita no debe perderse solo porque el calendario esté caído).
export async function crearEvento({ fecha, hora, duracionMin, resumen, descripcion }) {
  if (!googleListo()) return null
  try {
    const cal = clienteCalendario()
    const inicio = `${fecha}T${hora}:00`
    const [h, m] = hora.split(':').map(Number)
    const finMin = h * 60 + m + duracionMin
    const fin = `${fecha}T${String(Math.floor(finMin / 60)).padStart(2, '0')}:${String(finMin % 60).padStart(2, '0')}:00`
    const { data } = await cal.events.insert({
      calendarId: cfg.googleCalendarId,
      requestBody: {
        summary: resumen,
        description: descripcion,
        start: { dateTime: inicio, timeZone: 'Europe/Madrid' },
        end: { dateTime: fin, timeZone: 'Europe/Madrid' },
      },
    })
    return data.id || null
  } catch (err) {
    console.error('[google] no se pudo crear el evento:', err.message)
    return null
  }
}

export async function borrarEvento(eventId) {
  if (!googleListo() || !eventId) return
  try {
    const cal = clienteCalendario()
    await cal.events.delete({ calendarId: cfg.googleCalendarId, eventId })
  } catch (err) {
    console.error('[google] no se pudo borrar el evento:', err.message)
  }
}

export async function actualizarEvento(eventId, { fecha, hora, duracionMin, resumen, descripcion }) {
  if (!googleListo() || !eventId) return
  try {
    const cal = clienteCalendario()
    const inicio = `${fecha}T${hora}:00`
    const [h, m] = hora.split(':').map(Number)
    const finMin = h * 60 + m + duracionMin
    const fin = `${fecha}T${String(Math.floor(finMin / 60)).padStart(2, '0')}:${String(finMin % 60).padStart(2, '0')}:00`
    await cal.events.patch({
      calendarId: cfg.googleCalendarId,
      eventId,
      requestBody: {
        summary: resumen,
        description: descripcion,
        start: { dateTime: inicio, timeZone: 'Europe/Madrid' },
        end: { dateTime: fin, timeZone: 'Europe/Madrid' },
      },
    })
  } catch (err) {
    console.error('[google] no se pudo actualizar el evento:', err.message)
  }
}
