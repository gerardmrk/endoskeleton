import React from 'react'
import { connect } from 'react-redux'
import Match from 'react-router/Match'
import Router from 'react-router/BrowserRouter'
import Helmet from 'react-helmet'

import routes from 'routes'
import styles from './App.css'
import { GENERAL } from 'configs/preferences'
const { APP_NAME, TITLE_FORMAT } = GENERAL

import Header from 'components/Header'

const App = props => (
  <Router>
    <div className={styles.rootElement}>
      <Helmet
        defaultTitle={APP_NAME}
        titleTemplate={TITLE_FORMAT}
      />
      <Header />
      <main className={styles.mainContainer}>
        {routes.map((route, i) => (
          <MatchRecursive key={i} {...route} />
        ))}
      </main>
    </div>
  </Router>
)

const MatchRecursive = route => (
  <Match
    {...route}
    exactly={route.exactly}
    pattern={route.pattern}
    render={props => (
      <route.component {...props} routes={route.routes} />
    )}
  />
)

const mapStateToProps = (state, localProps) => ({})

export default connect(mapStateToProps)(App)
