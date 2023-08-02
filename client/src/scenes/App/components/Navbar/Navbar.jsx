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
    <nav className="fixed top-0 w-screen bg-primary h-navbar flex items-center px-6 justify-between z-10">
      <div className="flex items-end">
        <Link to="/" className="flex items-center text-xl text-primary-font">
          <img alt="emoji" src="/img/favicon/favicon-64.png" className="mr-[6px] h-[23px]" />
          FAQ {conf.title || ''}
        </Link>
      </div>
      <div className="flex items-center gap-x-4">
        {conf.bugReporting === 'GITHUB' ? (
          <a
            href="https://github.com/zenika-open-source/FAQ/issues/new?template=bug_report.md"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-primary-font"
          >
            <GithubIcon className="h-[0.8rem] w-[0.8rem] mr-0 fill-primary-font" />
            <span className="ml-[0.3rem] mt-[-0.1rem]">{intl('report_bug')}</span>
          </a>
        ) : (
          <a href={`mailto:bug@${import.meta.env.VITE_FAQ_URL}`}>
            <Icon
              className="h-[0.8rem] w-[0.8rem] mr-0 fill-primary-font"
              material="mail"
              style={{ fontSize: '14px' }}
            />
            <span className="ml-[0.3rem] mt-[-0.1rem]">{intl('report_bug')}</span>
          </a>
        )}
        <Authenticated>
          <UserMenu />
          <Link to="/q/new">
            <Button label={<b>{intl('new_question')}</b>} intent="secondary" size="medium" />
          </Link>
        </Authenticated>
      </div>
    </nav>
  )
}

Navbar.translations = {
  en: { report_bug: 'Report a bug', new_question: 'New question' },
  fr: { report_bug: 'Signaler un bug', new_question: 'Nouvelle question' },
}

export default Navbar
