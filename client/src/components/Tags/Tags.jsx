import React from 'react'
import PropTypes from 'prop-types'

import './Tags.css'

// TMP_TAGS

const Tags = ({ tags, ...rest }) => (
  <div className="tags" {...rest}>
    <i className="material-icons">local_offer</i>
    <div className="tags-list">{tags.map(tag => tag.tagLabel.name.toLowerCase()).join(', ')}</div>
  </div>
)

Tags.propTypes = {
  tags: PropTypes.array.isRequired
}

export default Tags
