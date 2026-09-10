import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { JUEGOS, veredicto, frase } from '../lib/juegos.js'
import { Rating, GameFrame, Aviso } from './ui.jsx'
import Button from '../components/Button.jsx'

export default function Carne({ state, onReset }) {
  const v = useMemo(() => veredicto(state), [state])
  const [msg, setMsg] = useState('')
  const canvasRef = useRef(null)
  const fecha = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })

  function dibujar() {
    const W = 1080
    const H = 1350
    const c = canvasRef.current || document.createElement('canvas')
    c.width = W
    c.height = H
    const x = c.getContext('2d')
    x.fillStyle = '#f6f2e9'
    x.fillRect(0, 0, W, H)
    x.fillStyle = '#26231d'
    x.font = '800 64px "Bricolage Grotesque", sans-serif'
    x.fillText('Carné visual', 80, 150)
    x.font = '500 30px "Spline Sans Mono", monospace'
    x.fillStyle = '#6a6354'
    x.fillText('ÓPTICA CLARAVISTA · ' + fecha.toUpperCase(), 80, 200)

    let y = 320
    JUEGOS.forEach((j) => {
      const r = state[j.id]?.rating || 0
      x.fillStyle = '#26231d'
      x.font = '700 40px "Bricolage Grotesque", sans-serif'
      x.fillText(j.titulo, 80, y)
      for (let d = 0; d < 5; d++) {
        x.beginPath()
        x.arc(560 + d * 46, y - 13, 15, 0, 6.2832)
        x.fillStyle = d < r ? '#bf5636' : '#cdc4b0'
        x.fill()
      }
      x.fillStyle = '#6a6354'
      x.font = '400 26px "Hanken Grotesk", sans-serif'
      wrap(x, frase(j.id, r), 80, y + 40, 920, 34)
      y += 150
    })

    if (v) {
      x.fillStyle = '#26231d'
      x.fillRect(80, y + 10, W - 160, 3)
      x.font = '800 52px "Bricolage Grotesque", sans-serif'
      x.fillText(v.titulo, 80, y + 90)
      x.fillStyle = '#6a6354'
      x.font = '400 27px "Hanken Grotesk", sans-serif'
      wrap(x, v.texto, 80, y + 135, 920, 36)
    }

    x.fillStyle = '#6a6354'
    x.font = '400 22px "Hanken Grotesk", sans-serif'
    wrap(x, 'Es un juego: la pantalla, la luz y la distancia cambian el resultado. Para saber de verdad cómo andas de vista, hazte una revisión.', 80, H - 130, 920, 30)
    x.fillStyle = '#bf5636'
    x.font = '700 26px "Spline Sans Mono", monospace'
    x.fillText('opticaclaravista.example', 80, H - 50)
    return c
  }

  function descargar(blob) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'carne-visual-claravista.png'
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    setMsg('Imagen guardada.')
  }

  async function guardar() {
    const c = dibujar()
    c.toBlob(async (blob) => {
      if (!blob) return
      const file = new File([blob], 'carne-visual-claravista.png', { type: 'image/png' })
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: 'Mi carné visual',
            text: `Mi resultado en los juegos para la vista de Óptica Claravista: ${v?.titulo}.`,
          })
          return
        } catch (e) {
          if (e && e.name === 'AbortError') return
        }
      }
      descargar(blob)
    }, 'image/png')
  }

  return (
    <div>
      <GameFrame className="overflow-hidden">
        <div className="border-b border-line px-6 py-5 sm:px-10">
          <p className="font-mono text-sm text-ink-soft">CARNÉ VISUAL · ÓPTICA CLARAVISTA · {fecha}</p>
          {v && <h2 className="mt-2 font-display text-3xl text-ink sm:text-4xl">{v.titulo}</h2>}
          {v && <p className="measure mt-2 text-[15px] leading-relaxed text-ink-soft">{v.texto}</p>}
        </div>

        <ul className="divide-y divide-line">
          {JUEGOS.map((j) => {
            const r = state[j.id]?.rating || 0
            return (
              <li key={j.id} className="grid gap-2 px-6 py-5 sm:grid-cols-[9rem_1fr_auto] sm:items-center sm:gap-5 sm:px-10">
                <span className="font-display text-lg text-ink">{j.titulo}</span>
                <span className="text-[14px] leading-relaxed text-ink-soft">{frase(j.id, r)}</span>
                <span className="justify-self-start sm:justify-self-end"><Rating value={r} /></span>
              </li>
            )
          })}
        </ul>

        <div className="border-t border-line px-6 py-5 sm:px-10">
          <Aviso compact />
        </div>
      </GameFrame>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button to="/cita" size="lg">Pide cita</Button>
        <button onClick={guardar} className="afterimage rounded-full border border-line-strong px-6 py-3 text-[15px] font-semibold text-ink transition hover:border-ink">
          Guardar / compartir
        </button>
        <button onClick={onReset} className="text-sm font-semibold text-accent hover:text-accent-dark">
          Volver a jugar
        </button>
        {msg && <span className="font-mono text-[12px] text-ink-soft">{msg}</span>}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}

function wrap(ctx, text, x, y, maxW, lh) {
  const words = String(text).split(' ')
  let line = ''
  let yy = y
  for (const w of words) {
    const test = line ? line + ' ' + w : w
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, yy)
      line = w
      yy += lh
    } else line = test
  }
  ctx.fillText(line, x, yy)
}
