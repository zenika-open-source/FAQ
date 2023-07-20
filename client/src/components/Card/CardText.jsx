import cn from 'classnames'
import PropTypes from 'prop-types'

const CardText = ({ children, collapsed, className, ...otherProps }) => (
  <div className={cn('card-item card-text', { collapsed }, className)} {...otherProps}>
    {children}
  </div>
)

CardText.propTypes = {
  children: PropTypes.node.isRequired,
  collapsed: PropTypes.bool,
  className: PropTypes.string
}

export default CardText
