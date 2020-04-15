import React, { useEffect, useContext } from 'react'
import cn from 'classnames'
import { Route } from 'react-router-dom'

import { TabsContext } from './Tabs'

const Tab = ({ path, label, children, className, ...rest }) => {
  const [basePath, register] = useContext(TabsContext)

  useEffect(() => {
    register({ label, path })
  }, [label, path, register])

  return (
    <Route
      path={`${basePath}/${path}`}
      exact
      render={() => (
        <div className={cn('tab', className)} {...rest}>
          {children}
        </div>
      )}
    />
  )
}

export default Tab
