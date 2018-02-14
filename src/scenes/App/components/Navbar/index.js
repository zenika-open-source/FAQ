import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import AppBar from 'react-toolbox/lib/app_bar/AppBar'
import Authenticated from 'components/Authenticated'

import './style.css'
import GithubIcon from './components/GithubIcon'

class Navbar extends Component {
  render () {
    return (
      <AppBar
        title="🤔 FAQ Zenika"
        rightIcon={<GithubIcon />}
        onRightIconClick={() =>
          window.open('https://github.com/Zenika/FAQ', '_blank')
        }
        className="Navbar"
      >
        <Authenticated>
          <Link to="/auth/logout">Sign Out</Link>
        </Authenticated>
      </AppBar>
    )
  }
}

export default Navbar
