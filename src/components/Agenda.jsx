import { useEffect, useMemo, useState } from 'react'
import { proximosDiasAbiertos, huecosDelDia, ocupado, formatoDiaCorto, formatoDiaLargo, fechaISO, DURACION_DEFECTO } from '../lib/horario.js'

// Calendario de dos pasos: elige día (tira horizontal), luego hora (rejilla).
// La disponibilidad real se pide a /api/disponibilidad; si no responde (o el
// backend aún no está configurado), se usa el mismo hash de siempre como
// demo para que el calendario no se quede vacío.
export default function Agenda({ duracion = DURACION_DEFECTO, diasIniciales, onElegir }) {
  const dias = useMemo(() => diasIniciales || proximosDiasAbiertos(12), [diasIniciales])
  const [diaSel, setDiaSel] = useState(dias[0])
  const [horaSel, setHoraSel] = useState(null)
  const [ocupadas, setOcupadas] = useState(null) // null = cargando
  const [demo, setDemo] = useState(false)
  const [reservando, setReservando] = useState(false)
  const [error, setError] = useState('')
  const huecos = useMemo(() => huecosDelDia(diaSel, duracion), [diaSel, duracion])

  useEffect(() => {
    let vivo = true
    setOcupadas(null)
    setError('')
    fetch(`/api/disponibilidad?fecha=${fechaISO(diaSel)}&duracion=${duracion}`)
      .then((r) => r.json())
      .then((d) => {
        if (!vivo) return
        setOcupadas(d.ocupadas || [])
        setDemo(!!d.demo)
      })
      .catch(() => {
        if (!vivo) return
        // sin conexión al backend: recurrimos al hash local para que se pueda seguir probando
        setOcupadas(huecosDelDia(diaSel, duracion).filter((h) => ocupado(diaSel, h)))
        setDemo(true)
      })
    return () => {
      vivo = false
    }
  }, [diaSel, duracion])

  function elegirDia(d) {
    setDiaSel(d)
    setHoraSel(null)
    setError('')
  }

  async function elegirHora(h) {
    if (reservando) return
    setHoraSel(h)
    setError('')
    setReservando(true)
    try {
      await onElegir({ fecha: diaSel, hora: h })
    } catch (err) {
      setError(err.message || 'No se pudo completar la reserva. Prueba otra vez.')
      setHoraSel(null)
      // el hueco puede haberse ocupado justo ahora: refrescamos la lista
      setOcupadas((prev) => (prev ? [...prev, h] : prev))
    } finally {
      setReservando(false)
    }
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
      ) : ocupadas === null ? (
        <p className="mt-3 text-sm text-ink-soft">Consultando disponibilidad…</p>
      ) : (
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {huecos.map((h) => {
            const lleno = ocupadas.includes(h)
            const activo = horaSel === h
            return (
              <button
                key={h}
                type="button"
                disabled={lleno || reservando}
                aria-pressed={activo}
                aria-label={lleno ? `${h}, no disponible` : `${h}, disponible`}
                onClick={() => elegirHora(h)}
                className={`afterimage rounded-lg border px-2 py-2.5 text-center font-mono text-sm transition ${
                  lleno
                    ? 'cursor-not-allowed border-line text-ink-soft/50 line-through decoration-line-strong'
                    : activo
                      ? 'border-accent bg-accent text-bg'
                      : 'border-line-strong text-ink hover:border-ink'
                } ${reservando && !activo ? 'opacity-50' : ''}`}
              >
                {activo && reservando ? '…' : h}
              </button>
            )
          })}
        </div>
      )}
      {error && (
        <p role="alert" className="mt-3 text-sm font-medium text-accent">
          {error}
        </p>
      )}
      <p className="mt-4 font-mono text-[11px] text-ink-soft">
        Cita de {duracion} min{demo ? ' · huecos de muestra (todavía sin conectar de verdad)' : ''}.
      </p>
    </div>
  )
}
