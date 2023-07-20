
import PropTypes from 'prop-types'

import './List.css'

const List = ({ children, title, ...otherProps }) => (
  <div className="list" {...otherProps}>
    {title && <h3 style={{ color: 'var(--secondary-color-font-light)' }}>{title}</h3>}
    <div className="list-items">{children}</div>
  </div>
)

List.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.node
}

export default List
