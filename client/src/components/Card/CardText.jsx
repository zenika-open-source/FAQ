import cn from 'classnames'
import PropTypes from 'prop-types'

const CardText = ({ children, collapsed, className, ...otherProps }) => (
  <div
    className={cn(
      'p-4 bg-secondary-light text-secondary-font max-[480px]:p-[0.4rem] card-text',
      { collapsed },
      className,
    )}
    {...otherProps}
  >
    {children}
  </div>
)

CardText.propTypes = {
  children: PropTypes.node.isRequired,
  collapsed: PropTypes.bool,
  className: PropTypes.string,
}

export default CardText
