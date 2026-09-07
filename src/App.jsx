import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Servicios from './pages/Servicios.jsx'
import Monturas from './pages/Monturas.jsx'
import Nosotros from './pages/Nosotros.jsx'
import Cita from './pages/Cita.jsx'
import Contacto from './pages/Contacto.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

export default function App() {
  const location = useLocation()
  return (
    <Layout>
      <ScrollToTop />
      {/* Cada página se anima al montarse (ver PageTransition). Sin AnimatePresence
          a nivel de ruta: evita bloqueos al navegar rápido entre páginas. */}
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/monturas" element={<Monturas />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/cita" element={<Cita />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Layout>
  )
}
