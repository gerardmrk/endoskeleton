import React from 'react'
import { connect } from 'react-redux'

import getHeaderTags from 'utilities/getHeaderTags'
import styles from './styles.css'
import background from './unsplash.jpeg'
import heading from './sleepless.svg'

import Counter from 'components/Counter'

const Home = props => {
  const headerTags = getHeaderTags('Home')
  return (
    <div
      className={styles.main}
      style={{
        background: `url(${background})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover'
      }}
    >
      {headerTags}
      <div>
        <img
          src={heading}
          alt={'heading'}
          className={styles.heading}
        />
        <Counter />
      </div>
    </div>
  )
}

const mapStateToProps = (state, localProps) => ({})

export default connect(mapStateToProps, {})(Home)
