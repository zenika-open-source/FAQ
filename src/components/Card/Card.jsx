import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

import CardTitle from './CardTitle'
import CardText from './CardText'
import CardActions from './CardActions'

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

Card.Title = CardTitle
Card.Text = CardText
Card.Actions = CardActions

export default Card
