import React from 'react'
import Link from 'react-router/Link'

import styles from './styles.css'

const Header = () => {
  return (
    <header className={styles.main}>
      <nav>
        <span><Link to='/'><i className={'fa fa-diamond fa-lg'} /></Link></span>
        <span><Link to='/about'><i className={'fa fa-cube fa-lg'} /></Link></span>
      </nav>
    </header>
  )
}

export default Header
