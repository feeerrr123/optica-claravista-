// Ilustraciones de muestra — se sustituyen por fotos reales de producto.
// Formas de gafas sobre viewBox 0 0 120 60 (un solo trazo).

const FORMAS = {
  redonda:
    'M8 30c0-11 8-17 24-17s24 6 24 17-8 18-24 18S8 41 8 30z M64 30c0-11 8-17 24-17s24 6 24 17-8 18-24 18-24-7-24-18z M56 24c3-3 5-3 8 0 M8 26 2 21 M112 26 118 21',
  rectangular:
    'M8 20h48v18a6 6 0 0 1-6 6H14a6 6 0 0 1-6-6z M64 20h48v18a6 6 0 0 1-6 6H70a6 6 0 0 1-6-6z M56 25h8 M8 20 2 15 M112 20 118 15',
  pantos:
    'M8 22h48l-5 20c-1 4-8 6-19 6S9 46 8 42z M64 22h48l-5 20c-1 4-8 6-19 6s-18-2-19-6z M56 26h8 M8 22 2 17 M112 22 118 17',
  sol:
    'M6 19h50a3 3 0 0 1 3 3v10c0 8-9 14-27 14S6 40 6 32V22a3 3 0 0 1 0-3z M61 19h50a3 3 0 0 1 3 3v10c0 8-9 14-27 14s-27-6-27-14V22a3 3 0 0 1-2-3z M56 23h8 M6 14 1 10 M114 13l5-4',
}

export const categorias = [
  { id: 'todas', label: 'Todas' },
  { id: 'mujer', label: 'Mujer' },
  { id: 'hombre', label: 'Hombre' },
  { id: 'nino', label: 'Niño' },
  { id: 'sol', label: 'Sol' },
]

export const monturas = [
  { id: 1, nombre: 'Sella', cat: 'mujer', material: 'Acetato', precio: 'desde 95 €', forma: 'redonda' },
  { id: 2, nombre: 'Ordesa', cat: 'hombre', material: 'Metal', precio: 'desde 110 €', forma: 'rectangular' },
  { id: 3, nombre: 'Tino', cat: 'nino', material: 'TR90 flexible', precio: 'desde 70 €', forma: 'pantos' },
  { id: 4, nombre: 'Cala', cat: 'sol', material: 'Polarizada', precio: 'desde 140 €', forma: 'sol' },
  { id: 5, nombre: 'Bruma', cat: 'mujer', material: 'Acetato', precio: 'desde 120 €', forma: 'pantos' },
  { id: 6, nombre: 'Segura', cat: 'hombre', material: 'Titanio', precio: 'desde 180 €', forma: 'rectangular' },
  { id: 7, nombre: 'Pinar', cat: 'nino', material: 'Acetato', precio: 'desde 75 €', forma: 'redonda' },
  { id: 8, nombre: 'Levante', cat: 'sol', material: 'Espejo', precio: 'desde 155 €', forma: 'sol' },
  { id: 9, nombre: 'Aldana', cat: 'mujer', material: 'Metal fino', precio: 'desde 130 €', forma: 'redonda' },
]

export const formaPath = (forma) => FORMAS[forma] || FORMAS.redonda
