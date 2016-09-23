import React from 'react'
import { connect } from 'react-redux'

import getHeaderTags from 'utilities/getHeaderTags'
import styles from './styles.css'

import Counter from 'components/Counter'

const Home = props => {
  const headerTags = getHeaderTags('Home')
  return (
    <div className={styles.main}>
      {headerTags}
      <h1>Home Page</h1>
      <Counter />
    </div>
  )
}

const mapStateToProps = (state, localProps) => ({})

export default connect(mapStateToProps, {})(Home)
