
import PropTypes from 'prop-types'

const CardTitle = ({ children, style, onClick, ...otherProps }) => (
  <div
    className="card-item card-title"
    style={{ ...style, cursor: onClick ? 'pointer' : 'initial' }}
    onClick={onClick}
    {...otherProps}
  >
    {children}
  </div>
)

CardTitle.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.object,
  onClick: PropTypes.func
}

export default CardTitle
