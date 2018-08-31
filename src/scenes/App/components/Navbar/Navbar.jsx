import React from 'react'
import { Link } from 'react-router-dom'

import { auth } from 'services'

import GithubIcon from './components/GithubIcon'
import UserMenu from './components/UserMenu'

import './Navbar.css'

const Navbar = () => (
  <div className="navbar">
    <Link to="/">
      <div className="brand">
        <img alt="emoji" src="/img/favicon/favicon-64.png" />
        FAQ Zenika
      </div>
    </Link>
    <div className="navigation">
      <a
        href="https://github.com/Zenika/FAQ"
        target="_blank"
        rel="noopener noreferrer"
      >
        <GithubIcon />
        <span>report a bug</span>
      </a>
      {auth.isAuthenticated() && <UserMenu />}
    </div>
  </div>
)

export default Navbar
