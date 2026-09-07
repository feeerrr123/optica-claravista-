import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { chatbotIntro, chatbotFaqs } from '../data/chatbot.js'

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([{ from: 'bot', text: chatbotIntro }])
  const [asked, setAsked] = useState([])
  const reduce = useReducedMotion()
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, open])

  const ask = (faq) => {
    setAsked((a) => [...a, faq.id])
    setMessages((m) => [...m, { from: 'user', text: faq.q }])
    window.setTimeout(() => {
      setMessages((m) => [...m, { from: 'bot', text: faq.a }])
    }, 380)
  }

  const remaining = chatbotFaqs.filter((f) => !asked.includes(f.id))

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Asistente de Óptica Claravista"
            className="flex h-[28rem] w-[min(22rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-lift"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between border-b border-line bg-surface-2 px-4 py-3">
              <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-white">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 12c3-4.5 6.5-7 9-7s6 2.5 9 7c-3 4.5-6.5 7-9 7s-6-2.5-9-7z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-ink">Asistente</p>
                  <p className="text-xs text-ink-soft">Respuestas al momento</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full text-ink-soft hover:bg-surface hover:text-ink"
                aria-label="Cerrar asistente"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m, i) => (
                <div key={i} className={m.from === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                  <p
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                      m.from === 'user'
                        ? 'rounded-br-sm bg-primary text-white'
                        : 'rounded-bl-sm bg-surface-2 text-ink'
                    }`}
                  >
                    {m.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-line px-3 py-3">
              {remaining.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {remaining.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => ask(f)}
                      className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink transition hover:border-primary hover:text-primary"
                    >
                      {f.q}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="px-1 text-xs text-ink-soft">
                  ¿Otra duda? Llámanos al [teléfono] o escríbenos por WhatsApp.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((v) => !v)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lift"
        whileHover={reduce ? undefined : { scale: 1.05 }}
        whileTap={reduce ? undefined : { scale: 0.95 }}
        aria-label={open ? 'Cerrar asistente' : 'Abrir asistente'}
        aria-expanded={open}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.svg key="x" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
              initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <path d="M6 6l12 12M18 6L6 18" />
            </motion.svg>
          ) : (
            <motion.svg key="chat" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}
