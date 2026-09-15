import { supabaseAdmin } from '../_lib/supabaseAdmin.js'
import { modoDemo, cfg } from '../_lib/config.js'
import { borrarEvento, actualizarEvento } from '../_lib/googleCalendar.js'
import { huecosDelDia, formatoDiaLargo, puedeGestionar } from '../../src/lib/horario.js'

async function buscarCita(db, token) {
  const { data, error } = await db.from('citas').select('*').eq('token', token).maybeSingle()
  if (error) throw error
  return data
}

export default async function handler(req, res) {
  const { token } = req.query

  if (modoDemo()) {
    return res.status(404).json({ error: 'La gestión de citas necesita Supabase configurado (estamos en modo demo).' })
  }

  const db = supabaseAdmin()

  try {
    const cita = await buscarCita(db, token)
    if (!cita || cita.estado === 'cancelada') {
      return res.status(404).json({ error: 'No encontramos esa cita, o ya está cancelada.' })
    }

    if (req.method === 'GET') {
      return res.status(200).json({
        nombre: cita.nombre,
        servicio: cita.servicio,
        fecha: cita.fecha,
        hora: cita.hora.slice(0, 5),
        duracionMin: cita.duracion_min,
        fechaLarga: formatoDiaLargo(new Date(`${cita.fecha}T00:00:00`)),
        puedeGestionar: puedeGestionar(cita.fecha, cita.hora.slice(0, 5)),
        telefonoContacto: cfg.telefonoContacto,
      })
    }

    if (!puedeGestionar(cita.fecha, cita.hora.slice(0, 5))) {
      return res.status(403).json({
        error: `Ya no se puede gestionar por aquí (menos de 12h). Llama al ${cfg.telefonoContacto}.`,
      })
    }

    if (req.method === 'DELETE') {
      const { error } = await db.from('citas').update({ estado: 'cancelada' }).eq('id', cita.id)
      if (error) throw error
      await borrarEvento(cita.google_event_id)
      return res.status(200).json({ ok: true })
    }

    if (req.method === 'PATCH') {
      const { fecha, hora, nombre, telefono, email, servicio, mensaje } = req.body || {}
      if (!fecha || !hora) return res.status(400).json({ error: 'Falta fecha y hora nuevas.' })
      const fechaObj = new Date(`${fecha}T00:00:00`)
      if (!huecosDelDia(fechaObj, cita.duracion_min).includes(hora)) {
        return res.status(400).json({ error: 'Ese hueco no existe en el horario de la óptica.' })
      }

      // fecha/hora siempre cambian aquí; el resto de datos solo si se mandan
      // (p. ej. si el cliente corrigió algo al volver atrás en el formulario).
      const cambios = { fecha, hora, actualizado_en: new Date().toISOString() }
      if (nombre) cambios.nombre = nombre
      if (telefono) cambios.telefono = telefono
      if (email) cambios.email = email
      if (servicio) cambios.servicio = servicio
      if (mensaje !== undefined) cambios.mensaje = mensaje

      const { data: actualizada, error } = await db.from('citas').update(cambios).eq('id', cita.id).select().single()

      if (error) {
        if (error.code === '23505') {
          return res.status(409).json({ error: 'Ese hueco se acaba de reservar. Elige otro, por favor.' })
        }
        throw error
      }

      await actualizarEvento(cita.google_event_id, {
        fecha,
        hora,
        duracionMin: cita.duracion_min,
        resumen: `${actualizada.servicio} — ${actualizada.nombre}`,
        descripcion: `Tel: ${actualizada.telefono} · Email: ${actualizada.email}${actualizada.mensaje ? `\n${actualizada.mensaje}` : ''}`,
      })

      return res.status(200).json({
        ok: true,
        fecha: actualizada.fecha,
        hora: actualizada.hora.slice(0, 5),
        fechaLarga: formatoDiaLargo(fechaObj),
      })
    }

    return res.status(405).json({ error: 'Método no permitido' })
  } catch (err) {
    console.error('[citas:token]', err.message)
    return res.status(500).json({ error: 'Algo falló gestionando la cita.' })
  }
}
