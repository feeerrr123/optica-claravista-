import { motion, useReducedMotion } from 'framer-motion'

/* Piezas compartidas de los juegos para la vista. */

export function Rating({ value, size = 'md' }) {
  const dot = size === 'lg' ? 'h-3.5 w-3.5' : 'h-2.5 w-2.5'
  return (
    <span className="inline-flex gap-1.5" aria-label={`${value} de 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`${dot} rounded-full ${i <= value ? 'bg-accent' : 'bg-line-strong'}`}
        />
      ))}
    </span>
  )
}

export function Aviso({ compact = false }) {
  return (
    <p className={`text-ink-soft ${compact ? 'text-[12px] leading-relaxed' : 'text-[13px] leading-relaxed'}`}>
      <strong className="font-display text-ink">Es un juego.</strong> La pantalla, la luz y la distancia
      cambian el resultado. Para saber de verdad cómo andas de vista, hazte una revisión — gratis si te
      gradúas con nosotros.
    </p>
  )
}

/* Contenedor visual del juego: recuadro con filete, sin sombra. */
export function GameFrame({ children, className = '' }) {
  return (
    <div className={`rounded-2xl border border-line-strong bg-surface ${className}`}>{children}</div>
  )
}

/* Pantalla de introducción de una ronda. */
export function Intro({ juego, children, onStart }) {
  return (
    <GameFrame className="p-6 sm:p-10">
      <p className="font-mono text-sm text-accent">
        Ronda {juego.n} de 4 · {juego.nivel}
      </p>
      <h2 className="mt-2 font-display text-2xl text-ink sm:text-3xl">{juego.titulo}</h2>
      <div className="measure mt-4 space-y-3 text-[15px] leading-relaxed text-ink-soft">{children}</div>
      <div className="mt-6">
        <Aviso />
      </div>
      <button
        onClick={onStart}
        className="afterimage mt-7 inline-flex items-center justify-center rounded-full bg-accent px-7 py-3 text-[15px] font-semibold text-bg transition hover:bg-accent-dark"
      >
        Empezar
      </button>
    </GameFrame>
  )
}

/* Pantalla de resultado de una ronda. */
export function Resultado({ juego, rating, frase, detalle, onNext, esUltimo }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <GameFrame className="p-6 text-center sm:p-10">
        <p className="font-mono text-sm text-ink-soft">Ronda {juego.n} · {juego.titulo}</p>
        <div className="mt-4 flex justify-center">
          <Rating value={rating} size="lg" />
        </div>
        <p className="measure mx-auto mt-4 text-[17px] leading-relaxed text-ink">{frase}</p>
        {detalle && <p className="mt-2 font-mono text-[13px] text-ink-soft">{detalle}</p>}
        <button
          onClick={onNext}
          className="afterimage mt-7 inline-flex items-center justify-center rounded-full bg-accent px-7 py-3 text-[15px] font-semibold text-bg transition hover:bg-accent-dark"
        >
          {esUltimo ? 'Ver tu carné visual' : 'Siguiente juego'}
        </button>
      </GameFrame>
    </motion.div>
  )
}

/* Botones grandes de dirección (agudeza / contraste). */
export function ArrowPad({ dirs = ['up', 'right', 'down', 'left'], onPick, disabled }) {
  const glyph = { up: 'M12 5v14M6 11l6-6 6 6', right: 'M5 12h14M13 6l6 6-6 6', down: 'M12 5v14M6 13l6 6 6-6', left: 'M19 12H5M11 6l-6 6 6 6' }
  const label = { up: 'arriba', right: 'derecha', down: 'abajo', left: 'izquierda' }
  return (
    <div className="mx-auto grid w-[13.5rem] grid-cols-3 grid-rows-3 gap-2">
      {dirs.map((d) => (
        <button
          key={d}
          disabled={disabled}
          onClick={() => onPick(d)}
          aria-label={`El hueco apunta a la ${label[d]}`}
          style={{ gridArea: { up: '1 / 2', right: '2 / 3', down: '3 / 2', left: '2 / 1' }[d] }}
          className="afterimage grid h-16 w-16 place-items-center rounded-xl border border-line-strong bg-bg text-ink transition hover:border-ink disabled:opacity-40"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d={glyph[d]} />
          </svg>
        </button>
      ))}
    </div>
  )
}
