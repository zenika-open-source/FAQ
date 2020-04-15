import React, { useState, useCallback, useMemo } from 'react'
import cn from 'classnames'
import { NavLink, Route, Redirect } from 'react-router-dom'

import './Tabs.scss'

export const TabsContext = React.createContext()

const Tabs = ({ children, className, path: basePath, ...rest }) => {
  const [tabs, setTabs] = useState([])

  const register = useCallback(tab => {
    setTabs(tabs => [...tabs, tab])
  }, [])

  const value = useMemo(() => [basePath, register], [basePath, register])

  return (
    <TabsContext.Provider value={value}>
      <div className={cn('tabs', className)} {...rest}>
        <div className="tabs-list">
          <ul>
            {tabs.map(({ label, path }) => (
              <NavLink to={`${basePath}/${path}`} key={path}>
                <li>
                  <span>{label}</span>
                </li>
              </NavLink>
            ))}
          </ul>
        </div>
        <div className="tabs-items">
          {children}
          <Route
            path={basePath}
            exact
            render={() => tabs.length > 0 && <Redirect to={`${basePath}/${tabs[0].path}`} />}
          />
        </div>
      </div>
    </TabsContext.Provider>
  )
}

export default Tabs
