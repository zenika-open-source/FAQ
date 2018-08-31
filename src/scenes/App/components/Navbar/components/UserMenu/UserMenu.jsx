import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'

import Avatar from 'components/Avatar'
import Dropdown, { DropdownItem, DropdownDivider } from 'components/Dropdown'

import GithubIcon from '../GithubIcon'

const UserMenu = ({ history, me }) => (
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
)

UserMenu.propTypes = {
  history: PropTypes.object.isRequired,
  me: PropTypes.object.isRequired
}

export default withRouter(UserMenu)
