import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

import './Button.css'

const Button = ({
  className,
  icon,
  label,
  children,
  onClick,
  style,
  ...modifiers
}) => {
  const b2s = b => (b ? 'true' : 'false')

  const buttonModifiers = [
    'primary',
    'secondary',
    'link',
    'round',
    'active',
    'raised',
    'disabled',
    'fixed'
  ].reduce((acc, m) => {
    modifiers[m] && (acc[m] = b2s(modifiers[m]))
    return acc
  }, {})

  return (
    <button
      className={cn('btn', className)}
      {...buttonModifiers}
      onClick={onClick}
      style={style}
    >
      {icon && <i className="material-icons">{icon}</i>}
      {label && <span>{label}</span>}
      {children && <span>{children}</span>}
    </button>
  )
}

Button.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.string,
  label: PropTypes.node,
  children: PropTypes.node,
  onClick: PropTypes.func,
  style: PropTypes.object
}

export default Button
