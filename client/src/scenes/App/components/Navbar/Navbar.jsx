
import { Link } from 'react-router-dom'

import { getIntl } from 'services'
import { useConfiguration } from 'contexts'
import { Authenticated, Button, Icon } from 'components'

import { GithubIcon, UserMenu } from './components'

import './Navbar.scss'

const Navbar = () => {
  const intl = getIntl(Navbar)

  const conf = useConfiguration()

  return (
    <nav className="navbar">
      <div className="brand">
        <Link to="/" className="title">
          <img alt="emoji" src="/img/favicon/favicon-64.png" />
          FAQ {conf.title || ''}
        </Link>
      </div>
      <div className="navigation">
        {conf.bugReporting === 'GITHUB' ? (
          <a
            href="https://github.com/zenika-open-source/FAQ/issues/new?template=bug_report.md"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubIcon />
            <span>{intl('report_bug')}</span>
          </a>
        ) : (
          <a href={`mailto:bug@${import.meta.env.VITE_FAQ_URL}`}>
            <Icon material="mail" style={{ fontSize: '14px' }} />
            <span>{intl('report_bug')}</span>
          </a>
        )}
        <Authenticated>
          <UserMenu />
          <Link to="/q/new">
            <Button label={<b>{intl('new_question')}</b>} primary fixed />
          </Link>
        </Authenticated>
      </div>
    </nav>
  )
}

Navbar.translations = {
  en: { report_bug: 'Report a bug', new_question: 'New question' },
  fr: { report_bug: 'Signaler un bug', new_question: 'Nouvelle question' }
}

export default Navbar
