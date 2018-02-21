import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link as RouterLink, withRouter } from 'react-router-dom'

import AppBar from 'react-toolbox/lib/app_bar/AppBar'
import Navigation from 'react-toolbox/lib/navigation/Navigation'
import Link from 'react-toolbox/lib/link/Link'
import Authenticated from 'components/Authenticated'

import './style.css'
import GithubIcon from './components/GithubIcon'

class Navbar extends Component {
  render () {
    const { history } = this.props

    return (
      <AppBar
        title={
          <RouterLink
            to="/"
            className="title"
            style={{
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <img
              alt=""
              src="/img/favicon/favicon-64.png"
              style={{ height: '23px', marginRight: '6px' }}
            />
            FAQ Zenika
          </RouterLink>
        }
        rightIcon={<GithubIcon />}
        onRightIconClick={() =>
          window.open('https://github.com/Zenika/FAQ', '_blank')
        }
        className="Navbar"
      >
        <Navigation type="horizontal">
          <Authenticated>
            <Link
              style={{ color: 'white' }}
              label="Sign Out"
              onClick={() => history.push('/auth/logout')}
            />
          </Authenticated>
        </Navigation>
      </AppBar>
    )
  }
}

Navbar.propTypes = {
  history: PropTypes.object.isRequired
}

export default withRouter(Navbar)
