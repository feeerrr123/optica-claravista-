import { cfg, geminiListo } from './_lib/config.js'
import { responderChat } from './_lib/gemini.js'

const LARGO_MAXIMO = 500

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' })

  const { mensaje, interactionId } = req.body || {}
  if (typeof mensaje !== 'string' || !mensaje.trim()) {
    return res.status(400).json({ error: 'Falta el mensaje.' })
  }
  if (mensaje.length > LARGO_MAXIMO) {
    return res.status(400).json({ error: 'Ese mensaje es demasiado largo.' })
  }

  if (!geminiListo()) {
    return res.status(200).json({
      demo: true,
      respuesta: `El asistente con IA todavía no está conectado en esta demo. Mientras tanto, llama al ${cfg.telefonoContacto} o usa el formulario de Contacto.`,
      interactionId: null,
    })
  }

  const resultado = await responderChat({
    mensaje: mensaje.trim(),
    interactionIdPrevio: typeof interactionId === 'string' ? interactionId : null,
  })

  if (!resultado) {
    return res.status(200).json({
      demo: false,
      respuesta: `Uy, algo ha fallado respondiendo. Prueba otra vez, o llama al ${cfg.telefonoContacto}.`,
      interactionId: null,
    })
  }

  return res.status(200).json({ demo: false, respuesta: resultado.texto, interactionId: resultado.interactionId })
}
