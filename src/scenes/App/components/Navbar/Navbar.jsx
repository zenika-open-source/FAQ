import React from 'react'
import { Link } from 'react-router-dom'

import { configuration } from 'services'
import { Authenticated, Button, Icon } from 'components'

import GithubIcon from './components/GithubIcon'
import UserMenu from './components/UserMenu'

import './Navbar.scss'

const Navbar = () => (
  <div className="navbar">
    <div className="brand">
      <Link to="/" className="title">
        <img alt="emoji" src="/img/favicon/favicon-64.png" />
        FAQ {configuration.title || ''}
      </Link>
      <Link to="/" className="subtitle tooltip-bottom" data-tooltip="Change group">
        my group name
        <Icon material="autorenew" />
      </Link>
    </div>
    <div className="navigation">
      <a
        href="https://github.com/Zenika/FAQ/issues/new?template=bug_report.md"
        target="_blank"
        rel="noopener noreferrer"
      >
        <GithubIcon />
        <span>report a bug</span>
      </a>
      <Authenticated>
        <UserMenu />
        <Link to="/q/new">
          <Button label={<b>New question</b>} primary fixed />
        </Link>
      </Authenticated>
    </div>
  </div>
)

export default Navbar
