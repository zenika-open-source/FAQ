import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'

import { useUser, useConfiguration } from 'contexts'

import { Authenticated, Avatar } from 'components'
import Dropdown, { DropdownItem, DropdownDivider } from 'components/Dropdown'

import GithubIcon from '../GithubIcon'

const UserMenu = ({ history }) => {
  const me = useUser()
  const conf = useConfiguration()

  if (!me) return null

  return (
    <Dropdown button={<Avatar image={me.picture} style={{ width: '30px', display: 'block' }} />}>
      <DropdownItem icon="account_box" path="/user-profile">
        Profile
      </DropdownItem>
      <Authenticated admin>
        <DropdownItem icon="settings" path="/settings">
          Settings
        </DropdownItem>
      </Authenticated>
      <DropdownDivider />
      <DropdownItem
        icon={<GithubIcon style={{ width: '20px', height: '20px', margin: '2px' }} />}
        href="https://github.com/zenika-open-source/FAQ"
        target="_blank"
      >
        Github
      </DropdownItem>
      <DropdownItem
        icon="bug_report"
        href={
          conf.bugReporting === 'GITHUB'
            ? 'https://github.com/zenika-open-source/FAQ/issues/new?template=bug_report.md'
            : `mailto:bug@${process.env.REACT_APP_FAQ_URL}`
        }
        target="_blank"
      >
        Bug report
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem icon="exit_to_app" path="/auth/logout">
        Sign out
      </DropdownItem>
    </Dropdown>
  )
}

UserMenu.propTypes = {
  history: PropTypes.object.isRequired
}

export default withRouter(UserMenu)
