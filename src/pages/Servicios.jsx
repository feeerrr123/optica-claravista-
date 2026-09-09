import PageTransition from '../components/PageTransition.jsx'
import Container from '../components/Container.jsx'
import Button from '../components/Button.jsx'
import Reveal from '../components/Reveal.jsx'
import Photo from '../components/Photo.jsx'
import useTitle from '../lib/useTitle.js'
import { servicios } from '../data/servicios.jsx'
import { photos } from '../data/media.js'

const foto = {
  graduacion: photos.instrumento,
  lentillas: photos.pareja,
  sol: photos.vintage,
  infantil: photos.cartaOptotipos,
}

export default function Servicios() {
  useTitle('Servicios')
  return (
    <PageTransition>
      <section className="border-b border-line">
        <Container className="pb-14 pt-10 sm:py-24">
          <h1 className="max-w-4xl font-display text-4xl leading-[1.1] text-ink sm:text-[3.2rem]">
            Cuatro servicios, cada uno con su tiempo.
          </h1>
          <p className="measure mt-5 text-lg leading-relaxed text-ink-soft">
            Sin ventas cruzadas ni prisa. Te contamos qué te vamos a hacer, cuánto dura y
            qué conviene traer.
          </p>
        </Container>
      </section>

      {servicios.map((s, i) => {
        const p = foto[s.id]
        return (
          <section key={s.id} id={s.id} className={`scroll-mt-24 border-b border-line ${i % 2 ? 'bg-surface-2' : ''}`}>
            <Container className="py-14 sm:py-20">
              <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
                <Reveal className={i % 2 ? 'lg:order-2' : ''}>
                  <Photo src={p.src} alt={p.alt} ratio="4/3" className="rounded-xl" priority={i === 0} />
                </Reveal>
                <Reveal delay={0.08}>
                  <p className="font-mono text-sm text-accent">{String(i + 1).padStart(2, '0')}</p>
                  <h2 className="mt-2 font-display text-2xl text-ink sm:text-[2rem]">{s.titulo}</h2>
                  <p className="measure mt-4 text-[17px] leading-relaxed text-ink-soft">{s.detalle}</p>

                  <ul className="mt-6 divide-y divide-line border-y border-line">
                    {s.incluye.map((item) => (
                      <li key={item} className="flex items-center gap-3 py-2.5 text-[15px] text-ink">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-3 font-mono text-[13px]">
                    <div>
                      <dt className="text-ink-soft">Duración</dt>
                      <dd className="mt-0.5 text-ink">{s.duracion}</dd>
                    </div>
                    <div>
                      <dt className="text-ink-soft">Qué traer</dt>
                      <dd className="mt-0.5 max-w-xs text-ink">{s.traer}</dd>
                    </div>
                  </dl>
                </Reveal>
              </div>
            </Container>
          </section>
        )
      })}

      <section>
        <Container className="py-20 text-center sm:py-24">
          <h2 className="font-display text-3xl text-ink sm:text-[2.4rem]">¿Reservamos tu revisión?</h2>
          <p className="measure mx-auto mt-4 text-lg leading-relaxed text-ink-soft">
            Elige día y hora y te confirmamos por teléfono. Sin compromiso.
          </p>
          <div className="mt-8 flex justify-center">
            <Button to="/cita" size="lg">Pide cita</Button>
          </div>
        </Container>
      </section>
    </PageTransition>
  )
}
