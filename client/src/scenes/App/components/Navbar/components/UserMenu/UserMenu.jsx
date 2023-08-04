import { getIntl } from 'services'
import { useUser, useConfiguration } from 'contexts'

import { Authenticated, Avatar } from 'components'
import Dropdown, { DropdownItem, DropdownDivider } from 'components/Dropdown'

import GithubIcon from '../GithubIcon'

const UserMenu = () => {
  const intl = getIntl(UserMenu)

  const me = useUser()
  const conf = useConfiguration()

  if (!me) return null

  return (
    <Dropdown button={<Avatar image={me.picture} className="w-8 block" />}>
      <DropdownItem icon="account_box" path="/user-profile">
        {intl('profile')}
      </DropdownItem>
      <Authenticated admin specialist>
        <DropdownItem icon="settings" path="/settings">
          {intl('settings')}
        </DropdownItem>
      </Authenticated>
      <DropdownDivider />
      <DropdownItem
        icon={<GithubIcon className="w-5 h-5 m-[2px]" />}
        href="https://github.com/zenika-open-source/FAQ"
        target="_blank"
      >
        {intl('github')}
      </DropdownItem>
      <DropdownItem
        icon="bug_report"
        href={
          conf.bugReporting === 'GITHUB'
            ? 'https://github.com/zenika-open-source/FAQ/issues/new?template=bug_report.md'
            : `mailto:bug@${import.meta.env.VITE_FAQ_URL}`
        }
        target="_blank"
      >
        {intl('bug_report')}
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem icon="exit_to_app" path="/auth/logout">
        {intl('sign_out')}
      </DropdownItem>
    </Dropdown>
  )
}

UserMenu.translations = {
  en: {
    profile: 'Profile',
    settings: 'Settings',
    github: 'Github',
    bug_report: 'Bug report',
    sign_out: 'Sign out',
  },
  fr: {
    profile: 'Profil',
    settings: 'Paramètres',
    github: 'Github',
    bug_report: 'Signaler un bug',
    sign_out: 'Deconnexion',
  },
}

export default UserMenu
