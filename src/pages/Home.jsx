import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import PageTransition from '../components/PageTransition.jsx'
import Container from '../components/Container.jsx'
import Button from '../components/Button.jsx'
import Reveal from '../components/Reveal.jsx'
import useTitle from '../lib/useTitle.js'
import { servicios } from '../data/servicios.jsx'

function HeroIllustration() {
  const reduce = useReducedMotion()
  return (
    <motion.svg
      viewBox="0 0 440 340"
      className="w-full"
      role="img"
      aria-label="Ilustración de unas gafas vistas de frente"
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <rect x="1" y="1" width="438" height="338" rx="22" fill="rgb(var(--c-surface))" stroke="rgb(var(--c-line))" />
      {/* filas de la carta optométrica, decrecientes */}
      <g fill="rgb(var(--c-ink) / 0.05)" fontFamily="Spectral, serif" fontWeight="600" textAnchor="middle">
        <text x="220" y="70" fontSize="34">E</text>
        <text x="220" y="104" fontSize="20" letterSpacing="6">F P</text>
        <text x="220" y="132" fontSize="13" letterSpacing="5">T O Z L</text>
      </g>
      {/* gafas de frente */}
      <g fill="none" stroke="rgb(var(--c-primary))" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="70" y="150" width="130" height="104" rx="34" fill="rgb(var(--c-primary) / 0.07)" />
        <rect x="240" y="150" width="130" height="104" rx="34" fill="rgb(var(--c-primary) / 0.07)" />
        <path d="M200 178c12-10 28-10 40 0" />
        <path d="M70 176c-16 4-26 2-34-6M370 176c16 4 26 2 34-6" />
      </g>
      {/* brillo de acento en una lente */}
      <path d="M96 232c4-22 18-38 40-44" stroke="rgb(var(--c-accent))" strokeWidth="4" strokeLinecap="round" fill="none" />
    </motion.svg>
  )
}

const frames = [
  { name: 'Acetato redondo', d: 'M12 26c0-11 7-16 22-16s22 5 22 16-7 18-22 18-22-7-22-18z' },
  { name: 'Metal fino', d: 'M10 24c0-8 6-12 20-12s20 4 20 12-6 14-20 14-20-6-20-14z M52 24c0-8 6-12 20-12s20 4 20 12-6 14-20 14-20-6-20-14z' },
  { name: 'Pantos', d: 'M12 20h44l-4 20c-1 6-8 8-18 8s-17-2-18-8z' },
  { name: 'Cat-eye', d: 'M10 30c0-10 8-16 24-16 10 0 18 3 22 8-2-8-2-14-2-14s-10 2-20 2-16-2-16-2 0 6-2 14c-4 5-8 12-8 20' },
]

export default function Home() {
  useTitle()
  return (
    <PageTransition>
      {/* ── Hero ── */}
      <section className="border-b border-line">
        <Container className="grid gap-12 py-16 sm:py-24 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Salud visual en [ciudad]</p>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl lg:text-[3.4rem]">
              Ver bien no debería ser complicado.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
              En Óptica Claravista te graduamos la vista con calma, te enseñamos solo lo que encaja contigo
              y te acompañamos después de la compra. Optometristas colegiados, trato de barrio.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button to="/cita" size="lg">Pide tu cita</Button>
              <Button to="/servicios" size="lg" variant="ghost">Ver servicios</Button>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-line pt-6">
              <div>
                <dt className="text-sm text-ink-soft">De experiencia</dt>
                <dd className="mt-1 font-display text-2xl font-semibold text-ink">+25 años</dd>
              </div>
              <div>
                <dt className="text-sm text-ink-soft">Revisión</dt>
                <dd className="mt-1 font-display text-2xl font-semibold text-ink">30 min</dd>
              </div>
              <div>
                <dt className="text-sm text-ink-soft">Ajuste incluido</dt>
                <dd className="mt-1 font-display text-2xl font-semibold text-ink">1 mes</dd>
              </div>
            </dl>
          </div>
          <div className="lg:pl-6">
            <HeroIllustration />
          </div>
        </Container>
      </section>

      {/* ── Servicios ── */}
      <section className="border-b border-line">
        <Container className="py-16 sm:py-24">
          <Reveal className="max-w-2xl">
            <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">Lo que hacemos</h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">
              Cuatro servicios, cada uno con su tiempo y su método. Sin ventas cruzadas ni prisa.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {servicios.map((s, i) => {
              const Icon = s.icon
              return (
                <Reveal key={s.id} delay={i * 0.06}>
                  <Link
                    to="/servicios"
                    className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-6 transition duration-200 ease-curve hover:-translate-y-1 hover:shadow-card sm:p-7"
                  >
                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary-soft text-primary">
                      <Icon className="h-7 w-7" />
                    </span>
                    <h3 className="mt-5 font-display text-xl font-semibold text-ink">{s.titulo}</h3>
                    <p className="mt-2 flex-1 text-[15px] leading-relaxed text-ink-soft">{s.resumen}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                      Saber más
                      <svg viewBox="0 0 16 16" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3l5 5-5 5" /></svg>
                    </span>
                  </Link>
                </Reveal>
              )
            })}
          </div>
        </Container>
      </section>

      {/* ── Confianza ── */}
      <section className="border-b border-line bg-ink text-white">
        <Container className="py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
            <Reveal>
              <h2 className="font-display text-3xl font-semibold sm:text-4xl">Gente de aquí, desde 1998</h2>
              <p className="mt-4 text-lg leading-relaxed text-white/70">
                Dos generaciones de ópticos en el mismo local. Nos conocen por nombre y volvemos a vernos cada año.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <dl className="grid grid-cols-2 gap-8 sm:grid-cols-3">
                {[
                  ['+9.000', 'clientes atendidos'],
                  ['4,9 / 5', 'valoración media'],
                  ['2', 'optometristas colegiados'],
                ].map(([n, l]) => (
                  <div key={l}>
                    <p className="font-display text-3xl font-semibold sm:text-4xl">{n}</p>
                    <p className="mt-1 text-sm text-white/60">{l}</p>
                  </div>
                ))}
              </dl>
              <p className="mt-6 text-xs text-white/40">Cifras de ejemplo — se sustituyen por las reales del cliente.</p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ── Monturas ── */}
      <section className="border-b border-line">
        <Container className="py-16 sm:py-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <Reveal>
              <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">Monturas para cada cara</h2>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-soft">
                Una selección corta y bien elegida: acetato, metal, sol y línea infantil.
              </p>
            </Reveal>
            <Button to="/monturas" variant="ghost">Ver catálogo</Button>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {frames.map((f, i) => (
              <Reveal key={f.name} delay={i * 0.05}>
                <div className="rounded-2xl border border-line bg-surface-2 p-5">
                  <svg viewBox="0 0 100 56" className="w-full text-ink" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={f.d} />
                  </svg>
                  <p className="mt-3 text-sm font-medium text-ink">{f.name}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-4 text-xs text-ink-soft">Ilustraciones de muestra — se sustituyen por fotos reales de producto.</p>
        </Container>
      </section>

      {/* ── CTA ── */}
      <section>
        <Container className="py-20 text-center sm:py-28">
          <Reveal className="mx-auto max-w-2xl">
            <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">¿Hace cuánto no te revisas la vista?</h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">
              Reserva en un minuto. Elige día y hora y te confirmamos por teléfono.
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
