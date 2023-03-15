import React, { useState, useEffect, useMemo } from 'react'

import { safeFetch } from '@helpers'

export const ConfigurationContext = React.createContext()

const ConfigurationProvider = ({ children }) => {
  const [reload, setReload] = useState(0)
  const [configuration, setConfiguration] = useState(() => {
    // Retrieve cached configuration in local storage
    if (localStorage.configuration) {
      return {
        ...JSON.parse(localStorage.configuration),
        loading: false
      }
    }
    return {
      loading: true
    }
  })

  // Retrieve configuration from server
  useEffect(() => {
    safeFetch('configuration').then(conf => {
      localStorage.configuration = JSON.stringify(conf)
      setConfiguration({ ...conf, loading: false })
    })
  }, [reload])

  // Provide reload function when editing configuration
  const value = useMemo(() => ({ ...configuration, reload: () => setReload(state => state + 1) }), [
    configuration
  ])

  return <ConfigurationContext.Provider value={value}>{children}</ConfigurationContext.Provider>
}

export default ConfigurationProvider
