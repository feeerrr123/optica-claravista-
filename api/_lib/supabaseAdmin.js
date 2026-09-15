import { createClient } from '@supabase/supabase-js'
import { cfg } from './config.js'

// Cliente con la clave de servicio: SOLO se usa aquí, en el servidor.
// Salta las políticas de RLS a propósito — la tabla `citas` no tiene ninguna
// política pública, así que esta es la única puerta de entrada.
let cliente = null

export function supabaseAdmin() {
  if (!cliente) {
    cliente = createClient(cfg.supabaseUrl, cfg.supabaseServiceKey, {
      auth: { persistSession: false },
    })
  }
  return cliente
}
