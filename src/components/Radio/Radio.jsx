import React, { useContext } from 'react'
import cn from 'classnames'

import './Radio.scss'

const RadioContext = React.createContext()

const Radio = ({ label, value, disabled, className, ...props }) => {
  const { name, selected, onChange, disabled: groupDisabled } = useContext(RadioContext)

  return (
    <div className={cn('radio', { disabled: disabled || groupDisabled }, className)} {...props}>
      <input
        type="radio"
        checked={value === selected}
        onChange={() => onChange(value)}
        id={`radio-${name}-${value}`}
        disabled={disabled || groupDisabled}
      />
      <div className="radio-input" />
      <label htmlFor={`radio-${name}-${value}`}>{label}</label>
    </div>
  )
}

Radio.Group = ({ name, selected, onChange, disabled, className, children, ...props }) => (
  <RadioContext.Provider value={{ name, selected, onChange, disabled }}>
    <div className={cn('radio-group', className)} {...props}>
      {children}
    </div>
  </RadioContext.Provider>
)

export default Radio
