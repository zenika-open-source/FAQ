
import PropTypes from 'prop-types'
import cn from 'classnames'

import './Checkbox.scss'

const Checkbox = ({ label, checked, onChange, disabled, ...props }) => (
  <label className={cn('checkbox', { disabled })} {...props}>
    <span>{label}</span>
    <input type="checkbox" checked={checked} onChange={onChange} disabled={disabled} />
    <span className="checkmark" />
  </label>
)

Checkbox.propTypes = {
  label: PropTypes.node.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool
}

export default Checkbox
