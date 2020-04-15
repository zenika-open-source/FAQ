import React from 'react'
import cn from 'classnames'

import './Input.css'

const Input = ({
  value,
  limit,
  icon,
  className,
  style,
  small,
  disabled,
  onClear,
  ...otherProps
}) => (
  <label className={cn('input', className, { small, disabled })} style={style}>
    {icon && (
      <span className="input-icon">
        {typeof icon === 'string' ? <i className="material-icons">{icon}</i> : <i>{icon}</i>}
      </span>
    )}
    <input type="text" value={value} maxLength={limit} disabled={disabled} {...otherProps} />
    {limit && (
      <i className="limit">
        {value ? value.length : 0}/{limit}
      </i>
    )}
    {onClear && value.length > 0 && (
      <i className="close material-icons" onClick={onClear}>
        close
      </i>
    )}
  </label>
)

export default Input
