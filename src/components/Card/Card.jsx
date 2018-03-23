import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

import './Card.css'

const Card = ({ children, className, ...otherProps }) => (
  <div className={cn(className, 'card')} {...otherProps}>
    {children}
  </div>
)

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
}

export default Card
