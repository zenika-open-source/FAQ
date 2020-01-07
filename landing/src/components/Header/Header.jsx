import React, { useEffect, useRef, useState } from 'react'
import cn from 'classnames'

import './Header.scss'

const Header = () => {
  const stickyHeader = useRef()
  const [sticky, setSticky] = useState(false)
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY < 400) {
        setSticky(false)
      } else {
        setSticky(true)
      }
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [stickyHeader])

  return (
    <header>
      <div className="header-area ">
        <div id="sticky-header" className={cn('main-header-area', { sticky })} ref={stickyHeader}>
          <div className="container-fluid">
            <div className="row align-items-center">
              <div className="col-xl-3 col-lg-2">
                <div className="logo">
                  <a href="#home" className="title">
                    {/*<img src="img/logo.png" alt="" />*/}
                    <img src="img/thinking_face.png" alt="" />
                    <div>
                      <h1>FAQ</h1>
                      <h2>by Zenika</h2>
                    </div>
                  </a>
                </div>
              </div>
              <div className="col-xl-6 col-lg-7">
                <div className="main-menu  d-none d-lg-block">
                  <nav>
                    <ul id="navigation">
                      <li>
                        <a href="#home">Home</a>
                      </li>
                      <li>
                        <a href="#features">Features</a>
                      </li>
                      <li>
                        <a href="#they_use_faq">They use FAQ</a>
                      </li>
                      <li>
                        <a href="#pricing">Pricing</a>
                      </li>
                      <li>
                        <a href="#about_us">About Us</a>
                      </li>
                      <li>
                        <a
                          href="https://github.com/zenika-open-source/FAQ"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Github{' '}
                          <i
                            className="fas fa-external-link-alt"
                            style={{ position: 'relative', top: '-1px' }}
                          ></i>
                        </a>
                      </li>
                      {/*<li>
                        <a href="/">
                          pages <i className="fas fa-angle-down"></i>
                        </a>
                        <ul className="submenu">
                          <li>
                            <a href="/">Case details</a>
                          </li>
                          <li>
                            <a href="/">about</a>
                          </li>
                          <li>
                            <a href="/">elements</a>
                          </li>
                        </ul>
                      </li>*/}
                    </ul>
                  </nav>
                </div>
              </div>
              <div className="col-xl-3 col-lg-3 d-none d-lg-block">
                <div className="Appointment">
                  <div className="book_btn d-none d-lg-block">
                    <a href="https://demo.faq.team" target="_blank" rel="noopener noreferrer">
                      <i className="far fa-hand-point-right"></i> Demo
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="mobile_menu d-block d-lg-none"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
