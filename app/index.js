import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { AppContainer } from 'react-hot-loader'
import thunk from 'redux-thunk'

import renderToString from './serverRender'
import App from 'containers/App'
import configureStore from 'store'
import immutalize from 'utilities/immutalize'

global.main = renderToString

if (typeof window !== undefined) {
  if (process.env.DEV_STAGE === 'optimize' && process.env.NODE_ENV === 'development') {
    const { whyDidYouUpdate } = require('why-did-you-update')
    whyDidYouUpdate(React)
  }

  const storeWithMiddleware = configureStore([thunk])

  const stateFromServer = window.__INITIAL_STATE__

  const initialState = stateFromServer ? immutalize(stateFromServer) : undefined

  const appStore = storeWithMiddleware(initialState)

  const render = () => {
    ReactDOM.render(
      <AppContainer>
        <Provider store={appStore}>
          <App />
        </Provider>
      </AppContainer>,
      document.getElementById('app')
    )
  }

  render()

  if (module.hot) module.hot.accept('containers/App', render)
}
