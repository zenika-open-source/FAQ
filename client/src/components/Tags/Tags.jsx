import React from 'react'
import PropTypes from 'prop-types'

import './Tags.css'

const Tags = props => {
  const { tags, ...otherProps } = props

  return (
    <div className="tags" {...otherProps}>
      <i className="material-icons">local_offer</i>
      <div className="tags-list">{tags.map(tag => tag.label).join(', ')}</div>
    </div>
  )
}

Tags.propTypes = {
  tags: PropTypes.array.isRequired
}

export default Tags
