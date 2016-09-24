import { createServer } from 'http'
import { resolve } from 'path'

import Koa from 'koa'
import Router from 'koa-router'
import views from 'koa-views'
import serve from 'koa-static'
import mount from 'koa-mount'
import convert from 'koa-convert'
import logger from 'koa-morgan'
import compress from 'koa-compress'
import cors from 'koa-cors'
import bodyParser from 'koa-bodyparser'

import React from 'react'
import { renderToString } from 'react-dom/server'
import { ServerRouter, createServerRenderContext } from 'react-router'
import { createStore } from 'redux'

import rootReducer from '../app/reducers'
import App from '../app/containers/App'

// #@! - static - [START]
import parsePreferences from '../_config_/helpers/parsePreferences'
const PREFS = parsePreferences(resolve(__dirname, '..'))
// #@! - static - [END]

const { PATHS, PSEUDO_PATHS, DEV } = PREFS
const { MOCK_HOST, MOCK_PORT } = DEV
const {
  CLIENT_HTML_FILENAME,
  CLIENT_HTML_EXT_PRO,
  RELATIVE_PUBLICPATH
} = PSEUDO_PATHS

const CLIENT_FILE = `${CLIENT_HTML_FILENAME}${CLIENT_HTML_EXT_PRO}`

const app = new Koa()
const router = new Router()

app.use(logger('dev'))

app.use(convert(compress()))

app.use(convert(cors()))

app.use(bodyParser())

app.use(convert(mount(
  RELATIVE_PUBLICPATH,
  serve(PATHS.DISTRIBUTION, { maxage: 7 * Math.pow(10, 8), gzip: true })
)))

app.use(views(PATHS.VIEWS, { map: { html: 'handlebars' } }))

app.use(router.routes())

app.use(router.allowedMethods())

router.get('*', async (ctx, next) => {
  const context = createServerRenderContext()

  let markup = renderToString(<ServerRouter location={ctx.url} context={context}><App /></ServerRouter>)

  const result = context.getResult()

  if (result.redirect) {
    return ctx.redirect(result.redirect.pathname)
  }

  if (result.missed) {
    ctx.status = 404
    markup = renderToString(<ServerRouter location={ctx.url} context={context}><App /></ServerRouter>)
  }

  const store = createStore(rootReducer, undefined)

  await ctx.render(CLIENT_HTML_FILENAME, {
    body: markup,
    initialState: JSON.stringify(store.getState())
  })
})

const server = createServer(app.callback())

server.listen(MOCK_PORT, MOCK_HOST, error => {
  if (error) return console.error(error)
  console.log(`Mock server listening on http://${MOCK_HOST}:${MOCK_PORT}`)
})
