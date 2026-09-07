import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import PageTransition from '../components/PageTransition.jsx'
import Container from '../components/Container.jsx'
import Button from '../components/Button.jsx'
import useTitle from '../lib/useTitle.js'
import { monturas, categorias, formaPath } from '../data/monturas.jsx'

export default function Monturas() {
  useTitle('Monturas')
  const [filtro, setFiltro] = useState('todas')
  const reduce = useReducedMotion()
  const lista = filtro === 'todas' ? monturas : monturas.filter((m) => m.cat === filtro)

  return (
    <PageTransition>
      <section className="border-b border-line">
        <Container className="py-16 sm:py-24">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Monturas</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
            Una selección corta y bien elegida.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
            Acetato, metal, titanio y línea infantil. Ven a probártelas con calma; reservamos modelos nuevos cada temporada.
          </p>

          <div className="mt-10 flex flex-wrap gap-2">
            {categorias.map((c) => (
              <button
                key={c.id}
                onClick={() => setFiltro(c.id)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  filtro === c.id
                    ? 'border-primary bg-primary text-white'
                    : 'border-line text-ink-soft hover:border-primary hover:text-primary'
                }`}
                aria-pressed={filtro === c.id}
              >
                {c.label}
              </button>
            ))}
          </div>

          <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {lista.map((m) => (
              <motion.li
                key={m.id}
                layout
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-2xl border border-line bg-surface p-5"
              >
                <div className="rounded-xl bg-surface-2 p-4">
                  <svg viewBox="0 0 120 60" className="w-full text-ink" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d={formaPath(m.forma)} />
                  </svg>
                </div>
                <p className="mt-3 font-display text-lg font-semibold text-ink">{m.nombre}</p>
                <p className="text-sm text-ink-soft">{m.material}</p>
                <p className="mt-1 text-sm font-semibold text-primary">{m.precio}</p>
              </motion.li>
            ))}
          </ul>

          {lista.length === 0 && (
            <p className="mt-10 text-ink-soft">No hay monturas en esta categoría todavía.</p>
          )}

          <p className="mt-6 text-xs text-ink-soft">
            Ilustraciones y precios de muestra — se sustituyen por fotos y tarifas reales del cliente.
          </p>
        </Container>
      </section>

      <section>
        <Container className="py-20 text-center sm:py-28">
          <div className="mx-auto max-w-2xl">
            <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">Pruébatelas sin compromiso</h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">
              Trae tu graduación o te la revisamos en la misma cita.
            </p>
            <div className="mt-8 flex justify-center">
              <Button to="/cita" size="lg">Pide tu cita</Button>
            </div>
          </div>
        </Container>
      </section>
    </PageTransition>
  )
}
