import React from 'react'

import RandomQuote from './RandomQuote'

const Footer = () => (
  <footer className="footer">
    <div className=" container">
      <div className="pro_border">
        <div className="row">
          <div className="col-xl-6 col-md-6">
            <div className="lets_projects">
              <h3>
                Start using FAQ, <a href="/">now</a>
              </h3>
            </div>
          </div>
          <div className="col-xl-6 col-md-6">
            <div className="phone_number">
              <h3>
                <span role="img" aria-label="thinking emoji">
                  🤔
                </span>{' '}
                <span role="img" aria-label="magnifying glass emoji">
                  🔍
                </span>{' '}
                <span role="img" aria-label="speech ballon emoji">
                  💬
                </span>{' '}
                <span role="img" aria-label="grinning emoji">
                  😀
                </span>
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="footer_top">
      <div className="container">
        <div className="row">
          <div className="col-xl-3 col-md-6 col-lg-3">
            <div className="footer_widget">
              <br />
              <RandomQuote />
              <div className="socail_links">
                <ul>
                  <li>
                    <a href="https://www.facebook.com/ZenikaIT/">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://twitter.com/ZenikaIT">
                      <i className="fab fa-twitter"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.linkedin.com/company/zenika/">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-md-6 col-lg-3">
            <div className="footer_widget">
              <h3 className="footer_title">Useful Links</h3>
              <ul>
                <li>
                  <a
                    href="https://github.com/zenika-open-source/FAQ"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Github
                  </a>
                </li>
                <li>
                  <a href="https://jobs.zenika.com/" target="_blank" rel="noopener noreferrer">
                    Jobs at Zenika
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-xl-2 col-md-6 col-lg-2">
            <div className="footer_widget">
              <h3 className="footer_title">Legal Stuff</h3>
              <ul>
                <li>
                  <a href="/">Terms and Conditions</a>
                </li>
                <li>
                  <a href="/">Privacy Policy</a>
                </li>
                <li>
                  <a href="mail:contact@faq.team">Contact</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-xl-4 offset-xl-1 col-md-6 col-lg-4">
            <div className="footer_widget">
              <h3 className="footer_title">Subscribe</h3>
              <form action="#" className="newsletter_form">
                <input type="text" placeholder="Enter your mail" />
                <button type="submit">Subscribe</button>
              </form>
              <p className="newsletter_text">
                We may send you news about FAQ, not more than once or twice a year.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="copy-right_text">
      <div className="container">
        <div className="footer_border"></div>
        <div className="row">
          <div className="col-xl-12">
            <p className="copy_right text-center">
              Copyright &copy;{new Date().getFullYear()} All rights reserved | The template was made
              with <i className="far fa-heart" aria-hidden="true"></i> by{' '}
              <a href="https://colorlib.com" target="_blank" rel="noopener noreferrer">
                Colorlib
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </footer>
)

export default Footer
