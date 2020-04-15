import React from 'react'
import cn from 'classnames'

import { Input, TagPicker } from 'components'
import { useIntl, useConfiguration } from 'services'

import './Searchbar.css'

const Searchbar = ({ text, onTextChange, tags, onTagsChange, loading }) => {
  const intl = useIntl(Searchbar)
  const conf = useConfiguration()

  const tagLabels = tags
    .map(tag =>
      conf.tagCategories
        .reduce((acc, cat) => acc.concat(cat.labels), [])
        .find(label => label.name === tag)
    )
    .filter(l => l)

  return (
    <div className="searchbar">
      <Input
        icon={
          <>
            <span className={cn('icon', { hidden: loading })}>
              <i className="material-icons">search</i>
            </span>
            <span className={cn('icon', { hidden: !loading })}>
              <i className="fas fa-spinner fa-pulse" />
            </span>
          </>
        }
        value={text}
        onChange={e => onTextChange(e.target.value)}
        onClear={() => onTextChange('')}
      />
      <div className="filters">
        <TagPicker
          label={intl('filter.tags')}
          icon="local_offer"
          tags={tagLabels}
          onChange={labels => onTagsChange(labels.map(l => l.name))}
        />
      </div>
    </div>
  )
}

Searchbar.translations = {
  en: {
    filter: {
      tags: 'Filter by tags:'
    }
  },
  fr: {
    filter: {
      tags: 'Filter par tags:'
    }
  }
}

export default Searchbar
