// Lee la configuración de entorno UNA vez y dice con claridad si falta algo.
// Con cualquier pieza sin configurar, las rutas de /api caen a "modo demo"
// (simulan éxito, no tocan nada real) en vez de romperse a medias.

export const cfg = {
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  googleRefreshToken: process.env.GOOGLE_REFRESH_TOKEN || '',
  googleCalendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
  resendApiKey: process.env.RESEND_API_KEY || '',
  resendFrom: process.env.RESEND_FROM || 'Óptica Claravista <onboarding@resend.dev>',
  appBaseUrl: process.env.APP_BASE_URL || '',
  telefonoContacto: process.env.TELEFONO_CONTACTO || '[teléfono]',
}

export const supabaseListo = () => !!(cfg.supabaseUrl && cfg.supabaseServiceKey)
export const googleListo = () => !!(cfg.googleClientId && cfg.googleClientSecret && cfg.googleRefreshToken)
export const emailListo = () => !!cfg.resendApiKey

// "Modo demo" = falta Supabase (es la pieza sin la que no hay ni reserva que
// gestionar). Google Calendar y el email son best-effort: si fallan, la cita
// se guarda igual en Supabase y se avisa por consola, no se rompe la reserva.
export const modoDemo = () => !supabaseListo()
