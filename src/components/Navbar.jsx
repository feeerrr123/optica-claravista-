import { useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Container from './Container.jsx'
import Button from './Button.jsx'

const links = [
  { to: '/servicios', label: 'Servicios' },
  { to: '/monturas', label: 'Monturas' },
  { to: '/nosotros', label: 'Sobre nosotros' },
  { to: '/contacto', label: 'Contacto' },
]

function Mark() {
  // pequeño racimo de puntos: figura sobre fondo, como una lámina diminuta
  return (
    <svg viewBox="0 0 28 28" className="h-7 w-7" aria-hidden="true">
      <circle cx="14" cy="14" r="13" fill="rgb(var(--c-surface))" stroke="rgb(var(--c-line-strong))" />
      <g>
        <circle cx="10" cy="10" r="2.4" fill="rgb(var(--c-accent))" />
        <circle cx="16" cy="9" r="2" fill="rgb(var(--c-ink) / 0.35)" />
        <circle cx="19" cy="14" r="2.4" fill="rgb(var(--c-accent))" />
        <circle cx="9" cy="16" r="2" fill="rgb(var(--c-ink) / 0.35)" />
        <circle cx="14" cy="18" r="2.4" fill="rgb(var(--c-accent))" />
        <circle cx="14" cy="13" r="1.7" fill="rgb(var(--c-ink) / 0.3)" />
      </g>
    </svg>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const reduce = useReducedMotion()

  useEffect(() => setOpen(false), [pathname])

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/85 backdrop-blur-md">
      <Container className="flex items-center justify-between py-3.5">
        <Link to="/" className="flex items-center gap-2.5 font-display text-lg text-ink">
          <Mark />
          Claravista
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Principal">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm transition-colors ${isActive ? 'text-ink' : 'text-ink-soft hover:text-ink'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 pl-4 sm:pl-8">
          <Button to="/cita" size="md">Pide cita</Button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full border border-line-strong text-ink lg:hidden"
            aria-expanded={open}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.div
            className="overflow-hidden border-t border-line bg-bg lg:hidden"
            initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduce ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          >
            <Container className="flex flex-col divide-y divide-line py-2">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={({ isActive }) =>
                    `py-3.5 text-[15px] ${isActive ? 'text-ink' : 'text-ink-soft'}`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
