import { useRef, useEffect } from 'react'

/*
 * Campo de puntos de colores (aire de lámina de Ishihara) donde `text` se lee
 * por diferencia de tono. Sesgado hacia la LEGIBILIDAD: el mensaje tiene que
 * entenderse. Robusto: siempre deja pintado el estado resuelto; la animación
 * de "resolverse" es un extra que solo corre con movimiento permitido, pestaña
 * visible y la lámina en pantalla.
 *
 * `pulso`: cuando la lámina ya está resuelta, los puntos rojos "laten" (van de
 * más a menos intensidad). Nunca baja de un rojo claro que sigue contrastando
 * con el fondo verde, así que el mensaje se lee siempre. Se apaga solo con
 * prefers-reduced-motion, pestaña oculta o lámina fuera de pantalla.
 *
 * `interactivo`: el cursor (o el dedo) aparta los puntos cercanos y los ilumina;
 * al soltarlos vuelven a su sitio con un muelle. Es siempre transitorio: en
 * reposo la lámina está intacta y legible, y si el bucle de animación se
 * atasca, un temporizador devuelve todo a su sitio.
 */
export default function DotField({ text = 'VES', className = '', ariaLabel, pulso = false, interactivo = false }) {
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

    // latido
    const PALE = [240, 168, 138] // hacia dónde se aclara el rojo en el valle
    const PULSE_MS = 2600
    const PULSE_DEPTH = 0.6 // 0 = sin efecto, 1 = rojo totalmente pálido (se perdería la palabra)
    let figDots = []
    let layer = null // capa estática con los puntos de fondo, para no repintarlos cada frame
    let pulseRaf = 0
    let ready = false // la lámina ya está resuelta y hay movimiento permitido
    let inView = true
    let pulseStart = 0

    // interacción con el cursor
    const GLOW = [255, 214, 160] // brillo cálido de los puntos rojos cerca del cursor
    const PUSH = 2.6 // fuerza con la que el cursor aparta los puntos
    const SPRING = 0.06 // fuerza del muelle que los devuelve a su sitio
    const DAMP = 0.84 // rozamiento (menor = más rebote)
    let R = 80 // radio de influencia del cursor, en px (se ajusta al ancho en build)
    let mx = 0
    let my = 0
    let pActive = false // ¿hay cursor/dedo sobre la lámina?
    let awake = false // ¿hay puntos desplazados o brillo pendiente de apagar?
    let glowK = 0 // 0..1, el brillo entra y sale suave
    let lastT = 0
    let snapT = 0
    let releaseT = 0

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
          const to = isFig ? FIG[(Math.random() * FIG.length) | 0] : GND[(Math.random() * GND.length) | 0]
          dots.push({
            x: jx,
            y: jy,
            r: baseR * (isFig ? 1.02 + Math.random() * 0.28 : 0.62 + Math.random() * 0.5),
            from: GND[(Math.random() * GND.length) | 0],
            to,
            css: `rgb(${to[0]},${to[1]},${to[2]})`,
            isFig,
            delay: isFig ? Math.random() * 0.4 : 0,
            ox: 0, // desplazamiento por el cursor
            oy: 0,
            vx: 0,
            vy: 0,
          })
        }
      }

      R = clamp(W * 0.11, 64, 120)
      awake = false
      glowK = 0

      if (pulso) {
        figDots = dots.filter((d) => d.isFig)
        layer = document.createElement('canvas')
        layer.width = W * dpr
        layer.height = H * dpr
        const lc = layer.getContext('2d')
        lc.setTransform(dpr, 0, 0, dpr, 0, 0)
        for (let i = 0; i < dots.length; i++) {
          const d = dots[i]
          if (d.isFig) continue
          lc.beginPath()
          lc.arc(d.x, d.y, d.r, 0, Math.PI * 2)
          lc.fillStyle = d.css
          lc.fill()
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

    const motionAllowed = () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Color de un punto rojo en el instante `now`: latido (mezcla hacia PALE) y,
    // si el cursor está cerca, brillo cálido (`glow` 0..1). El latido empieza en
    // el rojo intenso (coseno) y lleva un desfase pequeño según la x, para que
    // la onda respire en vez de parpadear toda a la vez.
    function figRGB(d, now, glow) {
      let m = 0
      if (pulso) {
        const elapsed = now - pulseStart
        const amp = Math.min(elapsed / 900, 1) // entra suave, sin tirón
        const t = (elapsed / PULSE_MS) * Math.PI * 2
        m = ((1 - Math.cos(t - (d.x / W) * 1.1)) / 2) * PULSE_DEPTH * amp
      }
      let r = d.to[0] + (PALE[0] - d.to[0]) * m
      let g = d.to[1] + (PALE[1] - d.to[1]) * m
      let b = d.to[2] + (PALE[2] - d.to[2]) * m
      if (glow > 0) {
        r += (GLOW[0] - r) * glow
        g += (GLOW[1] - g) * glow
        b += (GLOW[2] - b) * glow
      }
      return `rgb(${r | 0},${g | 0},${b | 0})`
    }

    // Reposo (sin puntos desplazados): fondo de la capa cacheada + solo los
    // puntos rojos. Es la vía barata, la que corre casi siempre.
    function paintPulse(now) {
      if (!W || !H || !layer) return
      ctx.clearRect(0, 0, W, H)
      ctx.drawImage(layer, 0, 0, W, H)
      for (let i = 0; i < figDots.length; i++) {
        const d = figDots[i]
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fillStyle = figRGB(d, now, 0)
        ctx.fill()
      }
    }

    // Con el cursor encima: hay que repintar todos los puntos en su posición
    // desplazada (la capa cacheada ya no vale).
    function paintLive(now) {
      if (!W || !H) return
      ctx.clearRect(0, 0, W, H)
      const R2 = R * R
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i]
        const x = d.x + d.ox
        const y = d.y + d.oy
        let glow = 0
        if (d.isFig && glowK > 0.01) {
          const dx = x - mx
          const dy = y - my
          const dd = dx * dx + dy * dy
          if (dd < R2) {
            const f = 1 - Math.sqrt(dd) / R
            glow = f * f * 0.65 * glowK
          }
        }
        ctx.beginPath()
        ctx.arc(x, y, d.r, 0, Math.PI * 2)
        ctx.fillStyle = d.isFig ? figRGB(d, now, glow) : d.css
        ctx.fill()
      }
    }

    function settle() {
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i]
        d.ox = d.oy = d.vx = d.vy = 0
      }
      awake = false
      glowK = 0
    }

    // Un paso de física: el cursor repele (más cuanto más cerca) y un muelle
    // devuelve cada punto a su sitio. Devuelve si aún queda algo en movimiento.
    function stepDots(dt) {
      const R2 = R * R
      const damp = Math.pow(DAMP, dt)
      let moving = false
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i]
        if (pActive) {
          const dx = d.x + d.ox - mx
          const dy = d.y + d.oy - my
          const dd = dx * dx + dy * dy
          if (dd < R2 && dd > 0.01) {
            const dist = Math.sqrt(dd)
            const k = 1 - dist / R
            const f = k * k * PUSH * dt
            d.vx += (dx / dist) * f
            d.vy += (dy / dist) * f
          }
        }
        d.vx -= d.ox * SPRING * dt
        d.vy -= d.oy * SPRING * dt
        d.vx *= damp
        d.vy *= damp
        d.ox += d.vx * dt
        d.oy += d.vy * dt
        if (!moving && (Math.abs(d.ox) > 0.05 || Math.abs(d.oy) > 0.05 || Math.abs(d.vx) > 0.02 || Math.abs(d.vy) > 0.02)) moving = true
      }
      glowK += ((pActive ? 1 : 0) - glowK) * Math.min(0.14 * dt, 1)
      if (glowK > 0.02) moving = true
      return moving
    }

    function liveFrame(now) {
      pulseRaf = 0
      if (!ready || !inView || document.visibilityState !== 'visible') {
        lastT = 0
        return
      }
      const dt = lastT ? Math.min((now - lastT) / 16.667, 3) : 1
      lastT = now
      const wasAwake = awake
      awake = interactivo ? stepDots(dt) : false
      if (awake) {
        paintLive(now)
      } else {
        if (wasAwake) settle() // acaba de asentarse: offsets exactamente a cero
        if (!pulso) {
          paint(1) // sin latido y todo en reposo: estático y a dormir
          lastT = 0
          return
        }
        paintPulse(now)
      }
      pulseRaf = requestAnimationFrame(liveFrame)
    }

    // Arranca o pausa el bucle según el estado actual (nunca hay dos a la vez).
    function syncLive() {
      const run = ready && inView && document.visibilityState === 'visible' && (pulso || awake || pActive)
      if (run && !pulseRaf) pulseRaf = requestAnimationFrame(liveFrame)
      if (!run && pulseRaf) {
        cancelAnimationFrame(pulseRaf)
        pulseRaf = 0
      }
    }

    function startLive() {
      if (ready || !(pulso || interactivo) || !motionAllowed()) return
      ready = true
      pulseStart = performance.now()
      syncLive()
    }

    // Red de seguridad de la interacción: si por lo que sea el bucle se atasca
    // con puntos fuera de sitio, los devuelve y repinta el estado de reposo.
    function snapBack() {
      if (!awake && !pActive && glowK === 0) return
      cancelAnimationFrame(pulseRaf)
      pulseRaf = 0
      pActive = false
      settle()
      if (pulso && layer) paintPulse(performance.now())
      else paint(1)
      syncLive()
    }

    function playIntro() {
      if (played) return
      played = true
      const motionOK = motionAllowed()
      if (!motionOK || document.visibilityState !== 'visible') {
        resolvedNow()
        startLive() // si la pestaña estaba oculta, syncLive espera a que se vea
        return
      }
      build()
      const t0 = performance.now()
      const dur = 850
      const tick = (now) => {
        const p = Math.min((now - t0) / dur, 1)
        paint(p)
        if (p < 1) {
          raf = requestAnimationFrame(tick)
        } else {
          clearTimeout(safety) // la intro terminó bien: que la red de seguridad no pise el latido
          startLive()
        }
      }
      paint(0)
      raf = requestAnimationFrame(tick)
      // red de seguridad: si rAF va lento, deja el mensaje legible igualmente
      safety = window.setTimeout(() => {
        cancelAnimationFrame(raf)
        paint(1)
        startLive()
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
        if (played) startLive() // por si el resize cortó la intro a medias
        syncLive()
      }, 180)
    }
    window.addEventListener('resize', onResize)

    // El latido y la interacción solo corren con la lámina a la vista y la
    // pestaña visible; con "reducir movimiento" no se activa nada de esto.
    let viewIO = null
    const onVisibility = () => syncLive()
    const live = (pulso || interactivo) && motionAllowed()
    if (live) {
      viewIO = new IntersectionObserver(
        (entries) => {
          inView = entries.some((e) => e.isIntersecting)
          syncLive()
        },
        { threshold: 0 },
      )
      viewIO.observe(wrap)
      document.addEventListener('visibilitychange', onVisibility)
    }

    // Cursor y dedo comparten los eventos de puntero. No se llama a
    // preventDefault, así que el scroll vertical en móvil sigue funcionando
    // (el navegador lo reclama con pointercancel y todo vuelve a su sitio).
    const onMove = (e) => {
      if (!ready) return
      const rc = canvas.getBoundingClientRect()
      mx = e.clientX - rc.left
      my = e.clientY - rc.top
      pActive = true
      awake = true
      clearTimeout(snapT)
      clearTimeout(releaseT)
      syncLive()
    }
    const onLeave = () => {
      pActive = false
      clearTimeout(snapT)
      snapT = window.setTimeout(snapBack, 1600)
    }
    const onUp = (e) => {
      if (e.pointerType === 'mouse') return
      clearTimeout(releaseT)
      releaseT = window.setTimeout(onLeave, 350) // deja ver el "toque" en táctil
    }
    if (interactivo && motionAllowed()) {
      wrap.addEventListener('pointermove', onMove)
      wrap.addEventListener('pointerdown', onMove)
      wrap.addEventListener('pointerup', onUp)
      wrap.addEventListener('pointerleave', onLeave)
      wrap.addEventListener('pointercancel', onLeave)
    }

    return () => {
      io.disconnect()
      if (viewIO) viewIO.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('resize', onResize)
      wrap.removeEventListener('pointermove', onMove)
      wrap.removeEventListener('pointerdown', onMove)
      wrap.removeEventListener('pointerup', onUp)
      wrap.removeEventListener('pointerleave', onLeave)
      wrap.removeEventListener('pointercancel', onLeave)
      cancelAnimationFrame(raf)
      cancelAnimationFrame(pulseRaf)
      clearTimeout(safety)
      clearTimeout(resizeT)
      clearTimeout(ioFallback)
      clearTimeout(snapT)
      clearTimeout(releaseT)
    }
  }, [text, pulso, interactivo])

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
