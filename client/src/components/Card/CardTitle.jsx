import PropTypes from 'prop-types'
import cn from 'classnames'

const CardTitle = ({ children, className, onClick, ...otherProps }) => (
  <div
    className={cn(
      `bg-secondary-light text-secondary-font p-[0.7rem] relative flex items-center break-words shadow-[0px_3px_4px] shadow-secondary ${
        onClick ? 'cursor-pointer' : 'cursor-default'
      }`,
      className,
    )}
    onClick={onClick}
    {...otherProps}
  >
    {children}
  </div>
)

CardTitle.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.object,
  onClick: PropTypes.func,
}

export default CardTitle
