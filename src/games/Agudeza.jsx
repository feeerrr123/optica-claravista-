import { useEffect, useMemo, useRef, useState } from 'react'
import { JUEGOS, ratingAgudeza, frase } from '../lib/juegos.js'
import { Intro, Resultado, GameFrame, ArrowPad } from './ui.jsx'

const JUEGO = JUEGOS[1]
const TAMANOS = [120, 88, 64, 46, 33, 24, 17] // diámetro exterior en px
const DIRS = ['up', 'right', 'down', 'left']
const ANG = { right: 0, down: Math.PI / 2, left: Math.PI, up: -Math.PI / 2 }

function Anillo({ px, dir }) {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const box = 150
    canvas.width = box * dpr
    canvas.height = box * dpr
    canvas.style.width = box + 'px'
    canvas.style.height = box + 'px'
    const ctx = canvas.getContext('2d')
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, box, box)
    const R = px / 2
    const w = px / 5 // grosor y hueco = 1/5 del diámetro (Landolt)
    const gapAng = w / (R - w / 2)
    const a = ANG[dir]
    ctx.strokeStyle = 'rgb(38 35 29)'
    ctx.lineWidth = w
    ctx.beginPath()
    ctx.arc(box / 2, box / 2, R - w / 2, a + gapAng / 2, a - gapAng / 2 + Math.PI * 2)
    ctx.stroke()
  }, [px, dir])
  return <canvas ref={ref} aria-hidden="true" />
}

export default function Agudeza({ onDone }) {
  const [phase, setPhase] = useState('intro')
  const [step, setStep] = useState(0)
  const [passed, setPassed] = useState(0)
  const [flash, setFlash] = useState(null) // 'ok' | 'no'
  const dir = useMemo(() => DIRS[(Math.random() * 4) | 0], [step])

  function pick(d) {
    if (flash) return
    const ok = d === dir
    setFlash(ok ? 'ok' : 'no')
    if (ok) setPassed(step + 1)
    window.setTimeout(() => {
      setFlash(null)
      if (ok && step + 1 < TAMANOS.length) setStep(step + 1)
      else setPhase('result')
    }, 650)
  }

  if (phase === 'intro') {
    return (
      <Intro juego={JUEGO} onStart={() => setPhase('play')}>
        <p>Aparece un anillo con una abertura, como una "C". Dinos hacia dónde apunta el hueco. Si aciertas, el siguiente es más pequeño.</p>
        <p>Mira de frente y a un brazo de distancia. Cuando no lo veas claro, es tu tope.</p>
      </Intro>
    )
  }

  if (phase === 'result') {
    const nivel = Math.max(passed, 0)
    const rating = ratingAgudeza(nivel || 1, TAMANOS.length)
    return (
      <Resultado
        juego={JUEGO}
        rating={rating}
        frase={frase('agudeza', rating)}
        detalle={`Nivel ${nivel} de ${TAMANOS.length}`}
        onNext={() => onDone({ raw: { nivel, pasos: TAMANOS.length }, rating })}
      />
    )
  }

  return (
    <GameFrame className="p-5 sm:p-8">
      <p className="text-center font-mono text-sm text-ink-soft">Tamaño {step + 1} / {TAMANOS.length}</p>

      <div
        className={`mx-auto mt-5 grid h-[170px] w-[170px] place-items-center rounded-2xl border transition-colors ${
          flash === 'ok' ? 'border-accent bg-accent/10' : flash === 'no' ? 'border-line-strong bg-surface-2' : 'border-line bg-bg'
        }`}
      >
        <Anillo px={TAMANOS[step]} dir={dir} />
      </div>

      <p className="mt-6 text-center text-[15px] text-ink">¿Hacia dónde apunta el hueco?</p>
      <div className="mt-4">
        <ArrowPad onPick={pick} disabled={!!flash} />
      </div>
      <p className="mt-4 text-center font-mono text-[12px] text-ink-soft">También con las flechas del teclado</p>
      <KeyNav onPick={pick} disabled={!!flash} />
    </GameFrame>
  )
}

function KeyNav({ onPick, disabled }) {
  useEffect(() => {
    const map = { ArrowUp: 'up', ArrowRight: 'right', ArrowDown: 'down', ArrowLeft: 'left' }
    const h = (e) => {
      if (disabled) return
      const d = map[e.key]
      if (d) {
        e.preventDefault()
        onPick(d)
      }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onPick, disabled])
  return null
}
