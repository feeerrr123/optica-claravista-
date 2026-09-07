import { Link } from 'react-router-dom'
import Container from './Container.jsx'

export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface-2">
      <Container className="py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
              <svg viewBox="0 0 32 32" className="h-6 w-6" aria-hidden="true" fill="none">
                <path d="M3 16c4-6 9-9 13-9s9 3 13 9c-4 6-9 9-13 9S7 22 3 16z" stroke="rgb(var(--c-primary))" strokeWidth="2" />
                <circle cx="16" cy="16" r="4.5" stroke="rgb(var(--c-primary))" strokeWidth="2" />
              </svg>
              Claravista
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-soft">
              Salud visual y asesoramiento en montura desde 1998. [Ciudad], [provincia].
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-soft">Óptica</h3>
            <ul className="mt-3 space-y-2 text-sm text-ink-soft">
              <li><Link to="/servicios" className="hover:text-ink">Servicios</Link></li>
              <li><Link to="/monturas" className="hover:text-ink">Monturas</Link></li>
              <li><Link to="/nosotros" className="hover:text-ink">Sobre nosotros</Link></li>
              <li><Link to="/cita" className="hover:text-ink">Pide tu cita</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-soft">Contacto</h3>
            <ul className="mt-3 space-y-2 text-sm text-ink-soft">
              <li><a href="tel:+34000000000" className="hover:text-ink">[Teléfono]</a></li>
              <li><a href="mailto:hola@opticaclaravista.example" className="hover:text-ink">hola@opticaclaravista.example</a></li>
              <li>[Calle y número]</li>
              <li>[Ciudad]</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-soft">Horario</h3>
            <ul className="mt-3 space-y-2 text-sm text-ink-soft">
              <li>Lunes a viernes · 10:00–13:30, 17:00–20:30</li>
              <li>Sábados · 10:00–13:30</li>
              <li>Domingos · cerrado</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 text-xs text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Óptica Claravista — <span className="text-ink">marca ficticia</span>. Proyecto de demostración · diseño de <span className="text-ink">[TU ESTUDIO]</span>.</p>
          <p className="flex gap-4">
            <a href="#" className="hover:text-ink">Aviso legal</a>
            <a href="#" className="hover:text-ink">Privacidad</a>
          </p>
        </div>
      </Container>
    </footer>
  )
}
