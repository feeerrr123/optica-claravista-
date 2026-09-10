import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageTransition from '../components/PageTransition.jsx'
import Container from '../components/Container.jsx'
import Button from '../components/Button.jsx'
import Reveal from '../components/Reveal.jsx'
import DotField from '../components/DotField.jsx'
import Photo from '../components/Photo.jsx'
import useTitle from '../lib/useTitle.js'
import { photos } from '../data/media.js'

const mide = [
  ['Agudeza visual', 'Cuánto ves de lejos y de cerca, con y sin corrección.'],
  ['Refracción', 'Tu graduación exacta: esfera, cilindro y eje. El "¿así, o así?".'],
  ['Salud ocular', 'Revisión del fondo de ojo y de la superficie.'],
  ['Presión intraocular', 'Una medida rápida que conviene tener controlada.'],
  ['Visión binocular', 'Cómo trabajan los dos ojos juntos, sobre todo en niños.'],
]

const pasos = [
  ['01', 'Pides cita', 'Desde la web, por teléfono o WhatsApp. Elige día y franja; confirmamos nosotros.'],
  ['02', 'Te revisamos', 'Media hora sin prisa. Sales con tu graduación y, si hace falta, un informe.'],
  ['03', 'Eliges montura', 'Te enseñamos lo que encaja contigo. Sin ventas cruzadas.'],
  ['04', 'Ajuste y seguimiento', 'Recoges, ajustamos, y el primer mes afinamos la graduación sin coste.'],
]

function AB() {
  const [sel, setSel] = useState(0)
  const opts = ['Montura fina de metal', 'Acetato con más presencia']
  return (
    <div className="mt-6 inline-flex flex-col gap-2 rounded-2xl border border-line-strong bg-surface p-2 sm:flex-row">
      {opts.map((o, i) => (
        <button
          key={o}
          onClick={() => setSel(i)}
          className={`afterimage rounded-xl px-4 py-3 text-left text-sm transition-colors ${
            sel === i ? 'bg-accent text-bg' : 'text-ink-soft hover:text-ink'
          }`}
          aria-pressed={sel === i}
        >
          <span className="font-mono text-[11px] opacity-70">{i === 0 ? 'así' : 'o así'}</span>
          <span className="mt-0.5 block font-medium">{o}</span>
        </button>
      ))}
    </div>
  )
}

export default function Home() {
  useTitle()
  return (
    <PageTransition>
      {/* ── Hero: lámina ── */}
      <section>
        <DotField
          text="VES"
          className="h-[38vh] min-h-[260px] w-full sm:h-[46vh] sm:min-h-[380px]"
          ariaLabel="Campo de puntos de colores en el que se lee «VES»"
        />
        <Container className="border-b border-line py-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft">
            Lámina de Ishihara · así medimos cómo distingues los colores
          </p>
        </Container>
      </section>

      {/* ── Propuesta + acción ── */}
      <section className="border-b border-line">
        <Container className="py-12 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <div>
              <h1 className="font-display text-[2rem] leading-[1.12] text-ink sm:text-[2.9rem]">
                Y si no ves bien, lo medimos y lo arreglamos.
              </h1>
              <p className="measure mt-5 text-lg leading-relaxed text-ink-soft">
                Óptica de barrio en [ciudad] desde 1998. Dos generaciones en el mismo local,
                graduando la vista con calma y sin venderte de más.
              </p>
            </div>
            <div className="lg:pb-1">
              <Button to="/cita" size="lg" className="w-full sm:w-auto">Pide cita</Button>
              <div className="mt-4">
                <Link to="/servicios" className="text-sm font-semibold text-accent hover:text-accent-dark">
                  Ver qué hacemos →
                </Link>
              </div>
            </div>
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
            {[
              ['Dónde', '[Calle], [ciudad]'],
              ['Teléfono', '[000 00 00 00]'],
              ['Hoy', 'abierto hasta 20:30'],
              ['Revisión', 'unos 30 min'],
            ].map(([k, v]) => (
              <div key={k} className="bg-bg p-4">
                <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft">{k}</dt>
                <dd className="mt-1 text-sm font-medium text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* ── Qué mide una revisión ── */}
      <section className="border-b border-line">
        <Container className="py-16 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-start lg:gap-16">
            <Reveal>
              <h2 className="font-display text-3xl text-ink sm:text-[2.4rem]">Qué mide una revisión</h2>
              <p className="measure mt-4 text-lg leading-relaxed text-ink-soft">
                No es "mira esta letra y ya". Una revisión completa toca cinco cosas, y te
                contamos qué sale en cada una.
              </p>
              <div className="mt-8">
                <Photo src={photos.examen.src} alt={photos.examen.alt} ratio="4/3" className="rounded-xl" priority />
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <ol className="divide-y divide-line border-y border-line">
                {mide.map(([t, d], i) => (
                  <li key={t} className="grid grid-cols-[2.5rem_1fr] gap-x-4 py-5">
                    <span className="font-mono text-sm text-accent">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <h3 className="font-display text-lg text-ink">{t}</h3>
                      <p className="mt-1 text-[15px] leading-relaxed text-ink-soft">{d}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ── Montura ── */}
      <section className="border-b border-line bg-surface-2">
        <Container className="py-16 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16">
            <Reveal>
              <Photo src={photos.paredMonturas.src} alt={photos.paredMonturas.alt} ratio="3/2" className="rounded-xl" />
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="font-display text-3xl text-ink sm:text-[2.4rem]">Y luego, la montura</h2>
              <p className="measure mt-4 text-lg leading-relaxed text-ink-soft">
                La mitad del trabajo es elegir bien. Miramos tu cara, tu graduación y para qué
                las quieres, y te enseñamos tres o cuatro que de verdad te sirven —no toda la pared.
              </p>
              <AB />
              <div className="mt-8">
                <Button to="/monturas" variant="ghost">Ver el catálogo</Button>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ── Teaser juegos ── */}
      <section className="border-b border-line">
        <Container className="py-16 sm:py-24">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
            <Reveal>
              <h2 className="font-display text-3xl text-ink sm:text-[2.4rem]">¿Qué tal andas de vista?</h2>
              <p className="measure mt-4 text-lg leading-relaxed text-ink-soft">
                Cuatro juegos rápidos —color, agudeza, contraste y visión 3D— de fácil a difícil.
                Al acabar, tu carné visual con el nivel de cada uno. No es un diagnóstico; es para
                picar la curiosidad.
              </p>
              <div className="mt-8">
                <Button to="/juegos" size="lg">Jugar</Button>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <ol className="divide-y divide-line border-y border-line font-mono text-sm">
                {[
                  ['01', 'Color', 'Fácil'],
                  ['02', 'Agudeza', 'Normal'],
                  ['03', 'Contraste', 'Difícil'],
                  ['04', 'Visión 3D', 'Muy difícil'],
                ].map(([n, t, d]) => (
                  <li key={n} className="grid grid-cols-[2.5rem_1fr_auto] items-center py-3.5">
                    <span className="text-accent">{n}</span>
                    <span className="font-sans text-[15px] font-semibold text-ink">{t}</span>
                    <span className="text-ink-soft">{d}</span>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ── Proceso ── */}
      <section className="border-b border-line bg-surface-2">
        <Container className="py-16 sm:py-24">
          <Reveal>
            <h2 className="font-display text-3xl text-ink sm:text-[2.4rem]">Tu cita, paso a paso</h2>
          </Reveal>
          <ol className="mt-10 divide-y divide-line border-y border-line">
            {pasos.map(([n, t, d], i) => (
              <Reveal as="li" key={n} delay={i * 0.05} className="grid gap-2 py-6 sm:grid-cols-[4rem_12rem_1fr] sm:items-baseline sm:gap-6">
                <span className="font-mono text-sm text-accent">{n}</span>
                <h3 className="font-display text-lg text-ink">{t}</h3>
                <p className="measure text-[15px] leading-relaxed text-ink-soft">{d}</p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* ── Confianza ── */}
      <section className="border-b border-line bg-ink text-bg">
        <Container className="py-16 sm:py-20">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <Reveal>
              <h2 className="font-display text-3xl sm:text-[2.4rem]">Seguimos en el mismo sitio</h2>
              <p className="measure mt-4 text-lg leading-relaxed text-bg/70">
                Desde 1998, dos generaciones de ópticos en el mismo local. Nos vas a ver por el
                barrio: respondemos por lo que vendemos, y el primer mes ajustamos la graduación
                sin coste si te cuesta adaptarte.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <dl className="grid grid-cols-3 gap-6 font-mono">
                {[['+25', 'años'], ['9k+', 'revisiones'], ['4,9', 'valoración']].map(([n, l]) => (
                  <div key={l}>
                    <dd className="text-3xl text-bg">{n}</dd>
                    <dt className="mt-1 text-xs text-bg/50">{l}</dt>
                  </div>
                ))}
              </dl>
              <p className="mt-5 text-[11px] text-bg/40">Cifras de ejemplo — se sustituyen por las reales.</p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ── CTA ── */}
      <section>
        <DotField
          text="CITA"
          className="h-[30vh] min-h-[220px] w-full sm:h-[36vh]"
          ariaLabel="Campo de puntos en el que se lee «CITA»"
        />
        <Container className="py-12 text-center">
          <p className="measure mx-auto text-lg leading-relaxed text-ink-soft">
            Elige día y hora. Te confirmamos por teléfono en horario de tienda.
          </p>
          <div className="mt-6 flex justify-center">
            <Button to="/cita" size="lg">Pide tu cita</Button>
          </div>
        </Container>
      </section>
    </PageTransition>
  )
}
