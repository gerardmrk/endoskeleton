import React from 'react'
import styles from './styles.css'

import Counter from 'components/Counter'

const Home = () => {
  return (
    <div className={styles.main}>
      <h1>Home Page</h1>
      <Counter />
    </div>
  )
}

export default Home
