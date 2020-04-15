import React from 'react'
import { Link } from 'react-router-dom'

import { useConfiguration, useIntl } from 'services'
import { Authenticated, Button } from 'components'

import { BugReporting, UserMenu } from './components'

import './Navbar.scss'

const Navbar = () => {
  const intl = useIntl(Navbar)
  const conf = useConfiguration()

  return (
    <div className="navbar">
      <div className="brand">
        <Link to="/" className="title">
          <img alt="emoji" src="/img/favicon/favicon-64.png" />
          FAQ {conf?.title}
        </Link>
      </div>
      <div className="navigation">
        <BugReporting />
        <Authenticated>
          <UserMenu />
          <Link to="/q/new">
            <Button label={<b>{intl('new_question')}</b>} primary fixed />
          </Link>
        </Authenticated>
      </div>
    </div>
  )
}

Navbar.translations = {
  en: { report_bug: 'report a bug', new_question: 'New question' },
  fr: { report_bug: 'signaler un bug', new_question: 'Nouvelle question' }
}

export default Navbar
