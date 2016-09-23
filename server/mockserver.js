import { readFileSync } from 'fs'
import { createServer } from 'http'
import { resolve } from 'path'

import Koa from 'koa'
import Router from 'koa-router'
import send from 'koa-send'
import serve from 'koa-static'
import mount from 'koa-mount'
import convert from 'koa-convert'
import logger from 'koa-morgan'
import compress from 'koa-compress'
import cors from 'koa-cors'
import bodyParser from 'koa-bodyparser'

let PREFS

try {
  // #@! - static - [START]
  const rootPath = resolve(__dirname, '..')
  PREFS = JSON.parse(readFileSync(`${rootPath}/_config_/preferences.json`, 'utf8'))
  // #@! - static - [END]

  Object.keys(PREFS.PATHS).forEach(pathname => {
    const path = PREFS.PATHS[pathname]
    PREFS.PATHS[pathname] = `${rootPath}/${path}`
  })
  PREFS.PATHS['root'] = rootPath
} catch (err) {
  console.error('Error parsing preferences.json: ', err)
}

const { PATHS, PSEUDO_PATHS, DEV } = PREFS
const { MOCK_HOST, MOCK_PORT } = DEV

const app = new Koa()
const router = new Router()

router.get('*', async (ctx, next) => {
  await send(ctx, 'index.html', { root: PATHS.DIST })
})

app.use(logger('dev'))

app.use(convert(compress()))

app.use(convert(cors()))

app.use(bodyParser())

app.use(convert(mount(
  PSEUDO_PATHS.RELATIVE_PUBLICPATH,
  serve(PATHS.DIST, { maxage: 7 * Math.pow(10, 8), gzip: true })
)))

app.use(router.routes())

app.use(router.allowedMethods())

const server = createServer(app.callback())

server.listen(MOCK_PORT, MOCK_HOST, error => {
  if (error) return console.error(error)
  console.log(`Mock server listening on http://${MOCK_HOST}:${MOCK_PORT}`)
})
