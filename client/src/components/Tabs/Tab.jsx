import cn from 'classnames'
import { useContext, useEffect } from 'react'

import { TabsContext } from './Tabs'

const Tab = ({ label, children, className, ...rest }) => {
  const [current, register] = useContext(TabsContext)

  useEffect(() => {
    register(label)
  }, [label, register])

  return (
    <div
      className={cn(
        `p-4 border border-[#dbdbdb] border-t-0 ${label === current ? 'block' : 'hidden'}`,
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

export default Tab
