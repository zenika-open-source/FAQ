import React from 'react'
import cn from 'classnames'

const CardText = ({ children, collapsed, className, ...otherProps }) => (
  <div className={cn('card-item card-text', { collapsed }, className)} {...otherProps}>
    {children}
  </div>
)

export default CardText
