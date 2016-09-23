import React from 'react'
import { connect } from 'react-redux'
import Match from 'react-router/Match'
import Link from 'react-router/Link'
import Router from 'react-router/BrowserRouter'
import Helmet from 'react-helmet'

import routes from 'routes'

import styles from './App.css'

import { GENERAL } from 'configs/preferences'

const { APP_NAME, TITLE_FORMAT } = GENERAL

const App = props => (
  <Router>
    <div className={styles.rootElement}>
      <Helmet
        defaultTitle={APP_NAME}
        titleTemplate={TITLE_FORMAT}
      />
      <ul role='nav'>
        <li><Link to='/'>Home</Link></li>
        <li><Link to='/about'>About</Link></li>
      </ul>
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

const mapStateToProps = (state, localProps) => {
  return {

  }
}

export default connect(mapStateToProps, {

})(App)
