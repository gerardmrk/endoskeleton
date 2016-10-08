import curry from 'ramda/src/curry'
import { createStore, applyMiddleware, compose } from 'redux'

import rootReducer from '#reducers'

const configureStore = curry((middleware, initialState) => {
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(...middleware),
      window.devToolsExtension ? window.devToolsExtension() : f => f
    )
  )

  if (module.hot) {
    module.hot.accept('reducers', () => {
      store.replaceReducer(rootReducer)
    })
  }

  return store
})

export default configureStore
