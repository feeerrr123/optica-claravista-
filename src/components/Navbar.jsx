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

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 font-display text-xl font-semibold text-ink">
      <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true" fill="none">
        <path d="M3 16c4-6 9-9 13-9s9 3 13 9c-4 6-9 9-13 9S7 22 3 16z" stroke="rgb(var(--c-primary))" strokeWidth="2" />
        <circle cx="16" cy="16" r="4.5" stroke="rgb(var(--c-primary))" strokeWidth="2" />
      </svg>
      Claravista
    </Link>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const reduce = useReducedMotion()

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const linkClass = ({ isActive }) =>
    `text-sm transition-colors ${isActive ? 'text-ink' : 'text-ink-soft hover:text-ink'}`

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors ${
        scrolled ? 'border-line bg-bg/85 backdrop-blur-md' : 'border-transparent bg-bg'
      }`}
    >
      <Container className="flex items-center justify-between py-3.5">
        <Logo />

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Principal">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button to="/cita" className="hidden sm:inline-flex">Pide tu cita</Button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink lg:hidden"
            aria-expanded={open}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
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
            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
          >
            <Container className="flex flex-col gap-1 py-4">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2.5 text-[15px] ${isActive ? 'bg-surface-2 text-ink' : 'text-ink-soft'}`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              <Button to="/cita" className="mt-2">Pide tu cita</Button>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
