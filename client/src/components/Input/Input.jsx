import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

class Input extends Component {
  constructor(props) {
    super(props)

    this.input = React.createRef()
  }

  render() {
    const { className, value, limit, icon, style, onClear, small, ...otherProps } = this.props
    return (
      <div
        className={cn(
          'group/input border border-secondary bg-secondary-light p-px pl-2 flex items-center hover:border-[#b9b9b9] hover:border-l-[#a0a0a0] focus-within:!border-primary',
          className,
          { small },
        )}
        style={style}
        onClick={() => this.input.current && this.input.current.focus()}
      >
        {icon && (
          <span className="input-icon flex items-center text-secondary-dark">
            <i
              className={
                typeof icon === 'string'
                  ? 'material-icons w-[18px] mx-1 group-focus-within/input:text-primary'
                  : 'w-[18px] mx-1 group-focus-within/input:text-primary'
              }
            >
              {icon}
            </i>
          </span>
        )}
        <input
          className="group-focus-within/input:placeholder:text-transparent outline-none border-0 flex-1 ml-1 h-11 ldaing-11 text-primary-font-dark"
          type="text"
          value={value}
          maxLength={limit}
          ref={this.input}
          {...otherProps}
        />
        {limit && (
          <i className="text-xs text-secondary-dark">
            {value ? value.length : 0}/{limit}
          </i>
        )}
        {onClear && value.length > 0 && (
          <i className="text-primary-light cursor-pointer material-icons" onClick={onClear}>
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
