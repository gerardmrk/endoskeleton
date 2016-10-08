import React, { Component } from 'react'
import { connect } from 'react-redux'

import styles from './styles.css'
import getHeaderTags from '#utilities/getHeaderTags'
import sleeplessSVG from './sleepless.svg'
import background from './grey.jpeg'

class About extends Component {
  render () {
    const headerTags = getHeaderTags('About')
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
          <img src={sleeplessSVG} alt='a word' />
          <h2>day-dreamer, night-thinker</h2>
          <h3>The trick, William Potter, is not minding that it hurts</h3>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, localProps) => ({})

export default connect(mapStateToProps, {})(About)
