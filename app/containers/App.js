import React from 'react'
import Match from 'react-router/Match'
import Link from 'react-router/Link'
import Router from 'react-router/BrowserRouter'

import routes from 'routes'

import styles from './App.css'

const App = () => (
  <Router>
    <div className={styles.rootElement}>
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
      <route.component {...props} routes={routes.routes} />
    )}
  />
)

export default App
