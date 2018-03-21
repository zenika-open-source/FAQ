import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

const CardText = ({ children, collapsed, ...otherProps }) => (
  <div className={cn('card-item card-text', { collapsed })} {...otherProps}>
    {children}
  </div>
)

CardText.propTypes = {
  children: PropTypes.node.isRequired,
  collapsed: PropTypes.bool
}

export default CardText
