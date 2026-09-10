import { Link } from 'react-router-dom'
import Container from './Container.jsx'

const cols = [
  {
    h: 'Óptica',
    items: [
      ['Servicios', '/servicios'],
      ['Monturas', '/monturas'],
      ['Juegos para la vista', '/juegos'],
      ['Sobre nosotros', '/nosotros'],
      ['Pide cita', '/cita'],
    ],
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface-2">
      <Container className="py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-lg text-ink">Óptica Claravista</p>
            <p className="mt-3 measure text-sm leading-relaxed text-ink-soft">
              Salud visual y asesoramiento en montura en [ciudad] desde 1998.
              Mismo local, mismas manos.
            </p>
          </div>

          {cols.map((c) => (
            <div key={c.h}>
              <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft">{c.h}</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {c.items.map(([label, to]) => (
                  <li key={label}>
                    <Link to={to} className="text-ink-soft transition-colors hover:text-ink">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft">Contacto</h3>
            <ul className="mt-3 space-y-2 text-sm text-ink-soft">
              <li><a href="tel:+34000000000" className="transition-colors hover:text-ink">[Teléfono]</a></li>
              <li><a href="mailto:hola@opticaclaravista.example" className="transition-colors hover:text-ink">hola@opticaclaravista.example</a></li>
              <li>[Calle y número], [ciudad]</li>
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft">Horario</h3>
            <dl className="mt-3 space-y-1.5 font-mono text-[13px] text-ink-soft">
              <div className="flex justify-between gap-3"><dt>L–V</dt><dd className="text-ink">10–13:30 · 17–20:30</dd></div>
              <div className="flex justify-between gap-3"><dt>Sáb</dt><dd className="text-ink">10–13:30</dd></div>
              <div className="flex justify-between gap-3"><dt>Dom</dt><dd>cerrado</dd></div>
            </dl>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 text-xs text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Óptica Claravista — <span className="text-ink">marca ficticia</span>. Proyecto de demostración · diseño de <span className="text-ink">[TU ESTUDIO]</span>.</p>
          <p className="flex gap-4">
            <a href="#" className="transition-colors hover:text-ink">Aviso legal</a>
            <a href="#" className="transition-colors hover:text-ink">Privacidad</a>
          </p>
        </div>
      </Container>
    </footer>
  )
}
