#!/usr/bin/env node
// Autorización de Google Calendar — SE EJECUTA EN TU ORDENADOR, UNA VEZ
// (y cada vez que el permiso caduque, cada 7 días mientras la app esté en
// modo "prueba" en Google Cloud). Abre una pantalla de Google en TU
// navegador; el inicio de sesión lo haces tú, esto nunca ve tu contraseña.
//
// Uso:
//   1. Pon GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET en un archivo .env.local
//      en la raíz del proyecto (NO se sube a git — mira el .gitignore).
//   2. node scripts/autorizar-google.mjs
//   3. Abre el enlace que te imprime, elige la cuenta de Google del
//      calendario de la óptica, dale a "Continuar" aunque salga el aviso de
//      "Google no ha verificado esta app" (es la nuestra, es de fiar).
//   4. El script imprime GOOGLE_REFRESH_TOKEN y lo guarda en .env.local.
//      Copia esa línea también en Vercel → Settings → Environment Variables.

import { readFileSync, existsSync, appendFileSync } from 'fs'
import { createServer } from 'http'
import { google } from 'googleapis'

const PUERTO = 3939
const REDIRECT_URI = `http://localhost:${PUERTO}/oauth2callback`
const ENV_LOCAL = new URL('../.env.local', import.meta.url)

function cargarEnvLocal() {
  if (!existsSync(ENV_LOCAL)) return
  for (const linea of readFileSync(ENV_LOCAL, 'utf8').split('\n')) {
    const m = linea.match(/^([A-Z_]+)=(.*)$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim()
  }
}

cargarEnvLocal()

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.error(`
Faltan GOOGLE_CLIENT_ID y/o GOOGLE_CLIENT_SECRET.

Créalos en Google Cloud Console (APIs & Services → Credentials → Create
Credentials → OAuth client ID → tipo "Web application", con
${REDIRECT_URI} como "Authorized redirect URI"), y ponlos en un archivo
.env.local en la raíz del proyecto:

  GOOGLE_CLIENT_ID=...
  GOOGLE_CLIENT_SECRET=...
`)
  process.exit(1)
}

const oAuth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, REDIRECT_URI)

const authUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent', // fuerza que Google devuelva refresh_token también en reautorizaciones
  scope: ['https://www.googleapis.com/auth/calendar'],
})

console.log('\nAbre este enlace en tu navegador y acepta con la cuenta de Google de la óptica:\n')
console.log(authUrl + '\n')
console.log(`Esperando en ${REDIRECT_URI} ...`)

const server = createServer(async (req, res) => {
  if (!req.url.startsWith('/oauth2callback')) {
    res.writeHead(404)
    return res.end()
  }
  const code = new URL(req.url, REDIRECT_URI).searchParams.get('code')
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
  res.end('<p>Listo, ya puedes cerrar esta pestaña y volver a la terminal.</p>')
  server.close()

  try {
    const { tokens } = await oAuth2Client.getToken(code)
    if (!tokens.refresh_token) {
      console.error(
        '\nGoogle no devolvió un refresh_token. Prueba a quitarle el acceso a la app desde\n' +
          'https://myaccount.google.com/permissions y vuelve a correr este script.',
      )
      process.exit(1)
    }
    console.log('\n✔ Autorizado. Añade esto a Vercel (Settings → Environment Variables):\n')
    console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}\n`)
    appendFileSync(ENV_LOCAL, `\nGOOGLE_REFRESH_TOKEN=${tokens.refresh_token}\n`)
    console.log(`(También lo he guardado en .env.local por si lo necesitas otra vez.)\n`)
  } catch (err) {
    console.error('\nNo se pudo canjear el código:', err.message)
  }
  process.exit(0)
})

server.listen(PUERTO)
