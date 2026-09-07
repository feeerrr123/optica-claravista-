import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import Chatbot from './Chatbot.jsx'

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Saltar al contenido
      </a>
      <Navbar />
      <div id="contenido" className="flex-1">
        {children}
      </div>
      <Footer />
      <Chatbot />
    </div>
  )
}
