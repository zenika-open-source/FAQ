import React from 'react'

import { useIntl } from 'services'

import './Sources.scss'

const Sources = ({ sources }) => {
  const intl = useIntl(Sources)

  if (sources.length === 0) return ''

  return (
    <div className="sources">
      <h3>{intl('sources')}</h3>
      <div className="list">
        {sources.map(source => (
          <a
            key={`${source.label}+${source.url}`}
            className="discret"
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="list-item">
              <i className="material-icons">library_books</i>
              {source.label}
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

Sources.translations = {
  en: { sources: 'Sources:' },
  fr: { sources: 'Sources:' }
}

export default Sources
