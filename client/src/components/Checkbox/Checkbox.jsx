import React from 'react'
import cn from 'classnames'

import './Checkbox.scss'

const Checkbox = ({ label, checked, onChange, disabled, ...props }) => (
  <label className={cn('checkbox', { disabled })} {...props}>
    <span>{label}</span>
    <input type="checkbox" checked={checked} onChange={onChange} disabled={disabled} />
    <span className="checkmark" />
  </label>
)

export default Checkbox
