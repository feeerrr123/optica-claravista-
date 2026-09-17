import { GoogleGenAI } from '@google/genai'
import { cfg, geminiListo } from './config.js'
import { horarioTexto } from '../../src/lib/horario.js'

// Alias "siempre el Flash más reciente" en vez de fijar una versión con
// fecha — así no hay que tocar esto cada vez que Google saca un modelo
// nuevo. Si algún día quieres más margen gratis, cambia esto por la
// variante "flash-lite" (suele tener cuota diaria más alta).
const MODELO = 'gemini-flash-latest'

const SERVICIOS = [
  'Graduación de la vista (examen visual completo con optometrista) — 30 min',
  'Adaptación de lentes de contacto (blandas, rígidas y de uso especial) — 45 min',
  'Gafas de sol graduadas con filtro UV400 — 20 min',
  'Revisión visual infantil desde los 3 años — 30 min',
]

// Mantener en sync a mano con src/data/servicios.jsx (son solo 4 líneas de
// resumen; no se puede importar ese archivo aquí porque tiene JSX y esta
// función corre en Node puro, sin paso de compilación).
function construirInstruccion() {
  return `Eres el asistente de soporte de Óptica Claravista, una óptica de barrio en [ciudad].
Respondes SIEMPRE en español, con un tono cercano, cálido y profesional. Mensajes breves
(2-4 frases), como en un chat — no un artículo.

DATOS REALES DE LA ÓPTICA (no inventes nada fuera de esto):
- Horario: ${horarioTexto()}
- Servicios:
  - ${SERVICIOS.join('\n  - ')}
- Para pedir cita: el botón "Pide cita" de la web, o llamando al ${cfg.telefonoContacto}.
- No conoces precios exactos: si preguntan, di que dependen del caso y se confirman en la cita o llamando.

REGLAS QUE NUNCA ROMPES:
1. No diagnosticas. Puedes dar información general y educativa sobre síntomas oculares
   comunes (vista cansada, dificultad para ver de cerca o de lejos, ojo seco, sensibilidad
   a la luz, etc.), pero siempre dejas claro que un diagnóstico real solo lo da una revisión
   presencial, y animas a pedir cita para eso.
2. Si alguien describe algo que podría ser urgente (pérdida de visión repentina, dolor
   ocular fuerte, destellos de luz o "moscas volantes" nuevas y repentinas, un golpe o un
   químico en el ojo, visión doble repentina), dile con claridad que eso necesita atención
   médica HOY — urgencias o su médico — no esperar a una cita normal.
3. Si no sabes algo con certeza, dilo abiertamente y ofrece el teléfono de contacto en vez
   de inventarlo.
4. No dices que eres médico ni optometrista: eres el asistente de la óptica, ayudas a
   informarse y a organizarse, no a curarse.`
}

// Devuelve { texto, interactionId } o null si Gemini no está configurado o falla
// (el widget cae a un aviso, nunca rompe la web).
export async function responderChat({ mensaje, interactionIdPrevio }) {
  if (!geminiListo()) return null
  try {
    const ai = new GoogleGenAI({ apiKey: cfg.geminiApiKey })
    const interaction = await ai.interactions.create({
      model: MODELO,
      input: mensaje,
      system_instruction: construirInstruccion(),
      ...(interactionIdPrevio ? { previous_interaction_id: interactionIdPrevio } : {}),
    })
    return { texto: interaction.output_text, interactionId: interaction.id }
  } catch (err) {
    console.error('[gemini] no se pudo responder:', err.message)
    return null
  }
}
