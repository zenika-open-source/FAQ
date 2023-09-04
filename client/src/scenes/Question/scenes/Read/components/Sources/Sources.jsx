import PropTypes from 'prop-types'

import { getIntl } from 'services'

import List, { ListItem } from 'components/List'

const Sources = ({ sources }) => {
  const intl = getIntl(Sources)

  if (sources.length === 0) return ''

  return (
    <div className="border-t border-t-secondary">
      <h3 className="text-primary m-3 mb-0">{intl('sources')}</h3>
      <List className="text-sm text-secondary-font-light">
        {sources.map((source) => (
          <ListItem key={source.id} caption={source.label} icon="library_books" href={source.url} />
        ))}
      </List>
    </div>
  )
}

Sources.propTypes = {
  sources: PropTypes.array.isRequired,
}

Sources.translations = {
  en: { sources: 'Sources:' },
  fr: { sources: 'Sources:' },
}

export default Sources
