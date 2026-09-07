import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import PageTransition from '../components/PageTransition.jsx'
import Container from '../components/Container.jsx'
import useTitle from '../lib/useTitle.js'

const inputCls =
  'mt-1.5 w-full rounded-lg border border-line bg-bg px-3 py-2.5 text-[15px] text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20'

export default function Cita() {
  useTitle('Pide tu cita')
  const [enviado, setEnviado] = useState(false)
  const reduce = useReducedMotion()

  function handleSubmit(e) {
    e.preventDefault()
    if (e.target.reportValidity()) setEnviado(true)
  }

  return (
    <PageTransition>
      <section>
        <Container className="grid gap-12 py-16 sm:py-24 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Pide tu cita</p>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
              Reserva en un minuto.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">
              Rellena el formulario y te llamamos para confirmar día y hora. También puedes llamarnos al
              <a href="tel:+34000000000" className="font-semibold text-primary"> [teléfono]</a> o escribirnos por WhatsApp.
            </p>

            <dl className="mt-10 space-y-5 border-t border-line pt-6 text-[15px]">
              <div>
                <dt className="font-semibold text-ink">Cuánto dura</dt>
                <dd className="mt-1 text-ink-soft">La graduación de la vista, unos 30 minutos. La adaptación de lentillas, 45.</dd>
              </div>
              <div>
                <dt className="font-semibold text-ink">Qué traer</dt>
                <dd className="mt-1 text-ink-soft">Tus gafas actuales y la última receta si la tienes. Si vienes con seguro, la tarjeta.</dd>
              </div>
              <div>
                <dt className="font-semibold text-ink">Coste</dt>
                <dd className="mt-1 text-ink-soft">La revisión es gratuita si te gradúas con nosotros.</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-line bg-surface p-6 shadow-card sm:p-8">
            {enviado ? (
              <motion.div
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="py-10 text-center"
              >
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary-soft text-primary">
                  <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
                </span>
                <h2 className="mt-5 font-display text-2xl font-semibold text-ink">Solicitud recibida</h2>
                <p className="mx-auto mt-2 max-w-xs text-[15px] leading-relaxed text-ink-soft">
                  Te llamamos en horario de tienda para confirmar la cita.
                  <span className="mt-2 block text-xs text-accent">(Demo: no se ha enviado nada.)</span>
                </p>
                <button
                  onClick={() => setEnviado(false)}
                  className="mt-6 text-sm font-semibold text-primary hover:text-primary-dark"
                >
                  Enviar otra solicitud
                </button>
              </motion.div>
            ) : (
              <form className="grid gap-4" onSubmit={handleSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-medium text-ink">
                    Nombre y apellidos
                    <input name="nombre" type="text" required autoComplete="name" className={inputCls} />
                  </label>
                  <label className="block text-sm font-medium text-ink">
                    Teléfono
                    <input name="telefono" type="tel" required autoComplete="tel" inputMode="tel" className={inputCls} />
                  </label>
                </div>
                <label className="block text-sm font-medium text-ink">
                  Email
                  <input name="email" type="email" required autoComplete="email" className={inputCls} />
                </label>
                <label className="block text-sm font-medium text-ink">
                  Servicio
                  <select name="servicio" className={inputCls} defaultValue="Graduación de la vista">
                    <option>Graduación de la vista</option>
                    <option>Adaptación de lentes de contacto</option>
                    <option>Gafas de sol graduadas</option>
                    <option>Revisión visual infantil</option>
                    <option>Aún no lo sé</option>
                  </select>
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-medium text-ink">
                    Fecha preferida
                    <input name="fecha" type="date" className={inputCls} />
                  </label>
                  <label className="block text-sm font-medium text-ink">
                    Franja
                    <select name="franja" className={inputCls} defaultValue="Indiferente">
                      <option>Mañana</option>
                      <option>Tarde</option>
                      <option>Indiferente</option>
                    </select>
                  </label>
                </div>
                <label className="block text-sm font-medium text-ink">
                  Algo que debamos saber <span className="font-normal text-ink-soft">(opcional)</span>
                  <textarea name="mensaje" rows={3} className={inputCls} />
                </label>
                <button
                  type="submit"
                  className="mt-1 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-[15px] font-semibold text-white transition hover:bg-primary-dark"
                >
                  Solicitar cita
                </button>
                <p className="text-xs leading-relaxed text-ink-soft">
                  Al enviar aceptas que te contactemos para gestionar tu cita. No cedemos tus datos a terceros.
                </p>
              </form>
            )}
          </div>
        </Container>
      </section>
    </PageTransition>
  )
}
