import React, { useState } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

import './Dropdown.scss'

export const DropdownContext = React.createContext()

const Dropdown = ({ className, button, children }) => {
  const [active, setActive] = useState(false)

  return (
    <DropdownContext.Provider value={setActive}>
      <div
        className={cn('dropdown', className)}
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
      >
        <div className="dropbtn">{button}</div>
        <div className={cn('dropdown-content', { active })}>{children}</div>
      </div>
    </DropdownContext.Provider>
  )
}

Dropdown.propTypes = {
  className: PropTypes.string,
  button: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired
}

export default Dropdown
