import { useCallback, useEffect, useState } from 'react'

/* Estado y puntuación de los juegos para la vista.
 * Se guarda en localStorage para retomar donde lo dejaste. */

const KEY = 'claravista.juegos.v1'

export const JUEGOS = [
  { id: 'color', n: 1, titulo: 'Color', nivel: 'Fácil', mide: 'Distinguir colores' },
  { id: 'agudeza', n: 2, titulo: 'Agudeza', nivel: 'Normal', mide: 'Ver nítido' },
  { id: 'contraste', n: 3, titulo: 'Contraste', nivel: 'Difícil', mide: 'Detectar formas suaves' },
  { id: 'estereo', n: 4, titulo: 'Visión 3D', nivel: 'Muy difícil', mide: 'Ver en relieve' },
]

const empty = () => ({ color: null, agudeza: null, contraste: null, estereo: null })

function read() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return empty()
    return { ...empty(), ...JSON.parse(raw) }
  } catch (e) {
    return empty()
  }
}

function write(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch (e) {
    /* modo incógnito / almacenamiento bloqueado: seguimos sin persistir */
  }
}

export function useJuegos() {
  const [state, setState] = useState(read)

  useEffect(() => {
    // por si otra pestaña lo cambia
    const onStorage = (e) => {
      if (e.key === KEY) setState(read())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const guardar = useCallback((id, resultado) => {
    setState((prev) => {
      const next = { ...prev, [id]: { ...resultado, at: Date.now() } }
      write(next)
      return next
    })
  }, [])

  const reiniciar = useCallback(() => {
    const next = empty()
    write(next)
    setState(next)
  }, [])

  const hechos = JUEGOS.filter((j) => state[j.id]).length
  const todos = hechos === JUEGOS.length
  const siguiente = JUEGOS.find((j) => !state[j.id]) || null

  return { state, guardar, reiniciar, hechos, todos, siguiente }
}

/* ── Puntuación → valoración de 1 a 5 ── */

export function ratingColor(aciertos, total) {
  const p = aciertos / total
  if (p >= 0.99) return 5
  if (p >= 0.83) return 4
  if (p >= 0.66) return 3
  if (p >= 0.4) return 2
  return 1
}

// nivel = paso más pequeño superado, de 1 (grande) a `pasos` (diminuto)
export function ratingAgudeza(nivel, pasos) {
  const p = nivel / pasos
  if (p >= 0.9) return 5
  if (p >= 0.72) return 4
  if (p >= 0.5) return 3
  if (p >= 0.28) return 2
  return 1
}

// contrasteMin en % (más bajo = mejor)
export function ratingContraste(contrasteMin) {
  if (contrasteMin <= 2) return 5
  if (contrasteMin <= 4) return 4
  if (contrasteMin <= 7) return 3
  if (contrasteMin <= 12) return 2
  return 1
}

export function ratingEstereo({ visto, conAyuda, segundos }) {
  if (!visto) return 1
  if (conAyuda) return 3
  if (segundos <= 8) return 5
  if (segundos <= 20) return 4
  return 3
}

const FRASES = {
  color: {
    5: 'Distingues los colores sin despeinarte.',
    4: 'Muy bien de color. Un par se te resistieron.',
    3: 'Bien, con alguna duda en los tonos parecidos.',
    2: 'Varios se te escaparon — coméntanoslo en la revisión.',
    1: 'Te costó bastante. Merece la pena mirarlo con calma.',
  },
  agudeza: {
    5: 'Ojo de lince: llegaste hasta el tamaño más pequeño.',
    4: 'Ves muy nítido, casi hasta el final.',
    3: 'Nitidez correcta para el día a día.',
    2: 'Te quedaste a media tabla. ¿Hace mucho que no te gradúas?',
    1: 'Los tamaños pequeños se te van. Toca revisión.',
  },
  contraste: {
    5: 'Detectas formas casi invisibles. Impresionante.',
    4: 'Muy buena sensibilidad al contraste.',
    3: 'Bien con contrastes normales, justo con los suaves.',
    2: 'Las formas tenues se te escapan pronto.',
    1: 'Solo ves lo que tiene mucho contraste. Conviene mirarlo.',
  },
  estereo: {
    5: 'Visión en relieve de sobra: la viste al momento.',
    4: 'Buena visión 3D, con un poco de paciencia.',
    3: 'La sacaste, pero costó. Los dos ojos podrían coordinar mejor.',
    2: 'Te costó mucho ver el relieve.',
    1: 'No conseguiste ver la figura. Puede ser práctica… o algo que revisar.',
  },
}

export const frase = (id, r) => FRASES[id]?.[r] || ''

export function veredicto(state) {
  const rs = JUEGOS.map((j) => state[j.id]?.rating).filter(Boolean)
  if (!rs.length) return null
  const media = rs.reduce((a, b) => a + b, 0) / rs.length
  if (media >= 4.3) return { clave: 'lince', titulo: 'Vista de lince', texto: 'Todo apunta a que ves de maravilla. Aun así, una revisión cada dos años no sobra.' }
  if (media >= 3.4) return { clave: 'ok', titulo: 'Todo en orden', texto: 'Sin sorpresas en los juegos. Si notas algo raro en el día a día, pásate.' }
  if (media >= 2.4) return { clave: 'afina', titulo: 'Cumples, pero afina', texto: 'Algún juego se te ha atragantado. Vale la pena una revisión tranquila.' }
  return { clave: 'ojo', titulo: 'Conviene que le echemos un ojo', texto: 'Varios resultados flojos. No es un diagnóstico, pero sí un buen motivo para venir.' }
}
