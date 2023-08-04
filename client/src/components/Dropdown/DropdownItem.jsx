import PropTypes from 'prop-types'
import { useContext } from 'react'
import { Link } from 'react-router-dom'

import { DropdownContext } from './Dropdown'

const DropdownItem = ({
  children,
  icon,
  rightIcon,
  path,
  href,
  target,
  onClick,
  ...otherProps
}) => {
  const setDropdownActive = useContext(DropdownContext)

  let CustomLink

  if (path) {
    CustomLink = function CustomLinkWithRouter({ children }) {
      return (
        <Link
          to={path}
          onClick={(evt) => {
            if (onClick) onClick(evt)
            setDropdownActive(false)
          }}
          className="text-secondary-font-dark px-4 py-3 flex items-center justify-between cursor-pointer no-underline hover:bg-secondary"
        >
          {children}
        </Link>
      )
    }
  } else {
    CustomLink = function CustomLinkWithHref({ children }) {
      return (
        <a
          tabIndex={0}
          href={href}
          target={target || '_self'}
          onClick={(evt) => {
            if (onClick) onClick(evt)
            setDropdownActive(false)
          }}
          className="text-secondary-font-dark px-4 py-3 flex items-center justify-between cursor-pointer no-underline hover:bg-secondary"
          {...otherProps}
        >
          {children}
        </a>
      )
    }
  }

  return (
    <CustomLink>
      <span className="flex items-center">
        {icon && (
          <i
            className={
              typeof icon === 'string' ? 'material-icons mr-2 inline-flex' : 'mr-2 inline-flex'
            }
          >
            {icon}
          </i>
        )}
        {children}
      </span>
      <span className="flex items-center">
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
  target: PropTypes.string,
  onClick: PropTypes.func,
}

export default DropdownItem
