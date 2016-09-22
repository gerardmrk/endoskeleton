import React from 'react'
import styles from './App.css'

import Counter from 'components/Counter'

const App = () => (
  <div className={styles.app}>
    <h1>I am feeling alright</h1>
    <Counter />
  </div>
)

export default App
