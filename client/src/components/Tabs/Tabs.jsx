import React, { useState, useMemo } from 'react'
import cn from 'classnames'

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
      <div className={className}>
        <div className="flex items-stretch text-base justify-between overflow-hidden overflow-x-auto whitespace-nowrap">
          <ul className="flex flex-grow flex-shrink-0 justify-center items-center border-b border-b-[#dbdbdb] m-0">
            {tabs.map((label) => (
              <li
                key={label}
                onClick={() => setCurrent(label)}
                className={cn('block', {
                  '[&_span]:bg-primary-font [&_span]:border-[#dbdbdb] [&_span]:border-b-secondary-light [&_span]:text-primary':
                    label === active,
                })}
              >
                <span className="cursor-pointer flex items-center justify-center -mb-px px-4 py-2 align-top border border-transparent rounded-tl-4 rounded-tr-4 hover:text-[#363636] hover:bg-[#f5f5f5] hover:border-b-secondary-light">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div>{children}</div>
      </div>
    </TabsContext.Provider>
  )
}

export default Tabs
