import React, { useContext } from 'react'

import { TabsContext } from './Tabs'

const Tab = ({ id, children }) => {
  const current = useContext(TabsContext)

  if (id !== current) return null

  return <div className="tab">{children}</div>
}

export default Tab
