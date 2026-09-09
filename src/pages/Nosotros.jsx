import PageTransition from '../components/PageTransition.jsx'
import Container from '../components/Container.jsx'
import Button from '../components/Button.jsx'
import Reveal from '../components/Reveal.jsx'
import Photo from '../components/Photo.jsx'
import useTitle from '../lib/useTitle.js'
import { photos } from '../data/media.js'

const hitos = [
  ['1998', 'Abre Óptica Claravista en la calle mayor, con un solo gabinete.'],
  ['2009', 'Segunda generación en el mostrador. Reforma del local y gabinete infantil.'],
  ['2017', 'Incorporamos topografía corneal y control de miopía en niños.'],
  ['2024', 'Más de 9.000 revisiones. Seguimos en el mismo sitio.'],
]

const equipo = [
  ['MJ', 'María José', 'Óptica-optometrista colegiada. Fundadora.'],
  ['DL', 'Daniel', 'Óptico-optometrista. Contactología y control de miopía.'],
  ['CR', 'Carla', 'Asesora de montura y atención al cliente.'],
]

const valores = [
  ['Sin prisa', 'Una revisión bien hecha lleva su tiempo. No hacemos cuatro en una hora.'],
  ['Sin ventas cruzadas', 'Te enseñamos lo que encaja contigo, no lo que más margen deja.'],
  ['Seguimiento', 'El primer mes ajustamos la graduación sin coste si te cuesta adaptarte.'],
  ['De aquí', 'Nos vas a ver por el barrio. Respondemos por lo que vendemos.'],
]

export default function Nosotros() {
  useTitle('Sobre nosotros')
  return (
    <PageTransition>
      <section className="border-b border-line">
        <Container className="pb-14 pt-10 sm:py-24">
          <h1 className="max-w-4xl font-display text-4xl leading-[1.1] text-ink sm:text-[3.2rem]">
            Dos generaciones de ópticos en el mismo local.
          </h1>
          <div className="measure mt-6 space-y-4 text-[17px] leading-relaxed text-ink-soft">
            <p>
              Empezamos en 1998 con un gabinete y muchas ganas. Desde entonces han pasado por
              aquí más de nueve mil personas: algunas nos conocen desde que eran niños y ahora
              traen a los suyos.
            </p>
            <p>
              No hemos crecido abriendo tiendas, sino haciendo bien lo de siempre: escuchar,
              medir con cuidado y no vender lo que no hace falta.
            </p>
          </div>
          <div className="mt-10">
            <Photo src={photos.estanteria.src} alt={photos.estanteria.alt} ratio="16/9" className="rounded-xl" priority />
          </div>
        </Container>
      </section>

      <section className="border-b border-line bg-surface-2">
        <Container className="py-16 sm:py-20">
          <h2 className="font-display text-3xl text-ink sm:text-[2.4rem]">Nuestra historia</h2>
          <ol className="mt-10 border-l border-line-strong pl-6">
            {hitos.map(([ano, texto], i) => (
              <Reveal as="li" key={ano} delay={i * 0.06} className="relative pb-8 last:pb-0">
                <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 border-accent bg-surface-2" />
                <p className="font-mono text-lg text-accent">{ano}</p>
                <p className="measure mt-1 text-[15px] leading-relaxed text-ink-soft">{texto}</p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      <section className="border-b border-line">
        <Container className="py-16 sm:py-20">
          <h2 className="font-display text-3xl text-ink sm:text-[2.4rem]">Quién te atiende</h2>
          <div className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-3">
            {equipo.map(([ini, nombre, rol], i) => (
              <Reveal key={nombre} delay={i * 0.06} className="border-t border-line pt-5">
                <span className="grid h-14 w-14 place-items-center rounded-full border border-line-strong font-mono text-sm text-accent">
                  {ini}
                </span>
                <p className="mt-4 font-display text-lg text-ink">{nombre}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{rol}</p>
              </Reveal>
            ))}
          </div>
          <p className="mt-6 font-mono text-[11px] text-ink-soft">Nombres de ejemplo — se sustituyen por el equipo real.</p>
        </Container>
      </section>

      <section className="border-b border-line bg-ink text-bg">
        <Container className="py-16 sm:py-20">
          <h2 className="font-display text-3xl sm:text-[2.4rem]">Cómo trabajamos</h2>
          <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {valores.map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.05} className="border-t border-bg/20 pt-5">
                <h3 className="font-display text-xl">{t}</h3>
                <p className="measure mt-2 text-[15px] leading-relaxed text-bg/70">{d}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-20 text-center sm:py-24">
          <h2 className="font-display text-3xl text-ink sm:text-[2.4rem]">Ven a conocernos</h2>
          <p className="measure mx-auto mt-4 text-lg leading-relaxed text-ink-soft">
            Pide cita o pásate a saludar. Sin compromiso.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button to="/cita" size="lg">Pide cita</Button>
            <Button to="/contacto" size="lg" variant="ghost">Cómo llegar</Button>
          </div>
        </Container>
      </section>
    </PageTransition>
  )
}
