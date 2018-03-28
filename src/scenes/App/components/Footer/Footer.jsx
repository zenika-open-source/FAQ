import React from 'react'

const Footer = () => (
  <div className="footer">
    <a
      href="https://graph.coom"
      target="_blank"
      rel="noopener noreferrer"
      style={{ display: 'flex' }}
    >
      <img
        src="/img/brands/backend-by-graphcool.svg"
        alt="Backend by Graphcool"
        style={{ height: '30px' }}
      />
    </a>
    <a href="https://www.algolia.com" target="_blank" rel="noopener noreferrer">
      <img src="/img/brands/powered-by-algolia.svg" alt="Powered by Algolia" />
    </a>
  </div>
)

export default Footer
