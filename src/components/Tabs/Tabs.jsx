import React, { useState } from 'react'
import cn from 'classnames'

import './Tabs.scss'

export const TabsContext = React.createContext()

const Tabs = ({ labels, children, className }) => {
  const first = Object.keys(labels)[0]

  const state = useState(first)
  const [current, setCurrent] = state

  return (
    <TabsContext.Provider value={state}>
      <div className={cn('tabs', className)}>
        <div className="tabs-list">
          <ul>
            {Object.entries(labels).map(([id, label]) => (
              <li
                key={id}
                onClick={() => setCurrent(id)}
                className={cn({ 'is-active': id === current })}
              >
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="tabs-items">{children}</div>
      </div>
    </TabsContext.Provider>
  )
}

export default Tabs
