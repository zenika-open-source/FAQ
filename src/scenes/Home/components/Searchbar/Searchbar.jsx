import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

import { Input, TagPicker } from 'components'

import './Searchbar.css'

const Searchbar = ({ text, tags, loading, onTextChange, onTagsChange }) => (
  <div className="searchbar">
    <Input
      icon={
        <>
          <span
            className={cn('icon', { hidden: loading && text !== '' })}
            onClick={() => this.input.focus()}
          >
            <i className="material-icons">search</i>
          </span>
          <span className={cn('icon', { hidden: !(loading && text !== '') })}>
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
        label="Filter by tags:"
        icon="local_offer"
        tags={tags}
        onChange={onTagsChange}
      />
    </div>
  </div>
)

Searchbar.propTypes = {
  text: PropTypes.string,
  tags: PropTypes.array,
  loading: PropTypes.bool,
  onTextChange: PropTypes.func,
  onTagsChange: PropTypes.func
}

export default Searchbar
