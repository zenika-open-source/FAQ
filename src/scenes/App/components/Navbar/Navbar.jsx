import React from 'react'
import PropTypes from 'prop-types'
import { Link, withRouter } from 'react-router-dom'

import Avatar from 'components/Avatar'
import Dropdown, { DropdownItem, DropdownDivider } from 'components/Dropdown'

import GithubIcon from './components/GithubIcon'

import './Navbar.css'

const Navbar = ({ history, me }) => (
  <div className="navbar">
    <Link to="/">
      <div className="brand">
        <img alt="emoji" src="/img/favicon/favicon-64.png" />
        FAQ Zenika
      </div>
    </Link>
    <div className="navigation">
      <a
        href="https://github.com/Zenika/FAQ"
        target="_blank"
        rel="noopener noreferrer"
      >
        <GithubIcon />
        <span>report a bug</span>
      </a>
      {me && (
        <Dropdown
          button={
            <div>
              <Avatar image={me.picture} style={{ width: '25px' }} />
              <i className="material-icons">arrow_drop_down</i>
            </div>
          }
        >
          <DropdownItem
            icon="account_box"
            onClick={() => history.push('/user-profile')}
          >
            Profile
          </DropdownItem>
          <DropdownDivider />
          <DropdownItem
            icon={<GithubIcon />}
            href="https://github.com/Zenika/FAQ"
            target="_blank"
          >
            Github
          </DropdownItem>
          <DropdownItem
            icon="bug_report"
            href="https://github.com/Zenika/FAQ/issues"
            target="_blank"
          >
            Bug report
          </DropdownItem>
          <DropdownDivider />
          <DropdownItem
            icon="exit_to_app"
            onClick={() => history.push('/auth/logout')}
          >
            Sign out
          </DropdownItem>
        </Dropdown>
      )}
    </div>
  </div>
)

Navbar.propTypes = {
  me: PropTypes.object,
  history: PropTypes.object.isRequired
}

export default withRouter(Navbar)
