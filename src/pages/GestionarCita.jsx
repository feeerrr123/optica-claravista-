import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import PageTransition from '../components/PageTransition.jsx'
import Container from '../components/Container.jsx'
import Agenda from '../components/Agenda.jsx'
import useTitle from '../lib/useTitle.js'
import { fechaISO } from '../lib/horario.js'
import { peticionJSON } from '../lib/api.js'

export default function GestionarCita() {
  useTitle('Gestionar tu cita', 'Cambia el día y la hora o cancela tu cita en Óptica Claravista.')
  const { token } = useParams()
  const [estado, setEstado] = useState('cargando') // cargando | ok | cambiando | cancelada | error
  const [cita, setCita] = useState(null)
  const [error, setError] = useState('')
  const [anuncio, setAnuncio] = useState('')

  async function cargar() {
    try {
      const d = await peticionJSON(`/api/citas/${token}`)
      setCita(d)
      setEstado('ok')
    } catch (err) {
      setError(err.message || 'No encontramos esa cita.')
      setEstado('error')
    }
  }

  useEffect(() => {
    cargar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  async function cancelar() {
    if (!window.confirm('¿Seguro que quieres cancelar esta cita?')) return
    try {
      await peticionJSON(`/api/citas/${token}`, { method: 'DELETE' })
      setEstado('cancelada')
      setAnuncio('Cita cancelada.')
    } catch (err) {
      setError(err.message || 'No se pudo cancelar.')
    }
  }

  async function cambiarHora({ fecha, hora }) {
    const d = await peticionJSON(`/api/citas/${token}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fecha: fechaISO(fecha), hora }),
    })
    await cargar()
    setEstado('ok')
    setAnuncio(`Cita movida al ${d.fechaLarga} a las ${d.hora}.`)
  }

  return (
    <PageTransition>
      <p role="status" aria-live="polite" className="sr-only">{anuncio}</p>
      <section>
        <Container className="py-16 sm:py-24">
          <div className="mx-auto max-w-lg">
            <h1 className="font-display text-3xl text-ink sm:text-4xl">Tu cita</h1>

            <div className="mt-8 rounded-2xl border border-line-strong bg-surface p-6 sm:p-8">
              {estado === 'cargando' && <p className="text-[15px] text-ink-soft">Buscando tu cita…</p>}

              {estado === 'error' && (
                <div>
                  <p className="text-[15px] text-ink">{error}</p>
                  <Link to="/cita" className="mt-4 inline-block text-sm font-semibold text-accent hover:text-accent-dark">
                    Pedir una cita nueva →
                  </Link>
                </div>
              )}

              {estado === 'cancelada' && (
                <div className="text-center">
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-accent text-accent">
                    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
                  </span>
                  <h2 className="mt-5 font-display text-2xl text-ink">Cita cancelada</h2>
                  <p className="mt-2 text-[15px] text-ink-soft">Cuando quieras, puedes pedir otra.</p>
                  <Link to="/cita" className="mt-5 inline-block text-sm font-semibold text-accent hover:text-accent-dark">
                    Pedir cita →
                  </Link>
                </div>
              )}

              {estado === 'ok' && cita && (
                <div>
                  <p className="text-sm font-medium text-ink">{cita.nombre}</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-ink-soft">
                    <strong className="text-ink">{cita.servicio}</strong> — {cita.fechaLarga} a las{' '}
                    <span className="font-mono">{cita.hora}</span>
                  </p>

                  {error && (
                    <p role="alert" className="mt-3 text-sm font-medium text-accent">{error}</p>
                  )}

                  {!cita.puedeGestionar ? (
                    <p className="mt-6 text-[15px] leading-relaxed text-ink-soft">
                      Quedan menos de 12h para tu cita, así que ya no se puede cambiar por aquí.
                      Llámanos al <strong className="text-ink">{cita.telefonoContacto}</strong> y te ayudamos.
                    </p>
                  ) : (
                    <>
                      <div className="mt-6 flex flex-wrap gap-3 border-t border-line pt-6">
                        <button
                          onClick={() => setEstado('cambiando')}
                          className="afterimage rounded-full border border-line-strong px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-ink"
                        >
                          Cambiar día u hora
                        </button>
                        <button
                          onClick={cancelar}
                          className="text-sm font-semibold text-accent hover:text-accent-dark"
                        >
                          Cancelar cita
                        </button>
                      </div>
                      <p className="mt-4 font-mono text-[11px] text-ink-soft">
                        Puedes gestionarla tú mismo hasta 12h antes de la hora reservada.
                      </p>
                    </>
                  )}
                </div>
              )}

              {estado === 'cambiando' && cita && (
                <div>
                  <button
                    type="button"
                    onClick={() => setEstado('ok')}
                    className="mb-5 text-sm font-semibold text-accent hover:text-accent-dark"
                  >
                    ← Cancelar el cambio
                  </button>
                  <Agenda duracion={cita.duracionMin} onElegir={cambiarHora} />
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>
    </PageTransition>
  )
}
