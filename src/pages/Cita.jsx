import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import PageTransition from '../components/PageTransition.jsx'
import Container from '../components/Container.jsx'
import useTitle from '../lib/useTitle.js'

const field =
  'mt-1.5 w-full rounded-lg border border-line-strong bg-surface px-3 py-2.5 text-[15px] text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20'

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
        <Container className="grid gap-12 pb-16 pt-10 sm:py-24 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <h1 className="font-display text-4xl leading-[1.1] text-ink sm:text-[3.2rem]">
              Reserva en un minuto.
            </h1>
            <p className="measure mt-5 text-lg leading-relaxed text-ink-soft">
              Rellena el formulario y te llamamos para confirmar día y hora. También puedes
              llamarnos al <a href="tel:+34000000000" className="font-semibold text-accent">[teléfono]</a> o
              escribirnos por WhatsApp.
            </p>

            <dl className="mt-10 divide-y divide-line border-y border-line text-[15px]">
              <div className="py-4">
                <dt className="font-display text-ink">Cuánto dura</dt>
                <dd className="mt-1 text-ink-soft">La graduación, unos 30 minutos. La adaptación de lentillas, 45.</dd>
              </div>
              <div className="py-4">
                <dt className="font-display text-ink">Qué traer</dt>
                <dd className="mt-1 text-ink-soft">Tus gafas actuales y la última receta si la tienes. Con seguro, la tarjeta.</dd>
              </div>
              <div className="py-4">
                <dt className="font-display text-ink">Coste</dt>
                <dd className="mt-1 text-ink-soft">La revisión es gratuita si te gradúas con nosotros.</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-line-strong bg-surface p-6 sm:p-8">
            {enviado ? (
              <motion.div
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="py-10 text-center"
              >
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-accent text-accent">
                  <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
                </span>
                <h2 className="mt-5 font-display text-2xl text-ink">Solicitud recibida</h2>
                <p className="measure mx-auto mt-2 text-[15px] leading-relaxed text-ink-soft">
                  Te llamamos en horario de tienda para confirmar la cita.
                  <span className="mt-2 block font-mono text-xs text-accent">(Demo: no se ha enviado nada.)</span>
                </p>
                <button onClick={() => setEnviado(false)} className="mt-6 text-sm font-semibold text-accent hover:text-accent-dark">
                  Enviar otra solicitud
                </button>
              </motion.div>
            ) : (
              <form className="grid gap-4" onSubmit={handleSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-medium text-ink">
                    Nombre y apellidos
                    <input name="nombre" type="text" required autoComplete="name" className={field} />
                  </label>
                  <label className="block text-sm font-medium text-ink">
                    Teléfono
                    <input name="telefono" type="tel" required autoComplete="tel" inputMode="tel" className={field} />
                  </label>
                </div>
                <label className="block text-sm font-medium text-ink">
                  Email
                  <input name="email" type="email" required autoComplete="email" className={field} />
                </label>
                <label className="block text-sm font-medium text-ink">
                  Servicio
                  <select name="servicio" className={field} defaultValue="Graduación de la vista">
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
                    <input name="fecha" type="date" className={field} />
                  </label>
                  <label className="block text-sm font-medium text-ink">
                    Franja
                    <select name="franja" className={field} defaultValue="Indiferente">
                      <option>Mañana</option>
                      <option>Tarde</option>
                      <option>Indiferente</option>
                    </select>
                  </label>
                </div>
                <label className="block text-sm font-medium text-ink">
                  Algo que debamos saber <span className="font-normal text-ink-soft">(opcional)</span>
                  <textarea name="mensaje" rows={3} className={field} />
                </label>
                <button
                  type="submit"
                  className="afterimage mt-1 inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-[15px] font-semibold text-bg transition hover:bg-accent-dark"
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
