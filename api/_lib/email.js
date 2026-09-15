import { cfg, emailListo } from './config.js'

// REST directo a Resend — evita añadir su SDK para una sola llamada.
// Si falla o no está configurado, no rompe la reserva: solo se avisa en logs.
export async function enviarEmail({ to, subject, html }) {
  if (!emailListo()) return { enviado: false, motivo: 'sin configurar' }
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cfg.resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: cfg.resendFrom, to, subject, html }),
    })
    if (!r.ok) {
      console.error('[email] Resend respondió', r.status, await r.text())
      return { enviado: false, motivo: `http ${r.status}` }
    }
    return { enviado: true }
  } catch (err) {
    console.error('[email] fallo al enviar:', err.message)
    return { enviado: false, motivo: err.message }
  }
}

export function plantillaConfirmacion({ nombre, servicio, fechaLarga, hora, gestionUrl }) {
  return `
    <div style="font-family:sans-serif;max-width:480px;margin:auto;color:#26231d">
      <h1 style="font-size:20px">Cita confirmada</h1>
      <p>Hola ${nombre}, tu cita para <strong>${servicio}</strong> es el
      <strong>${fechaLarga}</strong> a las <strong>${hora}</strong>.</p>
      <p>Si necesitas cambiarla o cancelarla (hasta 12h antes), usa este enlace:</p>
      <p><a href="${gestionUrl}" style="color:#9e4228">${gestionUrl}</a></p>
      <p style="color:#6a6354;font-size:13px">Óptica Claravista — proyecto de demostración.</p>
    </div>`
}
