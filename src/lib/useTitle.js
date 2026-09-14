import { useEffect } from 'react'

const DESCRIPCION_INICIO =
  'Óptica Claravista — salud visual en [ciudad]. Graduación de la vista, lentes de contacto, gafas de sol y revisión infantil. Pide tu cita.'

// Actualiza el <title> y la meta-descripción según la página. El nombre de la
// óptica es fijo; la descripción por defecto es la del index.html.
export default function useTitle(seccion, descripcion) {
  useEffect(() => {
    document.title = seccion
      ? `${seccion} · Óptica Claravista`
      : 'Óptica Claravista · Salud visual en [ciudad]'

    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', descripcion || DESCRIPCION_INICIO)
  }, [seccion, descripcion])
}
