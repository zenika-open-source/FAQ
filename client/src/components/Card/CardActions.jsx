import React from 'react'
import PropTypes from 'prop-types'

const CardAction = ({ children, ...otherProps }) => (
  <div className="card-item card-actions" {...otherProps}>
    {children}
  </div>
)

CardAction.propTypes = {
  children: PropTypes.node.isRequired
}

export default CardAction
