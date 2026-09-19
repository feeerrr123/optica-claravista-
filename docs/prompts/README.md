# Biblioteca de prompts — herramientas ya construidas y probadas

Cada archivo de esta carpeta es un prompt para pegar en una sesión **nueva** de
Claude Code y reproducir, en el negocio que toque, algo que ya funciona en
producción en Óptica Claravista. Están escritos para entenderse **solos**: yo
(Claude) no conservo memoria entre conversaciones, así que todo lo que hace
falta saber va dentro del prompt.

| # | Herramienta | Archivo | Estado |
|---|---|---|---|
| 1 | Sistema de citas (Supabase + Google Calendar + Resend) | `01-sistema-de-citas.md` | Probado en producción |
| 2 | Asistente de IA con Gemini | `02-asistente-ia-gemini.md` | Probado en producción |
| 3 | Animación de puntos con latido y cursor | `03-animacion-puntos-cursor.md` | Desplegada y vista en producción |
| 4 | Juegos interactivos con carné compartible (cualquier sector) | `04-juegos-interactivos.md` | Probado en producción (versión de la vista) |

## Cómo usarlos

1. Abre un proyecto nuevo (o el del cliente) y una sesión de Claude Code.
2. **Pega primero el preámbulo** (abajo) y luego el prompt de la herramienta.
3. Rellena los `[CORCHETES]` con los datos del negocio.
4. Claude te explicará el plan antes de tocar nada. Contéstale y sigue el
   orden que te diga para las cuentas y claves.

## Preámbulo (pégalo antes de cualquier prompt)

```text
Reglas de trabajo para todo lo que sigue:

1. Antes de escribir código, explícame el plan en lenguaje llano: qué vas a
   construir, qué cuentas o claves tengo que conseguir yo y cuánto cuesta.
   Espera mi confirmación antes de empezar.
2. Las cuentas las creo yo y las claves las pego yo directamente en Vercel o
   en un .env.local. Tú nunca creas cuentas ni gestionas contraseñas. No me
   pidas que te pegue claves en el chat.
3. Ningún secreto en el código ni en git. Antes del primer commit, comprueba
   que .env y .env.* están en .gitignore (y que .env.example no lleva valores).
4. Si falta alguna configuración, la app debe funcionar en "modo demo" sin
   romperse, no lanzar errores.
5. Prueba de verdad antes de decirme que está listo: build limpio, prueba de
   la lógica de negocio y, en lo visual, comprobarlo en el navegador. Si algo
   no se puede probar en local, dímelo claramente en vez de darlo por bueno.
6. No hagas commit ni push hasta que te lo pida. Cuando lo pida, recuérdame
   que Vercel despliega desde GitHub: si no hay push, "Redeploy" solo
   repite el commit anterior.
7. Con APIs o SDKs de servicios que cambian rápido (sobre todo IA), consulta
   la documentación oficial actual. No uses ejemplos de memoria.
8. Deja en CLAUDE.md qué se construyó, las reglas duras y lo pendiente.
```

## El repo de referencia (la mejora que más tiempo ahorra)

Un prompt describe el qué y el cómo; el repo tiene el código que ya funciona.
Adaptar algo probado es mucho más rápido y seguro que reescribirlo.

- **Repo:** `github.com/feeerrr123/optica-claravista-` (rama `main`).
- **Cómo usarlo:** clónalo junto a tus otros proyectos (por ejemplo dentro de
  `C:\Claude Proyectos\`) para que Claude pueda leerlo, y en el prompt di la
  ruta: "el proyecto de referencia está en `C:\Claude Proyectos\...\optica-claravista`".
- **Recomendado:** marcar una versión fija con una etiqueta (`plantilla-v1`) y
  activar "Template repository" en GitHub (Settings → General). Así el prompt
  puede decir "copia desde la etiqueta plantilla-v1" y no depende de lo que
  cambie el repo después.
- **Commits de referencia:** citas `fa17670` · asistente IA `486f862` ·
  animación de puntos `fb9d498` y `701d02c` · juegos `fa0c77d` (y `cc4b2e1`,
  que hizo más fácil el estereograma).

## Propiedades sugeridas para la base de datos de Notion

Nombre · Categoría (backend / IA / animación / gamificación) · Cuentas
necesarias · Coste mensual estimado · Tiempo estimado · Estado (probado en
producción / solo local) · Última vez que se probó · Commit de referencia ·
Notas de lo que falló la última vez.

## Mantenerlos vivos

Cada vez que reutilices un prompt y algo falle o cambie (una API, un menú de
Supabase o de Google Cloud), actualiza la sección "Tropiezos reales" de ese
archivo. Los nombres de menús y los planes gratuitos de terceros cambian; los
datos de estos prompts son de septiembre de 2026.

## Seguridad de las claves

Varias claves de este proyecto (Supabase, Google, Resend, Gemini) se pegaron
en el chat mientras se construía. Para un cliente real, genera claves nuevas
y pégalas tú directamente en Vercel, sin pasar por el chat.
