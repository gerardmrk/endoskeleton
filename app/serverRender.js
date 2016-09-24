import React from 'react'
import { renderToString } from 'react-dom/server'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { ServerRouter, createServerRenderContext } from 'react-router'
import Helmet from 'react-helmet'

import App from 'containers/App'
import rootReducer from 'reducers'

export default function ({ uuid, url, initialstate }, cb) {
  let result = {
    uuid,
    app: null,
    title: null,
    meta: null,
    link: null,
    initial: null,
    error: null,
    redirect: null,
    status: null
  }

  const store = createStore(rootReducer, initialstate || undefined)

  try {
// =============================================================================
    // Initialize context for <ServerRouter>.
    const context = createServerRenderContext()

    // Render initial markup string.
    let markup = renderToString(
      <ServerRouter location={url} context={context}>
        <Provider store={store}><App /></Provider>
      </ServerRouter>
    )

    // Then, capture the context for additional info or/and errors.
    const ctxResult = context.getResult()

// =============================================================================

    // 1. Handle 301 Redirect Status.
    if (ctxResult.redirect) {
      result.status = 301
      result.redirect = ctxResult.redirect.pathname

    // 2. Handle 404 Not-Found Status.
    } else if (ctxResult.missed) {
      result.status = 404

      // 2.A. Render custom error page defined in React-Router config if exist.
      try {
        markup = renderToString(
          <ServerRouter location={url} context={context}>
            <Provider store={store}><App /></Provider>
          </ServerRouter>
        )
        result.app = markup

      // 2.B. Otherwise yield 404 handling to main server from main error catcher.
      } catch (error) {
        throw error
      }

    // 3. Handle 200 Found Status.
    } else {
      // Retrieve header tags from React-Helmet.
      const { title, meta, link } = Helmet.rewind()
      result.title = title.toString()
      result.meta = meta.toString()
      result.link = link.toString()

      result.status = 200
      result.app = markup
      result.initial = JSON.stringify(store.getState())
    }

    return cb(JSON.stringify(result))
  } catch (error) {
    result.status = result.status === 404 ? result.status : 500
    result.error = error.toString()
    return cb(JSON.stringify(result))
  }
}
