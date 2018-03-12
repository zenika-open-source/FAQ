import React from 'react'
import PropTypes from 'prop-types'
import { List, ListItem, ListSubHeader } from 'react-toolbox/lib/list'

const Sources = props => {
  const { sources } = props.node.answer

  return (
    <List selectable>
      <ListSubHeader caption="Sources:" />
      {sources.map(source => (
        <ListItem
          key={source.id}
          caption={source.label}
          leftIcon="library_books"
          onClick={() => window.open(source.url, '_blank')}
        />
      ))}
    </List>
  )
}

Sources.propTypes = {
  node: PropTypes.object.isRequired
}

export default Sources
