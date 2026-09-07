# Óptica Claravista (demo)

Web de demostración multipágina de una óptica ficticia. Prototipo para enseñar a
ópticas reales en el negocio de creación de webs para negocios locales.

**Marca ficticia. Ningún dato representa a una empresa real.**

## Arrancar

```bash
npm install
npm run dev
```

Abre <http://localhost:5173>.

## Estado

| Página | Estado |
|---|---|
| Inicio | construida |
| Servicios · Monturas · Sobre nosotros · Pide cita · Contacto | stub (placeholder) |
| Navbar + Footer + transición de página | funcionando |
| Chatbot (FAQ sin IA) | funcionando |

Se construye **página por página**. Ver `CLAUDE.md` para la arquitectura y la lista
de pendientes.

## Personalizar

- **Colores**: `src/index.css`, bloque `:root`. Formato canal RGB. Hay variantes
  de ejemplo comentadas.
- **Textos de marcador**: buscar `[ciudad]`, `[teléfono]`, `[TU ESTUDIO]`.
- **Chatbot**: `src/data/chatbot.js`.

## Deploy (Vercel)

`vercel.json` ya incluye el rewrite para que las rutas profundas funcionen.
Build command `npm run build`, output `dist`.
