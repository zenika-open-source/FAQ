import React from 'react'
import cn from 'classnames'

const CardAction = ({ children, className, ...otherProps }) => (
  <div className={cn('card-item card-actions', className)} {...otherProps}>
    {children}
  </div>
)

export default CardAction
