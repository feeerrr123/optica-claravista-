import { useEffect, useMemo, useRef, useState } from 'react'
import { JUEGOS, ratingContraste, frase } from '../lib/juegos.js'
import { Intro, Resultado, GameFrame } from './ui.jsx'

const JUEGO = JUEGOS[2]
const NIVELES = [16, 11, 7, 4.5, 3, 2, 1.2] // contraste % (Michelson aprox)

function Parche({ contraste, tilt }) {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const S = 240
    canvas.width = S * dpr
    canvas.height = S * dpr
    canvas.style.width = S + 'px'
    canvas.style.height = S + 'px'
    const ctx = canvas.getContext('2d')
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const tmp = document.createElement('canvas')
    tmp.width = S
    tmp.height = S
    const tctx = tmp.getContext('2d')
    const img = tctx.createImageData(S, S)
    const d = img.data
    const mid = [244, 241, 232]
    const amp = (contraste / 100) * 150 // sobre un gris medio efectivo
    const th = (tilt === 'left' ? -20 : 20) * (Math.PI / 180)
    const cos = Math.cos(th)
    const sin = Math.sin(th)
    const freq = 0.055 // ciclos por px
    const cx = S / 2
    const cy = S / 2
    const rad = S / 2 - 6
    for (let y = 0; y < S; y++) {
      for (let x = 0; x < S; x++) {
        const idx = (y * S + x) * 4
        const dx = x - cx
        const dy = y - cy
        const dist = Math.sqrt(dx * dx + dy * dy)
        // ventana suave (coseno) en el borde
        let win = 1
        if (dist > rad - 24) win = Math.max(0, (rad - dist) / 24)
        if (dist > rad) win = 0
        const u = dx * cos + dy * sin
        const g = Math.sin(u * 2 * Math.PI * freq)
        const v = amp * g * win
        d[idx] = clamp(mid[0] + v)
        d[idx + 1] = clamp(mid[1] + v)
        d[idx + 2] = clamp(mid[2] + v * 0.9)
        d[idx + 3] = 255 * (win > 0 ? 1 : 0)
      }
    }
    tctx.putImageData(img, 0, 0)
    ctx.clearRect(0, 0, S, S)
    ctx.drawImage(tmp, 0, 0, S, S)
  }, [contraste, tilt])
  return <canvas ref={ref} aria-hidden="true" className="rounded-full" />
}

const clamp = (v) => (v < 0 ? 0 : v > 255 ? 255 : v)

export default function Contraste({ onDone }) {
  const [phase, setPhase] = useState('intro')
  const [step, setStep] = useState(0)
  const [streak, setStreak] = useState(0)
  const [passedIdx, setPassedIdx] = useState(-1)
  const [flash, setFlash] = useState(null)
  const [round, setRound] = useState(0)
  const tilt = useMemo(() => (Math.random() < 0.5 ? 'left' : 'right'), [step, round])

  function pick(t) {
    if (flash) return
    const ok = t === tilt
    setFlash(ok ? 'ok' : 'no')
    window.setTimeout(() => {
      setFlash(null)
      if (ok) {
        const s = streak + 1
        if (s >= 2) {
          setPassedIdx(step)
          setStreak(0)
          if (step + 1 < NIVELES.length) {
            setStep(step + 1)
          } else {
            setPhase('result')
          }
        } else {
          setStreak(s)
          setRound((r) => r + 1)
        }
      } else {
        setPhase('result')
      }
    }, 600)
  }

  if (phase === 'intro') {
    return (
      <Intro juego={JUEGO} onStart={() => setPhase('play')}>
        <p>Dentro del círculo hay unas rayas inclinadas. Dinos si se inclinan a la <strong className="text-ink">izquierda</strong> o a la <strong className="text-ink">derecha</strong>. Cada vez se ven menos.</p>
        <p>Necesitas dos aciertos seguidos para bajar de nivel. Un fallo y se acaba.</p>
      </Intro>
    )
  }

  if (phase === 'result') {
    const contrasteMin = passedIdx >= 0 ? NIVELES[passedIdx] : 20
    const rating = ratingContraste(contrasteMin)
    return (
      <Resultado
        juego={JUEGO}
        rating={rating}
        frase={frase('contraste', rating)}
        detalle={passedIdx >= 0 ? `Llegaste al ${contrasteMin}% de contraste` : 'No superaste el primer nivel'}
        onNext={() => onDone({ raw: { contrasteMin }, rating })}
      />
    )
  }

  return (
    <GameFrame className="p-5 sm:p-8">
      <div className="flex items-center justify-between font-mono text-sm text-ink-soft">
        <span>Nivel {step + 1} / {NIVELES.length}</span>
        <span>Seguidos: {streak} / 2</span>
      </div>

      <div
        className={`mx-auto mt-5 grid h-[264px] w-[264px] place-items-center rounded-2xl border transition-colors ${
          flash === 'ok' ? 'border-accent' : flash === 'no' ? 'border-line-strong' : 'border-line'
        }`}
        style={{ background: 'rgb(244 241 232)' }}
      >
        <Parche key={`${step}-${round}`} contraste={NIVELES[step]} tilt={tilt} />
      </div>

      <p className="mt-6 text-center text-[15px] text-ink">¿Hacia dónde se inclinan las rayas?</p>
      <div className="mx-auto mt-4 flex max-w-xs gap-3">
        {['left', 'right'].map((t) => (
          <button
            key={t}
            disabled={!!flash}
            onClick={() => pick(t)}
            className="afterimage flex-1 rounded-xl border border-line-strong px-4 py-3 text-[15px] font-semibold text-ink transition hover:border-ink disabled:opacity-40"
          >
            {t === 'left' ? 'Izquierda' : 'Derecha'}
          </button>
        ))}
      </div>
    </GameFrame>
  )
}
