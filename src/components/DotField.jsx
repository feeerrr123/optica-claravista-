import { useRef, useEffect } from 'react'

/*
 * Campo de puntos de colores (aire de lámina de Ishihara) donde `text` se lee
 * por diferencia de tono. Sesgado hacia la LEGIBILIDAD: el mensaje tiene que
 * entenderse. Robusto: siempre deja pintado el estado resuelto; la animación
 * de "resolverse" es un extra que solo corre con movimiento permitido, pestaña
 * visible y la lámina en pantalla.
 */
export default function DotField({ text = 'VES', className = '', ariaLabel }) {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const ctx = canvas.getContext('2d')
    let raf = 0
    let safety = 0
    let resizeT = 0
    let dots = []
    let W = 0
    let H = 0
    let played = false

    // figura = rojo-teja saturado; fondo = verdes/grises de luminancia parecida
    const FIG = [[196, 78, 52], [212, 104, 60], [176, 66, 54]]
    const GND = [[122, 146, 108], [92, 138, 130], [150, 146, 116], [182, 168, 146], [134, 152, 128]]

    function build() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = Math.round(wrap.clientWidth)
      H = Math.round(wrap.clientHeight)
      if (W < 8 || H < 8) return
      canvas.width = W * dpr
      canvas.height = H * dpr
      canvas.style.width = W + 'px'
      canvas.style.height = H + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // máscara del texto
      const mask = document.createElement('canvas')
      mask.width = W
      mask.height = H
      const m = mask.getContext('2d')
      m.fillStyle = '#000'
      m.textAlign = 'center'
      m.textBaseline = 'middle'
      const fs = Math.min(H * 0.7, (W * 0.92) / Math.max(text.length, 1) * 1.62)
      m.font = `800 ${fs}px "Bricolage Grotesque", "Hanken Grotesk", sans-serif`
      m.fillText(text, W / 2, H / 2 + fs * 0.03)
      const md = m.getImageData(0, 0, W, H).data
      const hit = (x, y) => {
        const px = x < 0 ? 0 : x >= W ? W - 1 : x
        const py = y < 0 ? 0 : y >= H ? H - 1 : y
        return md[((py | 0) * W + (px | 0)) * 4 + 3] > 100
      }

      const gap = clamp(W / 74, 4.6, 7.4)
      const baseR = gap * 0.46
      const dil = gap * 1.35 // engorda los trazos para que se lean
      dots = []
      let rowN = 0
      for (let y = gap; y < H - gap * 0.3; y += gap * 0.9, rowN++) {
        const xoff = rowN % 2 ? gap / 2 : 0
        for (let x = gap * 0.6 + xoff; x < W - gap * 0.3; x += gap) {
          // ¿figura? con dilatación: mira alrededor
          let isFig = hit(x, y)
          if (!isFig) {
            isFig =
              hit(x + dil, y) || hit(x - dil, y) || hit(x, y + dil) || hit(x, y - dil) ||
              hit(x + dil * 0.7, y + dil * 0.7) || hit(x - dil * 0.7, y - dil * 0.7)
          }
          const jit = isFig ? gap * 0.16 : gap * 0.32
          const jx = x + (Math.random() - 0.5) * jit
          const jy = y + (Math.random() - 0.5) * jit
          dots.push({
            x: jx,
            y: jy,
            r: baseR * (isFig ? 1.02 + Math.random() * 0.28 : 0.62 + Math.random() * 0.5),
            from: GND[(Math.random() * GND.length) | 0],
            to: isFig ? FIG[(Math.random() * FIG.length) | 0] : GND[(Math.random() * GND.length) | 0],
            isFig,
            delay: isFig ? Math.random() * 0.4 : 0,
          })
        }
      }
    }

    function paint(p) {
      if (!W || !H) return
      ctx.clearRect(0, 0, W, H)
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i]
        let c = d.to
        if (d.isFig && p < 1) {
          const t = clamp((p - d.delay) / ((1 - d.delay) || 1), 0, 1)
          const e = 1 - Math.pow(1 - t, 3)
          c = [d.from[0] + (d.to[0] - d.from[0]) * e, d.from[1] + (d.to[1] - d.from[1]) * e, d.from[2] + (d.to[2] - d.from[2]) * e]
          if (t > 0.5 && t < 0.82) c = [clamp(c[0] + 45, 0, 255), clamp(c[1] + 22, 0, 255), clamp(c[2] + 14, 0, 255)]
        }
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})`
        ctx.fill()
      }
    }

    function resolvedNow() {
      build()
      paint(1)
    }

    function playIntro() {
      if (played) return
      played = true
      const motionOK = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (!motionOK || document.visibilityState !== 'visible') {
        resolvedNow()
        return
      }
      build()
      const t0 = performance.now()
      const dur = 850
      const tick = (now) => {
        const p = Math.min((now - t0) / dur, 1)
        paint(p)
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      paint(0)
      raf = requestAnimationFrame(tick)
      // red de seguridad: si rAF va lento, deja el mensaje legible igualmente
      safety = window.setTimeout(() => {
        cancelAnimationFrame(raf)
        paint(1)
      }, dur + 350)
    }

    // pinta el fondo (sin mensaje) cuanto antes; el mensaje entra con playIntro
    build()
    paint(0)
    if (document.fonts && document.fonts.status !== 'loaded') {
      document.fonts.ready.then(() => {
        if (!played) {
          build()
          paint(0)
        }
      })
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect()
          playIntro()
        }
      },
      { threshold: 0.2 },
    )
    io.observe(wrap)
    // por si el observer no dispara (algún navegador raro / test)
    const ioFallback = window.setTimeout(() => {
      io.disconnect()
      playIntro()
    }, 600)
    safety = safety || 0

    const onResize = () => {
      clearTimeout(resizeT)
      resizeT = window.setTimeout(() => {
        cancelAnimationFrame(raf)
        clearTimeout(safety)
        build()
        paint(1)
      }, 180)
    }
    window.addEventListener('resize', onResize)

    return () => {
      io.disconnect()
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(raf)
      clearTimeout(safety)
      clearTimeout(resizeT)
      clearTimeout(ioFallback)
    }
  }, [text])

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ background: 'rgb(var(--c-bg))' }}
      role="img"
      aria-label={ariaLabel || `Campo de puntos de colores en el que se lee «${text}»`}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  )
}

const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
