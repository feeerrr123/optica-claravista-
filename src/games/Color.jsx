import { useEffect, useRef, useState } from 'react'
import { JUEGOS, ratingColor, frase } from '../lib/juegos.js'
import { Intro, Resultado, GameFrame } from './ui.jsx'

const JUEGO = JUEGOS[0]

// 6 rondas: número objetivo, opciones, y "sep" = separación de tono figura/fondo
// (más bajo = más difícil de leer).
const RONDAS = [
  { num: '12', opts: ['12', '17', '72', '2'], sep: 1.0 },
  { num: '8', opts: ['8', '3', '6', 'nada'], sep: 0.95 },
  { num: '29', opts: ['29', '20', '79', '25'], sep: 0.72 },
  { num: '5', opts: ['5', '2', '6', 'nada'], sep: 0.6 },
  { num: '74', opts: ['74', '21', '71', '14'], sep: 0.45 },
  { num: '45', opts: ['45', '15', '48', 'nada'], sep: 0.34 },
]

// figura roja-teja / fondo verdes-grises, luminancia parecida
const FIG_BASE = [198, 90, 62]
const GND = [[124, 148, 110], [96, 140, 130], [150, 148, 118], [182, 168, 146]]

function Placa({ num, sep }) {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const ctx = canvas.getContext('2d')

    function draw() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const S = Math.round(Math.min(wrap.clientWidth, 420))
      canvas.width = S * dpr
      canvas.height = S * dpr
      canvas.style.width = S + 'px'
      canvas.style.height = S + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, S, S)

      // máscara del número
      const mask = document.createElement('canvas')
      mask.width = S
      mask.height = S
      const m = mask.getContext('2d')
      m.fillStyle = '#000'
      m.textAlign = 'center'
      m.textBaseline = 'middle'
      const fs = S * (num.length > 1 ? 0.52 : 0.6)
      m.font = `800 ${fs}px "Bricolage Grotesque", sans-serif`
      m.fillText(num, S / 2, S / 2 + fs * 0.03)
      const md = m.getImageData(0, 0, S, S).data

      // figura = FIG_BASE desaturado hacia el gris del fondo según `sep`
      const fig = [
        FIG_BASE[0] * sep + 150 * (1 - sep),
        FIG_BASE[1] * sep + 150 * (1 - sep),
        FIG_BASE[2] * sep + 130 * (1 - sep),
      ]

      const gap = S / 40
      const r0 = gap * 0.46
      let row = 0
      for (let y = gap; y < S - gap * 0.3; y += gap * 0.9, row++) {
        const xoff = row % 2 ? gap / 2 : 0
        for (let x = gap * 0.6 + xoff; x < S - gap * 0.3; x += gap) {
          const dx = (x - S / 2) / (S / 2)
          const dy = (y - S / 2) / (S / 2)
          if (dx * dx + dy * dy > 0.98) continue
          const jx = x + (Math.random() - 0.5) * gap * 0.3
          const jy = y + (Math.random() - 0.5) * gap * 0.3
          const px = Math.max(0, Math.min(S - 1, jx | 0))
          const py = Math.max(0, Math.min(S - 1, jy | 0))
          const isFig = md[(py * S + px) * 4 + 3] > 110
          const c = isFig ? fig : GND[(Math.random() * GND.length) | 0]
          ctx.beginPath()
          ctx.arc(jx, jy, r0 * (isFig ? 0.95 + Math.random() * 0.3 : 0.6 + Math.random() * 0.5), 0, 6.2832)
          ctx.fillStyle = `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})`
          ctx.fill()
        }
      }
    }

    draw()
    if (document.fonts && document.fonts.status !== 'loaded') document.fonts.ready.then(draw)
    const onR = () => draw()
    window.addEventListener('resize', onR)
    return () => window.removeEventListener('resize', onR)
  }, [num, sep])

  return (
    <div ref={wrapRef} className="mx-auto w-full max-w-[420px]" role="img" aria-label="Lámina de puntos de colores con un número escondido">
      <canvas ref={canvasRef} className="mx-auto block rounded-full" />
    </div>
  )
}

export default function Color({ onDone }) {
  const [phase, setPhase] = useState('intro') // intro | play | result
  const [i, setI] = useState(0)
  const [aciertos, setAciertos] = useState(0)
  const [picked, setPicked] = useState(null)

  const ronda = RONDAS[i]

  function pick(opt) {
    if (picked) return
    setPicked(opt)
    const ok = opt === ronda.num
    if (ok) setAciertos((a) => a + 1)
    window.setTimeout(() => {
      if (i + 1 < RONDAS.length) {
        setI(i + 1)
        setPicked(null)
      } else {
        setPhase('result')
      }
    }, 950)
  }

  if (phase === 'intro') {
    return (
      <Intro juego={JUEGO} onStart={() => setPhase('play')}>
        <p>Verás seis láminas de puntos. En cada una hay un número escondido. Elige cuál es —o "nada" si no distingues ninguno.</p>
        <p>Aléjate un poco de la pantalla y no fuerces la vista.</p>
      </Intro>
    )
  }

  if (phase === 'result') {
    const rating = ratingColor(aciertos, RONDAS.length)
    return (
      <Resultado
        juego={JUEGO}
        rating={rating}
        frase={frase('color', rating)}
        detalle={`${aciertos} de ${RONDAS.length} láminas`}
        onNext={() => onDone({ raw: { aciertos, total: RONDAS.length }, rating })}
      />
    )
  }

  return (
    <GameFrame className="p-5 sm:p-8">
      <div className="flex items-center justify-between">
        <p className="font-mono text-sm text-ink-soft">Lámina {i + 1} / {RONDAS.length}</p>
        <p className="font-mono text-sm text-ink-soft">Aciertos: {aciertos}</p>
      </div>

      <div className="mt-5">
        <Placa key={i} num={ronda.num} sep={ronda.sep} />
      </div>

      <p className="mt-6 text-center text-[15px] text-ink">¿Qué número ves?</p>
      <div className="mx-auto mt-3 grid max-w-sm grid-cols-2 gap-2 sm:grid-cols-4">
        {ronda.opts.map((o) => {
          const state = picked
            ? o === ronda.num
              ? 'border-accent bg-accent text-bg'
              : o === picked
                ? 'border-line-strong text-ink-soft line-through'
                : 'border-line-strong text-ink-soft'
            : 'border-line-strong text-ink hover:border-ink'
          return (
            <button
              key={o}
              disabled={!!picked}
              onClick={() => pick(o)}
              className={`afterimage rounded-xl border px-3 py-3 font-mono text-base transition ${state}`}
            >
              {o}
            </button>
          )
        })}
      </div>
    </GameFrame>
  )
}
