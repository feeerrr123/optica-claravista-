import { useEffect } from 'react'

// Actualiza el <title> según la página. El nombre de la óptica es fijo.
export default function useTitle(seccion) {
  useEffect(() => {
    document.title = seccion
      ? `${seccion} · Óptica Claravista`
      : 'Óptica Claravista · Salud visual en [ciudad]'
  }, [seccion])
}
