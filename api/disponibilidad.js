import { supabaseAdmin } from './_lib/supabaseAdmin.js'
import { modoDemo } from './_lib/config.js'
import { huecosDelDia, ocupado } from '../src/lib/horario.js'

// GET /api/disponibilidad?fecha=YYYY-MM-DD&duracion=30
// Devuelve qué huecos de ese día ya están cogidos. El listado de huecos
// POSIBLES lo calcula el propio cliente (horario.js) para no ir y venir dos
// veces; aquí solo se dice cuáles de esos están ocupados de verdad.
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método no permitido' })

  const { fecha, duracion } = req.query
  if (!fecha || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return res.status(400).json({ error: 'Falta fecha (YYYY-MM-DD).' })
  }
  const dur = Number(duracion) || 30

  if (modoDemo()) {
    // Sin Supabase configurado todavía: simulamos ocupación estable con el
    // mismo hash que usaba la versión solo-frontend, para que la demo pública
    // siga viéndose "viva" mientras se termina de conectar todo.
    const fechaObj = new Date(`${fecha}T00:00:00`)
    const ocupadas = huecosDelDia(fechaObj, dur).filter((h) => ocupado(fechaObj, h))
    return res.status(200).json({ demo: true, ocupadas })
  }

  try {
    const { data, error } = await supabaseAdmin()
      .from('citas')
      .select('hora')
      .eq('fecha', fecha)
      .eq('estado', 'confirmada')
    if (error) throw error
    return res.status(200).json({ demo: false, ocupadas: data.map((r) => r.hora.slice(0, 5)) })
  } catch (err) {
    console.error('[disponibilidad]', err.message)
    return res.status(500).json({ error: 'No se pudo consultar la disponibilidad.' })
  }
}
