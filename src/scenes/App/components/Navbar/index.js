import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link as RouterLink, withRouter } from 'react-router-dom'

import { flags } from 'services'

import AppBar from 'react-toolbox/lib/app_bar/AppBar'
import Navigation from 'react-toolbox/lib/navigation/Navigation'
import IconMenu from 'react-toolbox/lib/menu/IconMenu'
import MenuItem from 'react-toolbox/lib/menu/MenuItem'
import MenuDivider from 'react-toolbox/lib/menu/MenuDivider'
import FontIcon from 'react-toolbox/lib/font_icon/FontIcon'
import Avatar from 'react-toolbox/lib/avatar/Avatar'

import Authenticated from 'components/Authenticated'

import GithubIcon from './components/GithubIcon'

import './style.css'

class Navbar extends Component {
  render () {
    const { user, history } = this.props

    return (
      <AppBar
        title={
          <div className="title">
            <RouterLink to="/">
              <img alt="emoji" src="/img/favicon/favicon-64.png" />
              FAQ Zenika
            </RouterLink>
          </div>
        }
        className="Navbar"
      >
        <Navigation type="horizontal">
          <Authenticated>
            {user && (
              <Avatar
                image={user.picture}
                style={{ width: '24px', height: '24px' }}
              />
            )}
            <IconMenu
              icon={<FontIcon value="more_vert" style={{ color: 'white' }} />}
              position="topRight"
            >
              <MenuItem
                caption="Profile"
                icon="account_circle"
                style={{ width: '200px' }}
                disabled={!flags.profile}
              />
              <MenuDivider />
              <a
                href="https://github.com/Zenika/FAQ"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MenuItem caption="Github" icon={<GithubIcon />} />
              </a>
              <a
                href="https://github.com/Zenika/FAQ/issues"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MenuItem caption="Bug report" icon="bug_report" />
              </a>
              <MenuDivider />
              <MenuItem
                caption="Sign out"
                icon="exit_to_app"
                onClick={() => history.push('/auth/logout')}
              />
            </IconMenu>
          </Authenticated>
        </Navigation>
      </AppBar>
    )
  }
}

Navbar.propTypes = {
  user: PropTypes.object,
  history: PropTypes.object.isRequired
}

export default withRouter(Navbar)
