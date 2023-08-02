import React, { useState, useMemo } from 'react'
import cn from 'classnames'

import './Tabs.scss'

export const TabsContext = React.createContext()

const Tabs = ({ children, className, ...rest }) => {
  const [current, setCurrent] = useState(null)
  const [tabs, setTabs] = useState([])

  const register = useMemo(
    () => (tab) => {
      setTabs((tabs) => [...tabs, tab])
    },
    [setTabs],
  )

  const active = current || tabs[0]

  const value = useMemo(() => [active, register], [active, register])

  return (
    <TabsContext.Provider value={value}>
      <div className={cn('tabs', className)}>
        <div className="tabs-list">
          <ul>
            {tabs.map((label) => (
              <li
                key={label}
                onClick={() => setCurrent(label)}
                className={cn({ 'is-active': label === active })}
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
