import React, { Component } from 'react'
import { connect } from 'react-redux'

import styles from './styles.css'
import getHeaderTags from 'utilities/getHeaderTags'
import sleeplessSVG from './sleepless.svg'

class About extends Component {
  render () {
    const headerTags = getHeaderTags('About')
    return (
      <div className={styles.main}>
        {headerTags}
        <div className={styles.auroralNorthern} />
        <div className={styles.auroralStars} />
        <img src={sleeplessSVG} alt='a word' />
      </div>
    )
  }
}

const mapStateToProps = (state, localProps) => ({})

export default connect(mapStateToProps, {})(About)
