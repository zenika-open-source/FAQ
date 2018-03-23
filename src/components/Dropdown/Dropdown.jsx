import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

import './Dropdown.css'

const Dropdown = ({ className, button, children }) => (
  <div className={cn('dropdown', className)}>
    <div className="dropbtn">{button}</div>
    <div className="dropdown-content">{children}</div>
  </div>
)

Dropdown.propTypes = {
  className: PropTypes.string,
  button: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired
}

export default Dropdown
