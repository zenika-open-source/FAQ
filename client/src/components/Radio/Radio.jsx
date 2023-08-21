import React, { useContext } from 'react'
import cn from 'classnames'

const RadioContext = React.createContext()

const Radio = ({ label, value, disabled, className, ...props }) => {
  const { name, selected, onChange, disabled: groupDisabled } = useContext(RadioContext)

  return (
    <div
      className={cn(
        `inline-flex items-center cursor-pointer mt-2 first:mt-0 ${disabled ? 'opacity-70' : ''}`,
        className,
      )}
      {...props}
    >
      <input
        className="accent-primary"
        type="radio"
        checked={value === selected}
        onChange={() => onChange(value)}
        id={`radio-${name}-${value}`}
        disabled={disabled || groupDisabled}
      />
      <label className="ml-6 cursor-pointer" htmlFor={`radio-${name}-${value}`}>
        {label}
      </label>
    </div>
  )
}

Radio.Group = function RadioGroup({
  name,
  selected,
  onChange,
  disabled,
  className,
  children,
  ...props
}) {
  return (
    <RadioContext.Provider value={{ name, selected, onChange, disabled }}>
      <div className={cn('inline-flex flex-col', className)} {...props}>
        {children}
      </div>
    </RadioContext.Provider>
  )
}

export default Radio
