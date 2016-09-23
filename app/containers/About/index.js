import React from 'react'
import styles from './styles.css'

import getHeaderTags from 'utilities/getHeaderTags'

const About = () => {
  const headerTags = getHeaderTags('About')
  return (
    <div className={styles.main}>
      {headerTags}
      <h1>About Page</h1>
    </div>
  )
}

export default About
