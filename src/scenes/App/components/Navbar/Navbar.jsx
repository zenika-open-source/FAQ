import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Link, withRouter } from 'react-router-dom'

import Authenticated from 'components/Authenticated'
import Avatar from 'components/Avatar'
import Dropdown, { DropdownItem, DropdownDivider } from 'components/Dropdown'

import GithubIcon from './components/GithubIcon'

import './Navbar.css'

const Navbar = ({ user, history }) => (
  <Fragment>
    <div className="navbar">
      <Link to="/">
        <div className="brand">
          <img alt="emoji" src="/img/favicon/favicon-64.png" />
          FAQ Zenika
        </div>
      </Link>
      <div className="navigation">
        {user && (
          <Dropdown
            button={
              <div>
                <Authenticated>
                  <Avatar image={user.picture} style={{ width: '25px' }} />
                  <i className="material-icons">arrow_drop_down</i>
                </Authenticated>
              </div>
            }
          >
            <DropdownItem icon="account_box" disabled>
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
  </Fragment>
)

Navbar.propTypes = {
  user: PropTypes.object,
  history: PropTypes.object.isRequired
}

export default withRouter(Navbar)
