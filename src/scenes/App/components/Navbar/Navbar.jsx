import React from 'react'
import { Link } from 'react-router-dom'

import { auth, configuration } from 'services'

import { Button } from 'components'

import GithubIcon from './components/GithubIcon'
import UserMenu from './components/UserMenu'

import './Navbar.css'

const Navbar = () => (
  <div className="navbar">
    <Link to="/">
      <div className="brand">
        <img alt="emoji" src="/img/favicon/favicon-64.png" />
        FAQ {configuration.title || ''}
      </div>
    </Link>
    <div className="navigation">
      <a
        className="report-bug"
        href="https://github.com/Zenika/FAQ"
        target="_blank"
        rel="noopener noreferrer"
      >
        <GithubIcon />
        <span>report a bug</span>
      </a>
      {auth.isAuthenticated() && <UserMenu />}
      <Link to="/q/new" className="new-question">
        <Button icon="record_voice_over" label="New question" primary fixed />
      </Link>
    </div>
  </div>
)

export default Navbar
