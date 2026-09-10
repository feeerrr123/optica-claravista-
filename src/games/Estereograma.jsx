import { useEffect, useMemo, useRef, useState } from 'react'
import { JUEGOS, ratingEstereo, frase } from '../lib/juegos.js'
import { Intro, Resultado, GameFrame } from './ui.jsx'

const JUEGO = JUEGOS[3]

const FORMAS = [
  { id: 'circulo', label: 'Un círculo', path: (c, s) => `M${c} ${c - s}a${s} ${s} 0 1 0 0.01 0z` },
  { id: 'estrella', label: 'Una estrella', path: starPath },
  { id: 'corazon', label: 'Un corazón', path: heartPath },
  { id: 'triangulo', label: 'Un triángulo', path: (c, s) => `M${c} ${c - s}L${c + s * 0.92} ${c + s * 0.6}L${c - s * 0.92} ${c + s * 0.6}Z` },
]

function starPath(c, s) {
  let d = ''
  for (let i = 0; i < 10; i++) {
    const r = i % 2 ? s * 0.44 : s
    const a = (Math.PI / 5) * i - Math.PI / 2
    d += (i ? 'L' : 'M') + (c + r * Math.cos(a)).toFixed(1) + ' ' + (c + r * Math.sin(a)).toFixed(1)
  }
  return d + 'Z'
}
function heartPath(c, s) {
  return `M${c} ${c + s * 0.72}C${c - s * 1.3} ${c - s * 0.15} ${c - s * 0.55} ${c - s * 0.95} ${c} ${c - s * 0.35}C${c + s * 0.55} ${c - s * 0.95} ${c + s * 1.3} ${c - s * 0.15} ${c} ${c + s * 0.72}Z`
}

const PALETA = [
  [198, 90, 62], [212, 130, 96], [216, 160, 82], [124, 148, 110],
  [92, 138, 130], [154, 150, 104], [198, 176, 152], [120, 110, 96],
]

function Autostereograma({ formaId, revelar }) {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const W = Math.round(Math.min(canvas.parentElement.clientWidth, 440))
    const H = Math.round(W * 0.66)
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = W * dpr
    canvas.height = H * dpr
    canvas.style.width = W + 'px'
    canvas.style.height = H + 'px'
    const ctx = canvas.getContext('2d')
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    // mapa de profundidad: la forma (blanca = cerca) sobre negro (lejos)
    const dm = document.createElement('canvas')
    dm.width = W
    dm.height = H
    const g = dm.getContext('2d')
    g.fillStyle = '#000'
    g.fillRect(0, 0, W, H)
    const s = Math.min(W, H) * 0.4
    const path = new Path2D(FORMAS.find((f) => f.id === formaId).path(0, s))
    g.save()
    g.translate(W / 2, H / 2)
    g.filter = 'blur(3px)'
    g.fillStyle = '#fff'
    g.fill(path)
    g.restore()
    const depth = g.getImageData(0, 0, W, H).data

    // algoritmo SIRDS (Thimbleby, Inglis, Witten)
    const E = Math.round(Math.min(Math.max(W / 4.6, 58), 96))
    const mu = 0.32
    const tmp = document.createElement('canvas')
    tmp.width = W
    tmp.height = H
    const tctx = tmp.getContext('2d')
    const out = tctx.createImageData(W, H)
    const o = out.data
    const colIdx = new Int32Array(W)

    for (let y = 0; y < H; y++) {
      const same = new Int32Array(W)
      for (let x = 0; x < W; x++) same[x] = x
      for (let x = 0; x < W; x++) {
        const z = depth[(y * W + x) * 4] / 255
        const sep = Math.round(((1 - mu * z) * E) / (2 - mu * z))
        let left = x - (sep >> 1)
        let right = left + sep
        if (left >= 0 && right < W) {
          let visible = true
          let t = 1
          let zt
          do {
            zt = z + (2 * (2 - mu * z) * t) / (mu * E)
            const zL = x - t >= 0 ? depth[(y * W + (x - t)) * 4] / 255 : 0
            const zR = x + t < W ? depth[(y * W + (x + t)) * 4] / 255 : 0
            visible = zL < zt && zR < zt
            t++
          } while (visible && zt < 1)
          if (visible) {
            let l = same[left]
            while (l !== left && l !== right) {
              if (l < right) {
                left = l
                l = same[left]
              } else {
                same[left] = right
                left = right
                right = l
                l = same[left]
              }
            }
            same[left] = right
          }
        }
      }
      for (let x = W - 1; x >= 0; x--) {
        const ci = same[x] === x ? (Math.random() * PALETA.length) | 0 : colIdx[same[x]]
        colIdx[x] = ci
        const c = PALETA[ci]
        const i = (y * W + x) * 4
        o[i] = c[0]
        o[i + 1] = c[1]
        o[i + 2] = c[2]
        o[i + 3] = 255
      }
    }
    tctx.putImageData(out, 0, 0)
    ctx.clearRect(0, 0, W, H)
    ctx.drawImage(tmp, 0, 0, W, H)

    if (revelar) {
      ctx.save()
      ctx.translate(W / 2, H / 2)
      ctx.strokeStyle = 'rgba(38,35,29,0.85)'
      ctx.setLineDash([5, 5])
      ctx.lineWidth = 2.5
      ctx.stroke(path)
      ctx.restore()
    }
  }, [formaId, revelar])
  return (
    <div className="w-full">
      {/* guía para cruzar la vista: junta los dos puntos hasta ver tres */}
      <div className="mx-auto mb-3 flex w-full max-w-[440px] justify-center gap-[62px]">
        <span className="h-2.5 w-2.5 rounded-full bg-ink" />
        <span className="h-2.5 w-2.5 rounded-full bg-ink" />
      </div>
      <canvas ref={ref} className="mx-auto block rounded-xl" aria-hidden="true" />
    </div>
  )
}

export default function Estereograma({ onDone }) {
  const [phase, setPhase] = useState('intro')
  const forma = useMemo(() => FORMAS[(Math.random() * FORMAS.length) | 0], [])
  const [t0, setT0] = useState(0)
  const [revelar, setRevelar] = useState(false)
  const [conAyuda, setConAyuda] = useState(false)
  const [picked, setPicked] = useState(null)
  const [resultado, setResultado] = useState(null)

  function start() {
    setT0(Date.now())
    setPhase('play')
  }

  function pick(id) {
    if (picked) return
    setPicked(id)
    const visto = id === forma.id
    const segundos = Math.round((Date.now() - t0) / 1000)
    const rating = ratingEstereo({ visto, conAyuda, segundos })
    setResultado({ raw: { visto, conAyuda, segundos }, rating })
    window.setTimeout(() => setPhase('result'), 700)
  }

  if (phase === 'intro') {
    return (
      <Intro juego={JUEGO} onStart={start}>
        <p>Una imagen de puntos de colores esconde una figura en relieve. Para verla, <strong className="text-ink">relaja la vista y mira "a través" de la pantalla</strong>, como si miraras algo lejano.</p>
        <p>Truco: sobre la imagen hay dos puntos. Bizquea un poco hasta que se conviertan en <strong className="text-ink">tres</strong> — ahí es donde aparece el relieve. Si te atascas, tienes una pista.</p>
      </Intro>
    )
  }

  if (phase === 'result') {
    const p = resultado || { raw: { visto: false, conAyuda, segundos: 0 }, rating: 1 }
    return (
      <Resultado
        juego={JUEGO}
        rating={p.rating}
        frase={frase('estereo', p.rating)}
        detalle={p.raw.visto ? `Era ${forma.label.toLowerCase()} · ${p.raw.segundos}s${conAyuda ? ' (con ayuda)' : ''}` : `Era ${forma.label.toLowerCase()}`}
        onNext={() => onDone(p)}
        esUltimo
      />
    )
  }

  return (
    <GameFrame className="p-5 sm:p-8">
      <p className="text-center font-mono text-sm text-ink-soft">Relaja la vista y mira a través de la imagen</p>
      <div className="mt-5">
        <Autostereograma formaId={forma.id} revelar={revelar} />
      </div>

      <div className="mt-4 text-center">
        <button
          onClick={() => {
            setRevelar(true)
            setConAyuda(true)
            window.setTimeout(() => setRevelar(false), 3200)
          }}
          className="text-sm font-semibold text-accent hover:text-accent-dark"
        >
          No la veo — enséñame una pista
        </button>
      </div>

      <p className="mt-6 text-center text-[15px] text-ink">¿Qué figura hay escondida?</p>
      <div className="mx-auto mt-3 grid max-w-md grid-cols-2 gap-2">
        {FORMAS.map((f) => (
          <button
            key={f.id}
            disabled={!!picked}
            onClick={() => pick(f.id)}
            className={`afterimage rounded-xl border px-3 py-3 text-[15px] font-medium transition ${
              picked
                ? f.id === forma.id
                  ? 'border-accent bg-accent text-bg'
                  : f.id === picked
                    ? 'border-line-strong text-ink-soft line-through'
                    : 'border-line-strong text-ink-soft'
                : 'border-line-strong text-ink hover:border-ink'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </GameFrame>
  )
}
