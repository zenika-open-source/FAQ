import PropTypes from 'prop-types'

import './List.css'

const List = ({ children, title, ...otherProps }) => (
  <div className="list" {...otherProps}>
    {title && <h3 className="text-secondary-font-light">{title}</h3>}
    <div className="p-[0.6rem] w-auto inline-flex">{children}</div>
  </div>
)

List.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.node,
}

export default List
