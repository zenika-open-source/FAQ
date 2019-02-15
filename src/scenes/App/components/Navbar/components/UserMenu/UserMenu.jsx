import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'

import { useUser } from 'contexts'

import { Authenticated, Avatar } from 'components'
import Dropdown, { DropdownItem, DropdownDivider } from 'components/Dropdown'

import GithubIcon from '../GithubIcon'

const UserMenu = ({ history }) => {
  const me = useUser()

  if (!me) return null

  return (
    <Dropdown button={<Avatar image={me.picture} style={{ width: '30px', display: 'block' }} />}>
      <DropdownItem icon="account_box" onClick={() => history.push('/user-profile')}>
        Profile
      </DropdownItem>
      <Authenticated admin>
        <DropdownItem icon="settings" onClick={() => history.push('/settings')}>
          Settings
        </DropdownItem>
      </Authenticated>
      <DropdownDivider />
      <DropdownItem icon={<GithubIcon />} href="https://github.com/Zenika/FAQ" target="_blank">
        Github
      </DropdownItem>
      <DropdownItem
        icon="bug_report"
        href="https://github.com/Zenika/FAQ/issues/new?template=bug_report.md"
        target="_blank"
      >
        Bug report
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem icon="exit_to_app" onClick={() => history.push('/auth/logout')}>
        Sign out
      </DropdownItem>
    </Dropdown>
  )
}

UserMenu.propTypes = {
  history: PropTypes.object.isRequired
}

export default withRouter(UserMenu)
