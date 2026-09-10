import PageTransition from '../components/PageTransition.jsx'
import Container from '../components/Container.jsx'
import useTitle from '../lib/useTitle.js'
import { JUEGOS, useJuegos } from '../lib/juegos.js'
import { Aviso } from '../games/ui.jsx'
import Color from '../games/Color.jsx'
import Agudeza from '../games/Agudeza.jsx'
import Contraste from '../games/Contraste.jsx'
import Estereograma from '../games/Estereograma.jsx'
import Carne from '../games/Carne.jsx'

const COMP = { color: Color, agudeza: Agudeza, contraste: Contraste, estereo: Estereograma }

function Stepper({ state, actual }) {
  return (
    <ol className="flex items-stretch gap-2">
      {JUEGOS.map((j) => {
        const done = !!state[j.id]
        const now = j.id === actual
        return (
          <li key={j.id} className="flex-1">
            <div
              className={`rounded-lg border px-2.5 py-2 text-center transition-colors ${
                done ? 'border-accent bg-accent/10' : now ? 'border-ink' : 'border-line'
              }`}
            >
              <span className="font-mono text-[11px] text-ink-soft">
                {done ? '✓' : j.n}
              </span>
              <span className="mt-0.5 block text-[12px] font-semibold text-ink sm:text-sm">{j.titulo}</span>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export default function Juegos() {
  useTitle('Juegos para la vista')
  const { state, guardar, reiniciar, hechos, todos, siguiente } = useJuegos()

  const Actual = siguiente ? COMP[siguiente.id] : null

  return (
    <PageTransition>
      <section className="border-b border-line">
        <Container className="pb-10 pt-10 sm:py-16">
          <h1 className="max-w-4xl font-display text-4xl leading-[1.1] text-ink sm:text-[3.2rem]">
            Juegos para la vista
          </h1>
          <p className="measure mt-5 text-lg leading-relaxed text-ink-soft">
            Cuatro pruebas, de fácil a difícil. Al terminar, tu carné visual con el nivel de cada una.
            Se guarda solo: si te vas, sigues donde lo dejaste.
          </p>
          <div className="mt-6 max-w-2xl rounded-xl border border-line bg-surface-2 px-4 py-3.5">
            <Aviso />
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-10 sm:py-14">
          <div className="mx-auto max-w-2xl">
            <div className="flex items-center justify-between">
              <p className="font-mono text-sm text-ink-soft">{hechos} / 4 completados</p>
              {hechos > 0 && !todos && (
                <button onClick={reiniciar} className="text-sm font-semibold text-accent hover:text-accent-dark">
                  Empezar de cero
                </button>
              )}
            </div>
            <div className="mt-4">
              <Stepper state={state} actual={siguiente?.id} />
            </div>

            <div className="mt-8">
              {todos ? (
                <Carne state={state} onReset={reiniciar} />
              ) : (
                Actual && (
                  <Actual
                    key={siguiente.id}
                    onDone={(res) => guardar(siguiente.id, res)}
                  />
                )
              )}
            </div>
          </div>
        </Container>
      </section>
    </PageTransition>
  )
}
