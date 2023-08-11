import cn from 'classnames'
import PropTypes from 'prop-types'

import CardActions from './CardActions'
import CardText from './CardText'
import CardTitle from './CardTitle'

const Card = ({ children, className, ...otherProps }) => (
  <div
    className={cn(className, 'w-full relative mt-4 border border-secondary rounded-sm')}
    {...otherProps}
  >
    {children}
  </div>
)

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
}

Card.Title = CardTitle
Card.Text = CardText
Card.Actions = CardActions

export default Card
