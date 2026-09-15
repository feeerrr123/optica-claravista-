import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import PageTransition from '../components/PageTransition.jsx'
import Container from '../components/Container.jsx'
import Agenda from '../components/Agenda.jsx'
import useTitle from '../lib/useTitle.js'
import { formatoDiaLargo, fechaISO } from '../lib/horario.js'
import { peticionJSON } from '../lib/api.js'

const field = (invalido) =>
  `mt-1.5 w-full rounded-lg border bg-surface px-3 py-2.5 text-[15px] text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 ${
    invalido ? 'border-accent ring-2 ring-accent/15' : 'border-line-strong'
  }`

function mensajeError(el) {
  if (el.validity.valueMissing) return 'Este campo es obligatorio.'
  if (el.validity.typeMismatch && el.type === 'email') return 'Escribe un email válido, por ejemplo nombre@correo.com.'
  return 'Revisa este dato.'
}

const PASOS = [
  { id: 'form', n: 1, label: 'Tus datos' },
  { id: 'agenda', n: 2, label: 'Día y hora' },
  { id: 'confirmado', n: 3, label: 'Confirmación' },
]

function PasoStepper({ paso }) {
  const idx = PASOS.findIndex((p) => p.id === paso)
  return (
    <ol className="mb-6 flex items-stretch gap-2">
      {PASOS.map((p, i) => {
        const done = i < idx
        const now = i === idx
        return (
          <li key={p.id} className="flex-1">
            <div
              className={`rounded-lg border px-2.5 py-2 text-center transition-colors ${
                done ? 'border-accent bg-accent/10' : now ? 'border-ink' : 'border-line'
              }`}
            >
              <span className="font-mono text-[11px] text-ink-soft">{done ? '✓' : p.n}</span>
              <span className="mt-0.5 block text-[12px] font-semibold text-ink sm:text-sm">{p.label}</span>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

function FlechaVolver() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M11 18l-6-6 6-6" />
    </svg>
  )
}

export default function Cita() {
  useTitle(
    'Pide tu cita',
    'Reserva tu revisión visual en Óptica Claravista, [ciudad]. Elige día y hora libres al momento. Te confirmamos por teléfono.'
  )
  const [paso, setPaso] = useState('form')
  const [datos, setDatos] = useState(null)
  const [cita, setCita] = useState(null)
  const [resultado, setResultado] = useState(null)
  const [errores, setErrores] = useState({})
  const [anuncio, setAnuncio] = useState('')
  const reduce = useReducedMotion()

  const duracion = datos?.servicio === 'Adaptación de lentes de contacto' ? 45 : 30

  function limpiarError(nombre) {
    setErrores((prev) => {
      if (!(nombre in prev)) return prev
      const { [nombre]: _fuera, ...resto } = prev
      return resto
    })
  }

  function handleSubmit(e) {
    e.preventDefault()
    const form = e.target
    const nuevos = {}
    for (const nombre of ['nombre', 'telefono', 'email']) {
      const el = form.elements[nombre]
      if (!el.checkValidity()) nuevos[nombre] = mensajeError(el)
    }
    setErrores(nuevos)
    if (Object.keys(nuevos).length === 0) {
      const fd = new FormData(form)
      setDatos({
        nombre: fd.get('nombre'),
        telefono: fd.get('telefono'),
        email: fd.get('email'),
        servicio: fd.get('servicio'),
        mensaje: fd.get('mensaje'),
      })
      setPaso('agenda')
      setAnuncio('Datos guardados. Elige día y hora para tu cita.')
    } else {
      form.elements[Object.keys(nuevos)[0]].focus()
    }
  }

  async function handleElegirCita({ fecha, hora }) {
    const fechaStr = fechaISO(fecha)
    const yaReservada = resultado?.token // venimos de "cambiar día u hora" sobre una reserva real
    const respuesta = await peticionJSON(yaReservada ? `/api/citas/${resultado.token}` : '/api/citas', {
      method: yaReservada ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(yaReservada ? { ...datos, fecha: fechaStr, hora } : { ...datos, fecha: fechaStr, hora, duracion }),
    })

    setResultado((prev) => (yaReservada ? { ...prev, ...respuesta } : respuesta)) // { demo, token, emailEnviado }
    setCita({ fecha, hora })
    setPaso('confirmado')
    setAnuncio(`Cita ${yaReservada ? 'actualizada' : 'solicitada'} para el ${formatoDiaLargo(fecha)} a las ${hora}.`)
  }

  function volverADatos() {
    setPaso('form')
    setAnuncio('Volviendo a tus datos.')
  }

  function volverAAgenda() {
    setCita(null)
    setPaso('agenda')
    setAnuncio('Elige otro día u hora.')
  }

  function reiniciar() {
    setPaso('form')
    setDatos(null)
    setCita(null)
    setResultado(null)
    setErrores({})
    setAnuncio('')
  }

  return (
    <PageTransition>
      <p role="status" aria-live="polite" className="sr-only">{anuncio}</p>
      <section>
        <Container className="grid gap-12 pb-16 pt-10 sm:py-24 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <h1 className="font-display text-4xl leading-[1.1] text-ink sm:text-[3.2rem]">
              Reserva en un minuto.
            </h1>
            <p className="measure mt-5 text-lg leading-relaxed text-ink-soft">
              Cuéntanos quién eres y elige el día y la hora que mejor te vengan. También puedes
              llamarnos al <a href="tel:+34000000000" className="font-semibold text-accent">[teléfono]</a> o
              escribirnos por WhatsApp.
            </p>

            <dl className="mt-10 divide-y divide-line border-y border-line text-[15px]">
              <div className="py-4">
                <dt className="font-display text-ink">Cuánto dura</dt>
                <dd className="mt-1 text-ink-soft">La graduación, unos 30 minutos. La adaptación de lentillas, 45 — el calendario ya lo tiene en cuenta.</dd>
              </div>
              <div className="py-4">
                <dt className="font-display text-ink">Qué traer</dt>
                <dd className="mt-1 text-ink-soft">Tus gafas actuales y la última receta si la tienes. Con seguro, la tarjeta.</dd>
              </div>
              <div className="py-4">
                <dt className="font-display text-ink">Horario</dt>
                <dd className="mt-1 text-ink-soft">L–V 9:30–13:30 y 16:30–19:00 · Sáb 10:00–13:00.</dd>
              </div>
              <div className="py-4">
                <dt className="font-display text-ink">Coste</dt>
                <dd className="mt-1 text-ink-soft">La revisión es gratuita si te gradúas con nosotros.</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-line-strong bg-surface p-6 sm:p-8">
            <PasoStepper paso={paso} />

            {paso === 'form' && (
              <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-medium text-ink">
                    Nombre y apellidos
                    <input
                      name="nombre"
                      type="text"
                      required
                      autoComplete="name"
                      defaultValue={datos?.nombre}
                      aria-invalid={!!errores.nombre}
                      aria-describedby={errores.nombre ? 'err-nombre' : undefined}
                      onChange={() => limpiarError('nombre')}
                      className={field(errores.nombre)}
                    />
                    {errores.nombre && (
                      <span id="err-nombre" className="mt-1 block text-xs font-normal normal-case text-accent">
                        {errores.nombre}
                      </span>
                    )}
                  </label>
                  <label className="block text-sm font-medium text-ink">
                    Teléfono
                    <input
                      name="telefono"
                      type="tel"
                      required
                      autoComplete="tel"
                      inputMode="tel"
                      defaultValue={datos?.telefono}
                      aria-invalid={!!errores.telefono}
                      aria-describedby={errores.telefono ? 'err-telefono' : undefined}
                      onChange={() => limpiarError('telefono')}
                      className={field(errores.telefono)}
                    />
                    {errores.telefono && (
                      <span id="err-telefono" className="mt-1 block text-xs font-normal normal-case text-accent">
                        {errores.telefono}
                      </span>
                    )}
                  </label>
                </div>
                <label className="block text-sm font-medium text-ink">
                  Email
                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    defaultValue={datos?.email}
                    aria-invalid={!!errores.email}
                    aria-describedby={errores.email ? 'err-email' : undefined}
                    onChange={() => limpiarError('email')}
                    className={field(errores.email)}
                  />
                  {errores.email && (
                    <span id="err-email" className="mt-1 block text-xs font-normal normal-case text-accent">
                      {errores.email}
                    </span>
                  )}
                </label>
                <label className="block text-sm font-medium text-ink">
                  Servicio
                  <select name="servicio" className={field(false)} defaultValue={datos?.servicio || 'Graduación de la vista'}>
                    <option>Graduación de la vista</option>
                    <option>Adaptación de lentes de contacto</option>
                    <option>Gafas de sol graduadas</option>
                    <option>Revisión visual infantil</option>
                    <option>Aún no lo sé</option>
                  </select>
                </label>
                <label className="block text-sm font-medium text-ink">
                  Algo que debamos saber <span className="font-normal text-ink-soft">(opcional)</span>
                  <textarea name="mensaje" rows={3} defaultValue={datos?.mensaje} className={field(false)} />
                </label>
                {Object.keys(errores).length > 0 && (
                  <p role="alert" className="text-sm font-medium text-accent">
                    Falta completar algún dato — revisa los campos marcados arriba.
                  </p>
                )}
                <button
                  type="submit"
                  className="afterimage mt-1 inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-[15px] font-semibold text-bg transition hover:bg-accent-dark"
                >
                  Continuar a elegir día y hora
                </button>
                <p className="text-xs leading-relaxed text-ink-soft">
                  Al enviar aceptas que te contactemos para gestionar tu cita. No cedemos tus datos a terceros.
                </p>
              </form>
            )}

            {paso === 'agenda' && (
              <motion.div
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                <button
                  type="button"
                  onClick={volverADatos}
                  className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-dark"
                >
                  <FlechaVolver /> Volver a tus datos
                </button>
                <Agenda duracion={duracion} onElegir={handleElegirCita} />
              </motion.div>
            )}

            {paso === 'confirmado' && datos && cita && (
              <motion.div
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="py-4 text-center"
              >
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-accent text-accent">
                  <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
                </span>
                <h2 className="mt-5 font-display text-2xl text-ink">Cita confirmada</h2>
                <p className="measure mx-auto mt-2 text-[15px] leading-relaxed text-ink">
                  {datos.nombre}, para <strong>{datos.servicio.toLowerCase()}</strong> el{' '}
                  <strong>{formatoDiaLargo(cita.fecha)}</strong> a las <strong className="font-mono">{cita.hora}</strong>.
                </p>
                {resultado?.demo ? (
                  <p className="measure mx-auto mt-2 text-[15px] leading-relaxed text-ink-soft">
                    Te llamamos al {datos.telefono} para confirmarlo.
                    <span className="mt-2 block font-mono text-xs text-accent">(Demo: no se ha enviado ni guardado nada todavía.)</span>
                  </p>
                ) : (
                  <p className="measure mx-auto mt-2 text-[15px] leading-relaxed text-ink-soft">
                    {resultado?.emailEnviado
                      ? `Te hemos enviado un email a ${datos.email} con un enlace para cambiarla o cancelarla.`
                      : 'Guardada en la agenda. Guarda esta página si necesitas cambiarla o cancelarla luego.'}
                    {' '}Hasta 12h antes de la hora, puedes hacerlo tú mismo sin llamarnos.
                  </p>
                )}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                  {resultado?.token && (
                    <a href={`/cita/gestionar/${resultado.token}`} className="text-sm font-semibold text-accent hover:text-accent-dark">
                      Gestionar esta cita
                    </a>
                  )}
                  <button onClick={volverAAgenda} className="text-sm font-semibold text-accent hover:text-accent-dark">
                    Cambiar día u hora
                  </button>
                  <button onClick={reiniciar} className="text-sm font-semibold text-ink-soft hover:text-ink">
                    Pedir otra cita
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </Container>
      </section>
    </PageTransition>
  )
}
