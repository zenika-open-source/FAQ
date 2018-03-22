import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

import './Input.css'

class Input extends Component {
  componentDidMount () {
    if (this.props.autoFocus) {
      const input = this.input
      const length = input.value.length
      input.focus()
      input.setSelectionRange(length, length)
    }
  }

  render () {
    const { className, value, limit, icon, style, ...otherProps } = this.props
    return (
      <div
        className={cn('input', className)}
        style={style}
        onClick={() => this.input.focus()}
      >
        {icon && (
          <span className="input-icon">
            {typeof icon === 'string' ? (
              <i className="material-icons">{icon}</i>
            ) : (
              <i>{icon}</i>
            )}
          </span>
        )}
        <input
          type="text"
          value={value}
          maxLength={limit}
          {...otherProps}
          ref={ref => (this.input = ref)}
        />
        {limit && (
          <i className="limit">
            {value ? value.length : 0}/{limit}
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
  autoFocus: PropTypes.bool
}

export default Input
