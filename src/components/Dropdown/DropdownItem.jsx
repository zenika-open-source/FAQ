import React from 'react'
import PropTypes from 'prop-types'

const DropdownItem = ({ children, icon, disabled, onClick, ...otherProps }) => (
  <a
    tabIndex={disabled ? null : 0}
    onMouseDown={e => {
      if (disabled) return
      if (onClick) return onClick()
    }}
    disabled={disabled}
    {...otherProps}
  >
    {icon &&
      (typeof icon === 'string' ? (
        <i className="material-icons">{icon}</i>
      ) : (
        <i>{icon}</i>
      ))}
    {children}
  </a>
)

DropdownItem.propTypes = {
  children: PropTypes.node.isRequired,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  disabled: PropTypes.bool,
  onClick: PropTypes.func
}

export default DropdownItem
