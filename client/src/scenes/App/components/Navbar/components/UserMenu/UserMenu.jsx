import React from 'react'

import { useUser, useConfiguration, useIntl, signOut } from 'services'
import { Authenticated, Avatar, Dropdown } from 'components'

import GithubIcon from '../BugReporting/GithubIcon'

const UserMenu = () => {
  const intl = useIntl(UserMenu)

  const user = useUser()
  const conf = useConfiguration()

  if (!user) return null

  return (
    <Dropdown button={<Avatar image={user?.picture} style={{ width: '30px', display: 'block' }} />}>
      <Dropdown.Item icon="account_box" path="/user/me">
        {intl('profile')}
      </Dropdown.Item>
      <Authenticated admin>
        <Dropdown.Item icon="settings" path="/settings">
          {intl('settings')}
        </Dropdown.Item>
      </Authenticated>
      <Dropdown.Divider />
      <Dropdown.Item
        icon={<GithubIcon style={{ width: '20px', height: '20px', margin: '2px' }} />}
        href="https://github.com/zenika-open-source/FAQ"
        target="_blank"
      >
        {intl('github')}
      </Dropdown.Item>
      <Dropdown.Item
        icon="bug_report"
        href={
          conf.bugReporting === 'GITHUB'
            ? 'https://github.com/zenika-open-source/FAQ/issues/new?template=bug_report.md'
            : `mailto:bug@${process.env.REACT_APP_FAQ_URL}`
        }
        target="_blank"
        disabled={!conf}
      >
        {intl('bug_report')}
      </Dropdown.Item>
      <Dropdown.Divider />
      <Dropdown.Item icon="exit_to_app" onClick={signOut}>
        {intl('sign_out')}
      </Dropdown.Item>
    </Dropdown>
  )
}

UserMenu.translations = {
  en: {
    profile: 'Profile',
    settings: 'Settings',
    github: 'Github',
    bug_report: 'Bug report',
    sign_out: 'Sign out'
  },
  fr: {
    profile: 'Profil',
    settings: 'Paramètres',
    github: 'Github',
    bug_report: 'Signaler un bug',
    sign_out: 'Deconnexion'
  }
}

export default UserMenu
