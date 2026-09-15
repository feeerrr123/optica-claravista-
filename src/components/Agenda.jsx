import { useMemo, useState } from 'react'
import { proximosDiasAbiertos, huecosDelDia, ocupado, formatoDiaCorto, formatoDiaLargo, DURACION_DEFECTO } from '../lib/horario.js'

// Calendario de dos pasos: elige día (tira horizontal), luego hora (rejilla).
// Sin backend: los huecos "ocupados" salen de un hash determinista sobre
// fecha+hora, así que se ven consistentes pero no son datos reales.
export default function Agenda({ duracion = DURACION_DEFECTO, onElegir }) {
  const dias = useMemo(() => proximosDiasAbiertos(12), [])
  const [diaSel, setDiaSel] = useState(dias[0])
  const [horaSel, setHoraSel] = useState(null)
  const huecos = useMemo(() => huecosDelDia(diaSel, duracion), [diaSel, duracion])

  function elegirDia(d) {
    setDiaSel(d)
    setHoraSel(null)
  }

  function elegirHora(h) {
    setHoraSel(h)
    onElegir({ fecha: diaSel, hora: h })
  }

  return (
    <div>
      <p className="text-sm font-medium text-ink">1. Elige un día</p>
      <div className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-2" role="group" aria-label="Días disponibles">
        {dias.map((d) => {
          const activo = d.toDateString() === diaSel.toDateString()
          const { semana, dia, mes } = formatoDiaCorto(d)
          return (
            <button
              key={d.toDateString()}
              type="button"
              onClick={() => elegirDia(d)}
              aria-pressed={activo}
              className={`afterimage shrink-0 rounded-xl border px-3.5 py-2.5 text-center transition ${
                activo ? 'border-accent bg-accent text-bg' : 'border-line-strong text-ink hover:border-ink'
              }`}
            >
              <span className={`block font-mono text-[11px] uppercase tracking-wide ${activo ? 'text-bg/75' : 'text-ink-soft'}`}>
                {semana}
              </span>
              <span className="mt-0.5 block text-[15px] font-semibold">
                {dia} {mes}
              </span>
            </button>
          )
        })}
      </div>

      <p className="mt-6 text-sm font-medium text-ink">
        2. Elige una hora <span className="font-normal text-ink-soft">— {formatoDiaLargo(diaSel)}</span>
      </p>
      {huecos.length === 0 ? (
        <p className="mt-3 text-sm text-ink-soft">Ese día no tenemos horario. Elige otro.</p>
      ) : (
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {huecos.map((h) => {
            const lleno = ocupado(diaSel, h)
            const activo = horaSel === h
            return (
              <button
                key={h}
                type="button"
                disabled={lleno}
                aria-pressed={activo}
                aria-label={lleno ? `${h}, no disponible` : `${h}, disponible`}
                onClick={() => elegirHora(h)}
                className={`afterimage rounded-lg border px-2 py-2.5 text-center font-mono text-sm transition ${
                  lleno
                    ? 'cursor-not-allowed border-line text-ink-soft/50 line-through decoration-line-strong'
                    : activo
                      ? 'border-accent bg-accent text-bg'
                      : 'border-line-strong text-ink hover:border-ink'
                }`}
              >
                {h}
              </button>
            )
          })}
        </div>
      )}
      <p className="mt-4 font-mono text-[11px] text-ink-soft">
        Cita de {duracion} min · algunos huecos de muestra ya salen ocupados.
      </p>
    </div>
  )
}
