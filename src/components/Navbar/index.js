import React, { Component } from 'react'
import AppBar from 'react-toolbox/lib/app_bar/AppBar'

import './style.css'
import GithubIcon from './github-icon'

class Navbar extends Component {
  render () {
    return (
      <AppBar title='🤔 FAQ Zenika'
        rightIcon={<GithubIcon />}
        onRightIconClick={() => window.open('https://github.com/Zenika/FAQ', '_blank')}
        className='Navbar'>
      </AppBar>
    )
  }
}

export default Navbar
