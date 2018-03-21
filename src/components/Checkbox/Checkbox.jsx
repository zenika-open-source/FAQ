import React from 'react'
import PropTypes from 'prop-types'

import './Checkbox.css'

const Checkbox = ({ label, checked, onChange }) => (
  <label className="checkbox">
    <span>{label}</span>
    <input type="checkbox" checked={checked} onChange={onChange} />
    <span className="checkmark" />
  </label>
)

Checkbox.propTypes = {
  label: PropTypes.node.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired
}

export default Checkbox
