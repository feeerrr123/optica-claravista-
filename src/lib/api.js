// Pequeño envoltorio sobre fetch para las llamadas a /api/*.
// Si la respuesta no es JSON de verdad (por ejemplo, en `npm run dev` sin
// `vercel dev`, donde /api no se ejecuta y solo se sirve el código fuente),
// se trata como un fallo en vez de fingir que todo fue bien.
export async function peticionJSON(url, opciones) {
  const r = await fetch(url, opciones)
  const esJson = (r.headers.get('content-type') || '').includes('application/json')
  const cuerpo = esJson ? await r.json().catch(() => ({})) : {}
  if (!r.ok || !esJson) {
    throw new Error(cuerpo.error || 'No se pudo completar la petición. Prueba otra vez.')
  }
  return cuerpo
}
