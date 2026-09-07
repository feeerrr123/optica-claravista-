// Iconos como componentes SVG de un solo trazo (sin librería de iconos).
const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export const servicios = [
  {
    id: 'graduacion',
    titulo: 'Graduación de la vista',
    resumen:
      'Examen visual completo con optometrista: agudeza, refracción, salud ocular y presión intraocular. Unos 30 minutos.',
    detalle:
      'Medimos cómo ves de lejos y de cerca, revisamos el fondo de ojo y la presión intraocular, y comprobamos si la graduación anterior sigue siendo la tuya. Si detectamos algo que deba ver un oftalmólogo, te lo decimos con claridad.',
    incluye: ['Agudeza visual y refracción', 'Salud ocular y tonometría', 'Prueba de la nueva graduación', 'Informe para llevarte'],
    duracion: '30 min',
    traer: 'Tus gafas actuales y, si la tienes, la última receta.',
    icon: (props) => (
      <svg viewBox="0 0 40 40" {...stroke} {...props}>
        <path d="M4 20c4-7 10-11 16-11s12 4 16 11c-4 7-10 11-16 11S8 27 4 20z" />
        <circle cx="20" cy="20" r="5" />
      </svg>
    ),
  },
  {
    id: 'lentillas',
    titulo: 'Adaptación de lentes de contacto',
    resumen:
      'Estudio de la lágrima y la córnea, prueba de lentes y enseñanza de manejo. Blandas, rígidas y de uso especial.',
    detalle:
      'No todas las lentillas valen para todos los ojos. Estudiamos tu lágrima y la forma de tu córnea, probamos varias opciones en consulta y te enseñamos a ponértelas, quitártelas y cuidarlas con calma.',
    incluye: ['Estudio de lágrima y topografía', 'Prueba de lentes en consulta', 'Sesión de manejo e higiene', 'Revisión de control incluida'],
    duracion: '45 min',
    traer: 'Ven sin lentillas puestas ese día si es posible.',
    icon: (props) => (
      <svg viewBox="0 0 40 40" {...stroke} {...props}>
        <path d="M20 7c7 3 11 8 11 14 0 5-4 9-11 9S9 26 9 21c0-6 4-11 11-14z" />
        <path d="M14 18c1.5-3 4-5 7-6" />
      </svg>
    ),
  },
  {
    id: 'sol',
    titulo: 'Gafas de sol graduadas',
    resumen:
      'Protección UV real con tu graduación. Polarizadas, fotocromáticas y de deporte, con asesoramiento de montura.',
    detalle:
      'Una gafa de sol es un producto sanitario: tiene que filtrar el UV de verdad y ajustarse bien. Montamos tu graduación en lentes polarizadas, fotocromáticas o de espejo, y te ayudamos a elegir la montura según tu cara y tu uso.',
    incluye: ['Lentes con filtro UV400', 'Opción polarizada o fotocromática', 'Montaje con tu graduación', 'Ajuste y garantía'],
    duracion: '20 min',
    traer: 'Tu graduación vigente (o te la revisamos antes).',
    icon: (props) => (
      <svg viewBox="0 0 40 40" {...stroke} {...props}>
        <path d="M5 16h12l2 3h2l2-3h12" />
        <rect x="5" y="16" width="12" height="9" rx="4.5" />
        <rect x="23" y="16" width="12" height="9" rx="4.5" />
      </svg>
    ),
  },
  {
    id: 'infantil',
    titulo: 'Revisión visual infantil',
    resumen:
      'Control del desarrollo visual desde los 3 años: ojo vago, estrabismo y necesidades escolares. Trato tranquilo y sin prisa.',
    detalle:
      'Muchos problemas de visión en la infancia no dan síntomas y se detectan en una revisión. Trabajamos con test adaptados a cada edad, sin prisa, y damos un informe claro para el pediatra o el colegio si hace falta.',
    incluye: ['Test adaptados por edad', 'Detección de ojo vago y estrabismo', 'Valoración de visión de cerca (lectura)', 'Informe para pediatra o colegio'],
    duracion: '30 min',
    traer: 'El informe del cole o del pediatra si lo tenéis.',
    icon: (props) => (
      <svg viewBox="0 0 40 40" {...stroke} {...props}>
        <circle cx="20" cy="13" r="6" />
        <path d="M8 32c1.5-6 6-9 12-9s10.5 3 12 9" />
      </svg>
    ),
  },
]
