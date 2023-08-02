import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

import './Input.css'

class Input extends Component {
  constructor(props) {
    super(props)

    this.input = React.createRef()
  }

  render() {
    const { className, value, limit, icon, style, onClear, small, ...otherProps } = this.props
    return (
      <div
        className={cn('input', className, { small })}
        style={style}
        onClick={() => this.input.current && this.input.current.focus()}
      >
        {icon && (
          <span className="input-icon">
            {typeof icon === 'string' ? <i className="material-icons">{icon}</i> : <i>{icon}</i>}
          </span>
        )}
        <input type="text" value={value} maxLength={limit} ref={this.input} {...otherProps} />
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
      </div>
    )
  }
}

Input.propTypes = {
  className: PropTypes.string,
  value: PropTypes.string.isRequired,
  limit: PropTypes.number,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  style: PropTypes.object,
  autoFocus: PropTypes.bool,
  onClear: PropTypes.func,
  small: PropTypes.bool,
}

export default Input
