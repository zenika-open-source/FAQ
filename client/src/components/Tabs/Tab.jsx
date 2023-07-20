import cn from 'classnames'
import { useContext, useEffect } from 'react'

import { TabsContext } from './Tabs'

const Tab = ({ label, children, className, ...rest }) => {
  const [current, register] = useContext(TabsContext)

  useEffect(() => {
    register(label)
  }, [label, register])

  return (
    <div className={cn('tab', className, { 'is-active': label === current })} {...rest}>
      {children}
    </div>
  )
}

export default Tab
