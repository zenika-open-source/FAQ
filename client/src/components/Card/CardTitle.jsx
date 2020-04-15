import React from 'react'
import cn from 'classnames'

const CardTitle = ({ children, className, style, onClick, ...otherProps }) => (
  <div
    className={cn('card-item card-title', className)}
    style={{ ...style, cursor: onClick ? 'pointer' : 'initial' }}
    onClick={onClick}
    {...otherProps}
  >
    {children}
  </div>
)

export default CardTitle
