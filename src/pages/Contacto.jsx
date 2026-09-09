import PageTransition from '../components/PageTransition.jsx'
import Container from '../components/Container.jsx'
import Reveal from '../components/Reveal.jsx'
import useTitle from '../lib/useTitle.js'

const horario = [
  ['Lunes', '10:00–13:30', '17:00–20:30'],
  ['Martes', '10:00–13:30', '17:00–20:30'],
  ['Miércoles', '10:00–13:30', '17:00–20:30'],
  ['Jueves', '10:00–13:30', '17:00–20:30'],
  ['Viernes', '10:00–13:30', '17:00–20:30'],
  ['Sábado', '10:00–13:30', '—'],
  ['Domingo', 'Cerrado', ''],
]

function Line({ icon, children }) {
  return (
    <div className="flex gap-3 border-b border-line py-4 last:border-0">
      <span className="mt-0.5 text-accent">{icon}</span>
      <div className="text-[15px] leading-relaxed text-ink">{children}</div>
    </div>
  )
}

export default function Contacto() {
  useTitle('Contacto')
  return (
    <PageTransition>
      <section className="border-b border-line">
        <Container className="pb-14 pt-10 sm:py-24">
          <h1 className="max-w-4xl font-display text-4xl leading-[1.1] text-ink sm:text-[3.2rem]">
            En el centro, con parking cerca.
          </h1>

          <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <div className="border-t border-line">
                <Line icon={<svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"><path d="M12 21s7-6.2 7-12A7 7 0 0 0 5 9c0 5.8 7 12 7 12z" /><circle cx="12" cy="9" r="2.5" /></svg>}>
                  <strong className="font-display">[Calle y número]</strong><br />[Código postal], [ciudad] · [provincia]
                </Line>
                <Line icon={<svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M4 6c0 8 6 14 14 14l2-3-4-3-2 2c-2-1-5-4-6-6l2-2-3-4z" /></svg>}>
                  <a href="tel:+34000000000" className="font-semibold text-accent">[Teléfono]</a>
                </Line>
                <Line icon={<svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.5A10 10 0 1 0 12 2zm4.6 12.1c-.3-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.5 6.5 0 0 1-3.2-2.8c-.2-.4.2-.4.6-1.2a.4.4 0 0 0 0-.4L9.9 7.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3A3 3 0 0 0 7 10c0 1.8 1.3 3.5 1.5 3.8s2.6 4 6.3 5.3c2.3.8 2.7.6 3.2.6s1.5-.6 1.7-1.2.2-1.1.2-1.2-.2-.2-.5-.3z" /></svg>}>
                  <a href="https://wa.me/34000000000" className="font-semibold text-accent">WhatsApp</a> — respondemos en horario de tienda
                </Line>
                <Line icon={<svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>}>
                  <a href="mailto:hola@opticaclaravista.example" className="font-semibold text-accent">hola@opticaclaravista.example</a>
                </Line>
              </div>

              <h2 className="mt-10 font-display text-xl text-ink">Horario</h2>
              <table className="mt-3 w-full font-mono text-[13px]">
                <tbody>
                  {horario.map(([d, m, t]) => (
                    <tr key={d} className="border-b border-line last:border-0">
                      <th scope="row" className="py-2 text-left font-normal text-ink-soft">{d}</th>
                      <td className="py-2 text-right text-ink">{m}</td>
                      <td className="py-2 pl-4 text-right text-ink">{t}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <p className="mt-8 measure text-[15px] leading-relaxed text-ink-soft">
                <strong className="font-display text-ink">Cómo llegar:</strong> parking público a
                dos minutos andando y parada de autobús [líneas] en la puerta. La zona azul de la
                plaza suele tener sitio por la tarde.
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <figure>
                <div className="overflow-hidden rounded-xl border border-line">
                  <svg viewBox="0 0 400 320" className="block h-auto w-full" role="img" aria-label="Mapa de situación de muestra de Óptica Claravista">
                    <rect width="400" height="320" fill="rgb(var(--c-surface-2))" />
                    <g stroke="rgb(var(--c-line-strong))" strokeWidth="2" opacity="0.7">
                      <path d="M0 95h400M0 210h400M130 0v320M280 0v320" />
                    </g>
                    <path d="M130 210h150V95" stroke="rgb(var(--c-accent) / 0.35)" strokeWidth="9" fill="none" strokeLinecap="round" />
                    <circle cx="205" cy="155" r="34" fill="rgb(var(--c-accent) / 0.12)" />
                    <path d="M205 131c-9 0-16 7-16 16 0 12 16 28 16 28s16-16 16-28c0-9-7-16-16-16z" fill="rgb(var(--c-accent))" />
                    <circle cx="205" cy="147" r="6" fill="rgb(var(--c-bg))" />
                    <text x="205" y="212" textAnchor="middle" fontFamily="'Hanken Grotesk', sans-serif" fontSize="13" fill="rgb(var(--c-ink-soft))">Óptica Claravista</text>
                  </svg>
                </div>
                <figcaption className="mt-3 flex items-center justify-between gap-3">
                  <span className="text-sm text-ink-soft">[Calle y número], [ciudad]</span>
                  <a href="#" className="shrink-0 text-sm font-semibold text-accent hover:text-accent-dark">Abrir en Maps →</a>
                </figcaption>
                <p className="mt-2 font-mono text-[11px] text-ink-soft">Mapa de muestra — se sustituye por un embed real.</p>
              </figure>
            </Reveal>
          </div>
        </Container>
      </section>
    </PageTransition>
  )
}
