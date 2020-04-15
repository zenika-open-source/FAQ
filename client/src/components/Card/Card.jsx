import React from 'react'
import cn from 'classnames'

import './Card.css'

const Card = ({ children, className, ...otherProps }) => (
  <div className={cn('card', className)} {...otherProps}>
    {children}
  </div>
)

export default Card
