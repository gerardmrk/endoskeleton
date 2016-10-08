import React from 'react'
import { connect } from 'react-redux'
import Match from 'react-router/Match'
import Miss from 'react-router/Miss'
import Helmet from 'react-helmet'

import routes from '#routes'
import styles from './App.css'
import APP_META from '#configs/app.meta'
const { APP_NAME, TITLE_FORMAT } = APP_META

import Header from '#components/Header'
import NotFound from '#containers/NotFound'

const App = props => (
  <div className={styles.rootElement}>
    <Helmet
      defaultTitle={APP_NAME}
      titleTemplate={TITLE_FORMAT}
    />
    <Header />
    <main className={styles.mainContainer}>
      {routes.map((route, i) => <MatchRecursive key={i} {...route} />)}
      <Miss component={NotFound} />
    </main>
  </div>
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
