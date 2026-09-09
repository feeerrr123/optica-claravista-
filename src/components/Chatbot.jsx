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
    window.setTimeout(() => setMessages((m) => [...m, { from: 'bot', text: faq.a }]), 360)
  }

  const remaining = chatbotFaqs.filter((f) => !asked.includes(f.id))

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Asistente de Óptica Claravista"
            className="flex h-[27rem] w-[min(21rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-line-strong bg-surface"
            style={{ boxShadow: '0 2px 8px rgb(38 35 29 / 0.08), 0 24px 48px -20px rgb(38 35 29 / 0.28)' }}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <p className="font-display text-[15px] text-ink">Asistente</p>
              <button
                onClick={() => setOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full text-ink-soft transition-colors hover:text-ink"
                aria-label="Cerrar asistente"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m, i) => (
                <div key={i} className={m.from === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                  <p
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                      m.from === 'user' ? 'rounded-br-sm bg-accent text-bg' : 'rounded-bl-sm bg-surface-2 text-ink'
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
                      className="rounded-full border border-line-strong px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:border-accent hover:text-accent"
                    >
                      {f.q}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="px-1 text-xs text-ink-soft">¿Otra duda? Llámanos al [teléfono] o escríbenos por WhatsApp.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((v) => !v)}
        className="afterimage flex h-14 w-14 items-center justify-center rounded-full bg-accent text-bg"
        style={{ boxShadow: '0 2px 8px rgb(38 35 29 / 0.14), 0 16px 32px -14px rgb(38 35 29 / 0.4)' }}
        whileHover={reduce ? undefined : { scale: 1.05 }}
        whileTap={reduce ? undefined : { scale: 0.95 }}
        aria-label={open ? 'Cerrar asistente' : 'Abrir asistente'}
        aria-expanded={open}
      >
        {open ? (
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
        )}
      </motion.button>
    </div>
  )
}
