import PageTransition from '../components/PageTransition.jsx'
import Container from '../components/Container.jsx'
import Reveal from '../components/Reveal.jsx'
import useTitle from '../lib/useTitle.js'

const horario = [
  ['Lunes a viernes', '10:00–13:30 · 17:00–20:30'],
  ['Sábados', '10:00–13:30'],
  ['Domingos y festivos', 'Cerrado'],
]

function Dato({ icon, children }) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 text-primary">{icon}</span>
      <div className="text-[15px] leading-relaxed text-ink">{children}</div>
    </div>
  )
}

export default function Contacto() {
  useTitle('Contacto')
  return (
    <PageTransition>
      <section className="border-b border-line">
        <Container className="py-16 sm:py-24">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Contacto</p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
            Estamos en el centro, con parking cerca.
          </h1>

          <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-14">
            <Reveal className="space-y-6">
              <Dato icon={<svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><path d="M12 21s7-6.2 7-12A7 7 0 0 0 5 9c0 5.8 7 12 7 12z" /><circle cx="12" cy="9" r="2.5" /></svg>}>
                <strong>[Calle y número]</strong><br />[Código postal], [ciudad] · [provincia]
              </Dato>
              <Dato icon={<svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 6c0 8 6 14 14 14l2-3-4-3-2 2c-2-1-5-4-6-6l2-2-3-4z" /></svg>}>
                <a href="tel:+34000000000" className="font-semibold text-primary">[Teléfono]</a>
              </Dato>
              <Dato icon={<svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.5A10 10 0 1 0 12 2zm4.6 12.1c-.3-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.5 6.5 0 0 1-3.2-2.8c-.2-.4.2-.4.6-1.2a.4.4 0 0 0 0-.4L9.9 7.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3A3 3 0 0 0 7 10c0 1.8 1.3 3.5 1.5 3.8s2.6 4 6.3 5.3c2.3.8 2.7.6 3.2.6s1.5-.6 1.7-1.2.2-1.1.2-1.2-.2-.2-.5-.3z" /></svg>}>
                <a href="https://wa.me/34000000000" className="font-semibold text-primary">WhatsApp</a> — respondemos en horario de tienda
              </Dato>
              <Dato icon={<svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>}>
                <a href="mailto:hola@opticaclaravista.example" className="font-semibold text-primary">hola@opticaclaravista.example</a>
              </Dato>

              <div className="rounded-2xl border border-line bg-surface-2 p-5">
                <h2 className="font-display text-lg font-semibold text-ink">Horario</h2>
                <dl className="mt-3 space-y-2 text-[15px]">
                  {horario.map(([d, h]) => (
                    <div key={d} className="flex justify-between gap-4">
                      <dt className="text-ink-soft">{d}</dt>
                      <dd className="text-right font-medium text-ink">{h}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <p className="text-[15px] leading-relaxed text-ink-soft">
                <strong className="text-ink">Cómo llegar:</strong> parking público a 2 minutos andando y parada de
                autobús [líneas] en la puerta. Si vienes en coche, la zona azul de la plaza suele tener sitio por la tarde.
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="overflow-hidden rounded-2xl border border-line bg-surface-2">
                <div className="relative aspect-[4/3] w-full">
                  {/* Mapa de muestra — se sustituye por un embed real (Google Maps / OpenStreetMap) */}
                  <svg viewBox="0 0 400 300" className="h-full w-full" role="img" aria-label="Mapa de situación de muestra">
                    <rect width="400" height="300" fill="rgb(var(--c-surface-2))" />
                    <g stroke="rgb(var(--c-line))" strokeWidth="2">
                      <path d="M0 90h400M0 190h400M120 0v300M270 0v300" />
                    </g>
                    <path d="M120 190h150v-100" stroke="rgb(var(--c-primary) / 0.35)" strokeWidth="8" fill="none" strokeLinecap="round" />
                    <g>
                      <circle cx="200" cy="150" r="30" fill="rgb(var(--c-primary) / 0.12)" />
                      <path d="M200 128c-9 0-16 7-16 16 0 12 16 26 16 26s16-14 16-26c0-9-7-16-16-16z" fill="rgb(var(--c-primary))" />
                      <circle cx="200" cy="144" r="6" fill="#fff" />
                    </g>
                    <text x="200" y="205" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="13" fill="rgb(var(--c-ink-soft))">
                      Óptica Claravista
                    </text>
                  </svg>
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-line px-5 py-4">
                  <p className="text-sm text-ink-soft">[Calle y número], [ciudad]</p>
                  <a
                    href="#"
                    className="shrink-0 text-sm font-semibold text-primary hover:text-primary-dark"
                  >
                    Abrir en Maps
                  </a>
                </div>
              </div>
              <p className="mt-3 text-xs text-ink-soft">Mapa de muestra — se sustituye por un embed real con la dirección del cliente.</p>
            </Reveal>
          </div>
        </Container>
      </section>
    </PageTransition>
  )
}
