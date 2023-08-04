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
        className={cn('relative', className)}
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
      >
        <div className="cursor-pointer">{button}</div>
        <div
          className={`absolute bg-secondary-light min-w-[160px] z-10 right-0 shadow-[0_8px_16px_0_rgb(0,0,0,0.2)]
            ${active ? 'flex flex-col' : 'hidden'}`}
        >
          {children}
        </div>
      </div>
    </DropdownContext.Provider>
  )
}

Dropdown.propTypes = {
  className: PropTypes.string,
  button: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
}

export default Dropdown
