import PageTransition from '../components/PageTransition.jsx'
import Container from '../components/Container.jsx'
import Button from '../components/Button.jsx'
import Reveal from '../components/Reveal.jsx'
import useTitle from '../lib/useTitle.js'
import { servicios } from '../data/servicios.jsx'

export default function Servicios() {
  useTitle('Servicios')
  return (
    <PageTransition>
      <section className="border-b border-line">
        <Container className="py-16 sm:py-24">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Servicios</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
            Cuatro servicios, cada uno con su tiempo y su método.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
            Sin ventas cruzadas ni prisa. Te explicamos qué te vamos a hacer, cuánto dura y qué conviene traer.
          </p>
        </Container>
      </section>

      {servicios.map((s, i) => {
        const Icon = s.icon
        return (
          <section key={s.id} id={s.id} className={`scroll-mt-24 border-b border-line ${i % 2 ? 'bg-surface-2' : ''}`}>
            <Container className="py-14 sm:py-20">
              <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
                <Reveal>
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary-soft text-primary">
                    <Icon className="h-8 w-8" />
                  </span>
                  <h2 className="mt-5 font-display text-2xl font-semibold text-ink sm:text-3xl">{s.titulo}</h2>
                  <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-ink-soft">{s.detalle}</p>
                  <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-3 text-sm">
                    <div>
                      <dt className="text-ink-soft">Duración</dt>
                      <dd className="mt-0.5 font-semibold text-ink">{s.duracion}</dd>
                    </div>
                    <div>
                      <dt className="text-ink-soft">Qué traer</dt>
                      <dd className="mt-0.5 max-w-xs font-semibold text-ink">{s.traer}</dd>
                    </div>
                  </dl>
                </Reveal>

                <Reveal delay={0.08}>
                  <div className="rounded-2xl border border-line bg-surface p-6 shadow-card sm:p-8">
                    <p className="text-sm font-semibold uppercase tracking-wider text-primary">Qué incluye</p>
                    <ul className="mt-4 space-y-3">
                      {s.incluye.map((item) => (
                        <li key={item} className="flex gap-3 text-[15px] text-ink">
                          <svg viewBox="0 0 20 20" className="mt-0.5 h-5 w-5 shrink-0 text-accent" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 10.5l4 4 8-9" />
                          </svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              </div>
            </Container>
          </section>
        )
      })}

      <section>
        <Container className="py-20 text-center sm:py-28">
          <Reveal className="mx-auto max-w-2xl">
            <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">¿Reservamos tu revisión?</h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">
              Elige día y hora y te confirmamos por teléfono. Sin compromiso.
            </p>
            <div className="mt-8 flex justify-center">
              <Button to="/cita" size="lg">Pide tu cita</Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </PageTransition>
  )
}
