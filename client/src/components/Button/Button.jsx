import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

import './Button.css'
import { Link } from 'react-router-dom'

class Button extends Component {
  render() {
    const {
      className,
      icon,
      label,
      children,
      primary,
      secondary,
      link,
      round,
      active,
      raised,
      fixed,
      loading,
      small,
      path,
      ...otherProps
    } = this.props

    const b2s = b => (b ? 'true' : 'false')

    const buttonModifiers = [
      'primary',
      'secondary',
      'link',
      'round',
      'active',
      'raised',
      'fixed',
      'small'
    ].reduce((acc, m) => {
      this.props[m] && (acc[m] = b2s(this.props[m]))
      return acc
    }, {})

    if (loading) {
      buttonModifiers['disabled'] = true
    }

    const render = (
      <button className={cn('btn', className)} {...buttonModifiers} {...otherProps}>
        {loading ? (
          <span>
            <i className="fas fa-spinner fa-spin" />
          </span>
        ) : (
          <>
            {icon && <i className="material-icons">{icon}</i>}
            {label && <span>{label}</span>}
            {children && <span>{children}</span>}
          </>
        )}
      </button>
    )

    if (path) {
      return <Link to={path}>{render}</Link>
    }

    return render
  }
}

Button.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.string,
  label: PropTypes.node,
  children: PropTypes.node,
  primary: PropTypes.bool,
  secondary: PropTypes.bool,
  link: PropTypes.bool,
  round: PropTypes.bool,
  active: PropTypes.bool,
  raised: PropTypes.bool,
  disabled: PropTypes.bool,
  fixed: PropTypes.bool
}

export default Button
