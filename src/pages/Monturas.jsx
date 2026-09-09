import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import PageTransition from '../components/PageTransition.jsx'
import Container from '../components/Container.jsx'
import Button from '../components/Button.jsx'
import Photo from '../components/Photo.jsx'
import useTitle from '../lib/useTitle.js'
import { monturas, categorias } from '../data/media.js'

export default function Monturas() {
  useTitle('Monturas')
  const [filtro, setFiltro] = useState('todas')
  const reduce = useReducedMotion()
  const lista = filtro === 'todas' ? monturas : monturas.filter((m) => m.cat === filtro)

  return (
    <PageTransition>
      <section className="border-b border-line">
        <Container className="pb-14 pt-10 sm:py-24">
          <h1 className="max-w-4xl font-display text-4xl leading-[1.1] text-ink sm:text-[3.2rem]">
            Una selección corta y bien elegida.
          </h1>
          <p className="measure mt-5 text-lg leading-relaxed text-ink-soft">
            Acetato, metal, titanio y línea infantil. Ven a probártelas con calma; renovamos
            modelos cada temporada.
          </p>

          <div className="mt-10 flex flex-wrap gap-2" role="group" aria-label="Filtrar monturas">
            {categorias.map((c) => (
              <button
                key={c.id}
                onClick={() => setFiltro(c.id)}
                aria-pressed={filtro === c.id}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  filtro === c.id
                    ? 'border-accent bg-accent text-bg'
                    : 'border-line-strong text-ink-soft hover:border-ink hover:text-ink'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {lista.map((m, i) => (
              <motion.li
                key={m.id}
                layout
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                <Photo src={m.src} alt={m.alt} ratio="7/5" className="rounded-lg" priority={i < 4} />
                <p className="mt-3 font-display text-lg text-ink">{m.nombre}</p>
                <p className="text-sm text-ink-soft">{m.material}</p>
                <p className="mt-0.5 font-mono text-[13px] text-accent">{m.precio}</p>
              </motion.li>
            ))}
          </ul>

          <p className="mt-8 font-mono text-[11px] text-ink-soft">
            Fotos y precios de muestra — se sustituyen por el catálogo real del cliente.
          </p>
        </Container>
      </section>

      <section>
        <Container className="py-20 text-center sm:py-24">
          <h2 className="font-display text-3xl text-ink sm:text-[2.4rem]">Pruébatelas sin compromiso</h2>
          <p className="measure mx-auto mt-4 text-lg leading-relaxed text-ink-soft">
            Trae tu graduación o te la revisamos en la misma cita.
          </p>
          <div className="mt-8 flex justify-center">
            <Button to="/cita" size="lg">Pide cita</Button>
          </div>
        </Container>
      </section>
    </PageTransition>
  )
}
