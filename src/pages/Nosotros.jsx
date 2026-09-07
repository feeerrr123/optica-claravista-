import PageTransition from '../components/PageTransition.jsx'
import Container from '../components/Container.jsx'
import Button from '../components/Button.jsx'
import Reveal from '../components/Reveal.jsx'
import useTitle from '../lib/useTitle.js'

const hitos = [
  ['1998', 'Abre Óptica Claravista en la calle mayor, con un solo gabinete.'],
  ['2009', 'Segunda generación en el mostrador. Reforma del local y nuevo gabinete infantil.'],
  ['2017', 'Incorporamos topografía corneal y control de miopía infantil.'],
  ['2024', 'Más de 9.000 clientes atendidos. Seguimos en el mismo sitio.'],
]

const equipo = [
  ['MJ', 'María José', 'Óptica-optometrista colegiada. Fundadora.'],
  ['DL', 'Daniel', 'Óptico-optometrista. Contactología y control de miopía.'],
  ['CR', 'Carla', 'Asesora de montura y atención al cliente.'],
]

const valores = [
  ['Sin prisa', 'Una revisión bien hecha lleva su tiempo. No hacemos 4 en una hora.'],
  ['Sin ventas cruzadas', 'Te enseñamos lo que encaja contigo, no lo que más margen deja.'],
  ['Seguimiento', 'El primer mes ajustamos la graduación sin coste si te cuesta adaptarte.'],
  ['De aquí', 'Nos vas a ver por el barrio. Respondemos por lo que vendemos.'],
]

export default function Nosotros() {
  useTitle('Sobre nosotros')
  return (
    <PageTransition>
      <section className="border-b border-line">
        <Container className="py-16 sm:py-24">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Sobre nosotros</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
            Dos generaciones de ópticos en el mismo local.
          </h1>
          <div className="mt-6 max-w-2xl space-y-4 text-[17px] leading-relaxed text-ink-soft">
            <p>
              Empezamos en 1998 con un gabinete y muchas ganas. Desde entonces han pasado por aquí más de
              nueve mil personas: algunas nos conocen desde que eran niños y ahora traen a los suyos.
            </p>
            <p>
              No hemos crecido a base de abrir tiendas, sino de hacer bien lo de siempre: escuchar, medir con
              cuidado y no vender lo que no hace falta. Por eso la gente vuelve.
            </p>
          </div>
        </Container>
      </section>

      {/* Historia */}
      <section className="border-b border-line bg-surface-2">
        <Container className="py-16 sm:py-20">
          <Reveal><h2 className="font-display text-3xl font-semibold text-ink">Nuestra historia</h2></Reveal>
          <ol className="mt-10 space-y-6 border-l border-line pl-6">
            {hitos.map(([año, texto], i) => (
              <Reveal as="li" key={año} delay={i * 0.06} className="relative">
                <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 border-primary bg-bg" />
                <p className="font-display text-xl font-semibold text-primary">{año}</p>
                <p className="mt-1 max-w-xl text-[15px] leading-relaxed text-ink-soft">{texto}</p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* Equipo */}
      <section className="border-b border-line">
        <Container className="py-16 sm:py-20">
          <Reveal><h2 className="font-display text-3xl font-semibold text-ink">Quién te atiende</h2></Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {equipo.map(([ini, nombre, rol], i) => (
              <Reveal key={nombre} delay={i * 0.06}>
                <div className="rounded-2xl border border-line bg-surface p-6">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-primary-soft font-display text-lg font-semibold text-primary">
                    {ini}
                  </span>
                  <p className="mt-4 font-display text-lg font-semibold text-ink">{nombre}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">{rol}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-6 text-xs text-ink-soft">Nombres de ejemplo — se sustituyen por el equipo real.</p>
        </Container>
      </section>

      {/* Valores */}
      <section className="border-b border-line bg-ink text-white">
        <Container className="py-16 sm:py-20">
          <Reveal><h2 className="font-display text-3xl font-semibold">Cómo trabajamos</h2></Reveal>
          <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {valores.map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.05} className="border-t border-white/15 pt-5">
                <h3 className="font-display text-xl font-semibold">{t}</h3>
                <p className="mt-2 max-w-md text-[15px] leading-relaxed text-white/70">{d}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-20 text-center sm:py-28">
          <div className="mx-auto max-w-2xl">
            <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">Ven a conocernos</h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">Pide cita o pásate a saludar. Sin compromiso.</p>
            <div className="mt-8 flex justify-center gap-3">
              <Button to="/cita" size="lg">Pide tu cita</Button>
              <Button to="/contacto" size="lg" variant="ghost">Cómo llegar</Button>
            </div>
          </div>
        </Container>
      </section>
    </PageTransition>
  )
}
