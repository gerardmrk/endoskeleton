import 'babel-polyfill'

import { createServer } from 'http'

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
import { Provider } from 'react-redux'
import { ServerRouter, createServerRenderContext } from 'react-router'
import { createStore } from 'redux'
import Helmet from 'react-helmet'

import PSEUDO_PATHS from '#configs/paths.pseudo'
import PATHS from '#configs/paths'

import rootReducer from '#reducers'
import App from '#containers/App'

const HOST = process.env.RENDERER_HOSTNAME
const PORT = process.env.RENDERER_PORT_HTTP

const { RELATIVE_PUBLICPATH, INDEXHTML_FILE_NAME } = PSEUDO_PATHS

const app = new Koa()
const router = new Router()

app.use(logger('dev'))
app.use(compress())
app.use(convert(cors()))
app.use(bodyParser())
app.use(mount(RELATIVE_PUBLICPATH, serve(PATHS.BUILD_CLIENT, { maxage: 7e+8, gzip: true })))
app.use(views(PATHS.SERVER_VIEWS, { map: { html: 'handlebars' } }))
app.use(router.routes())
app.use(router.allowedMethods())

router.get('*', async (ctx, next) => {
  // 1. Initialize store
  const store = createStore(rootReducer, undefined)

  // 2. Initialize context for <ServerRouter>.
  const context = createServerRenderContext()

  // 3. Render initial markup string.
  let markup = renderToString(
    <ServerRouter location={ctx.url} context={context}>
      <Provider store={store}><App /></Provider>
    </ServerRouter>
  )

  // 4. Then, capture the context for additional info or/and errors.
  const ctxResult = context.getResult()

  // 5. Check and handle 301 Redirect Status.
  if (ctxResult.redirect) {
    ctx.status = 301
    return ctx.redirect(ctxResult.redirect.pathname)
  }

  // 6. Check and handle 404 Not-Found Status.
  if (ctxResult.missed) {
    ctx.status = 404
    markup = renderToString(
      <ServerRouter location={ctx.url} context={context}>
        <Provider store={store}><App /></Provider>
      </ServerRouter>
    )
  }

  // 7. Render final markup with generated html props.
  const { title, meta, link } = Helmet.rewind()
  const htmlProps = {
    Title: title.toString(),
    Meta: meta.toString(),
    Link: link.toString(),
    Body: markup,
    InitialState: JSON.stringify(store.getState())
  }
  await ctx.render(INDEXHTML_FILE_NAME, htmlProps)
})

const renderer = createServer(app.callback())

renderer.listen(PORT, HOST, error => {
  if (error) return console.error(error)
  console.log(`Server listening on http://${HOST}:${PORT}`)
})
