import React from 'react'

import './Footer.scss'

const Footer = () => (
  <footer className="footer">
    <a href="https://www.algolia.com" target="_blank" rel="noopener noreferrer">
      <img src="/img/brands/powered-by-algolia.svg" alt="Powered by Algolia" />
    </a>
    <span className="contact">
      <i className="material-icons">mail</i>
      <a href={`mailto:contact@${import.meta.env.VITE_FAQ_URL}`}>
        contact@{import.meta.env.VITE_FAQ_URL}
      </a>
    </span>
  </footer>
)

export default Footer
