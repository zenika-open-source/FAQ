import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { DropdownContext } from './Dropdown'

const DropdownItem = ({ children, icon, rightIcon, path, href, target, ...otherProps }) => {
  const setDropdownActive = useContext(DropdownContext)

  let CustomLink

  if (path) {
    CustomLink = ({ children }) => (
      <Link to={path} onClick={() => setDropdownActive(false)}>
        {children}
      </Link>
    )
  } else {
    CustomLink = ({ children }) => (
      <a
        tabIndex={0}
        href={href}
        target={target || '_self'}
        onClick={() => setDropdownActive(false)}
        {...otherProps}
      >
        {children}
      </a>
    )
  }

  return (
    <CustomLink>
      <span className="left">
        {icon &&
          (typeof icon === 'string' ? <i className="material-icons">{icon}</i> : <i>{icon}</i>)}
        {children}
      </span>
      <span className="right">
        {rightIcon &&
          (typeof rightIcon === 'string' ? (
            <i className="material-icons">{rightIcon}</i>
          ) : (
            rightIcon
          ))}
      </span>
    </CustomLink>
  )
}

DropdownItem.propTypes = {
  children: PropTypes.node.isRequired,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  rightIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  path: PropTypes.string,
  href: PropTypes.string,
  target: PropTypes.string
}

export default DropdownItem
