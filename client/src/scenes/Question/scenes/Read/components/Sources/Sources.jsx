
import PropTypes from 'prop-types'

import { getIntl } from 'services'

import List, { ListItem } from 'components/List'

const Sources = ({ sources }) => {
  const intl = getIntl(Sources)

  if (sources.length === 0) return ''

  return (
    <div style={{ borderTop: '1px dashed var(--secondary-color)' }}>
      <h3
        style={{
          color: 'var(--primary-color)',
          margin: '0.7rem',
          marginBottom: '0'
        }}
      >
        {intl('sources')}
      </h3>
      <List
        style={{
          fontSize: 'var(--small-font-size)',
          color: 'var(--secondary-color-font-light)'
        }}
      >
        {sources.map(source => (
          <ListItem key={source.id} caption={source.label} icon="library_books" href={source.url} />
        ))}
      </List>
    </div>
  )
}

Sources.propTypes = {
  sources: PropTypes.array.isRequired
}

Sources.translations = {
  en: { sources: 'Sources:' },
  fr: { sources: 'Sources:' }
}

export default Sources
