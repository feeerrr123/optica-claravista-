// Fotos de muestra (Unsplash, uso libre). MARCADAS PARA SUSTITUIR por fotos
// reales del cliente antes de publicar de verdad. URLs verificadas (200 / jpeg).
const U = (id, extra = '') => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=75${extra}`

export const photos = {
  examen: {
    src: U('1576210117723-cd06449a467d', '&w=1400'),
    alt: 'Optometrista revisando la vista de una persona con el foróptero',
  },
  instrumento: {
    src: U('1539036776273-021ec1d78bec', '&w=1400'),
    alt: 'Aparato de medición de la vista en el gabinete',
  },
  instrumentoDetalle: {
    src: U('1677773382668-8a84321836e9', '&w=1200'),
    alt: 'Detalle de un instrumento óptico del gabinete',
  },
  cartaOptotipos: {
    src: U('1743183988213-d5e24edf3dc8', '&w=1200'),
    alt: 'Unas gafas sobre una carta de optotipos',
  },
  pareja: {
    src: U('1517948430535-1e2469d314fe', '&w=1200'),
    alt: 'Persona sujetando unas gafas para probárselas',
  },
  paredMonturas: {
    src: U('1486250944723-86bca2b15b06', '&w=1600'),
    alt: 'Expositor con monturas de distintos colores en la óptica',
  },
  estanteria: {
    src: U('1788347101825-f3a560ec1e2d', '&w=1400'),
    alt: 'Filas de gafas en estanterías iluminadas de una óptica',
  },
  vintage: {
    src: U('1759910546804-68fd991aceac', '&w=1400'),
    alt: 'Surtido de monturas de estilo clásico en la tienda',
  },
}

// Monturas del catálogo (foto + datos plausibles, todo de muestra).
export const monturas = [
  { id: 1, nombre: 'Sella', cat: 'mujer', material: 'Acetato', precio: 'desde 95 €', src: U('1614715838608-dd527c46231d', '&w=700&h=520'), alt: 'Montura fina plateada sobre superficie clara' },
  { id: 2, nombre: 'Ordesa', cat: 'hombre', material: 'Metal', precio: 'desde 110 €', src: U('1483412468200-72182dbbc544', '&w=700&h=520'), alt: 'Montura negra de pasta' },
  { id: 3, nombre: 'Tino', cat: 'nino', material: 'TR90 flexible', precio: 'desde 70 €', src: U('1556306510-31ca015374b0', '&w=700&h=520'), alt: 'Gafas de montura negra' },
  { id: 4, nombre: 'Cala', cat: 'sol', material: 'Polarizada', precio: 'desde 140 €', src: U('1602703522866-fb486308da5d', '&w=700&h=520'), alt: 'Montura marrón sobre superficie blanca' },
  { id: 5, nombre: 'Bruma', cat: 'mujer', material: 'Acetato', precio: 'desde 120 €', src: U('1603578119639-798b8413d8d7', '&w=700&h=520'), alt: 'Montura en negro y marrón' },
  { id: 6, nombre: 'Segura', cat: 'hombre', material: 'Titanio', precio: 'desde 180 €', src: U('1608906709312-fe17f7c1a5a6', '&w=700&h=520'), alt: 'Montura negra sobre superficie blanca' },
  { id: 7, nombre: 'Pinar', cat: 'nino', material: 'Acetato', precio: 'desde 75 €', src: U('1701252374715-b5d8ab0b5f2c', '&w=700&h=520'), alt: 'Par de gafas sobre una mesa' },
  { id: 8, nombre: 'Levante', cat: 'sol', material: 'Espejo', precio: 'desde 155 €', src: U('1615468822882-4828d2602857', '&w=700&h=520'), alt: 'Montura plateada sobre cristal' },
  { id: 9, nombre: 'Aldana', cat: 'mujer', material: 'Metal fino', precio: 'desde 130 €', src: U('1534078477103-9f6a18b3a5e2', '&w=700&h=520'), alt: 'Conjunto de monturas' },
]

export const categorias = [
  { id: 'todas', label: 'Todas' },
  { id: 'mujer', label: 'Mujer' },
  { id: 'hombre', label: 'Hombre' },
  { id: 'nino', label: 'Niño' },
  { id: 'sol', label: 'Sol' },
]
