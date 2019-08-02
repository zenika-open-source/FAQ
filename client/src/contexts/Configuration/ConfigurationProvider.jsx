import React, { useState, useEffect, useMemo } from 'react'

import routing from 'services/routing'

export const ConfigurationContext = React.createContext()

const ConfigurationProvider = ({ children }) => {
  const [reload, setReload] = useState(0)
  const [configuration, setConfiguration] = useState({
    loading: true
  })

  // Retrieve cached configuration in local storage
  useEffect(() => {
    if (localStorage.configuration) {
      setConfiguration({
        ...JSON.parse(localStorage.configuration),
        loading: false
      })
    }
  }, [])

  // Retrieve configuration from server
  useEffect(() => {
    fetch(process.env.REACT_APP_REST_ENDPOINT + '/configuration', {
      headers: { 'prisma-service': routing.getPrismaService() }
    })
      .then(response => {
        if (!response.ok)
          throw new Error(
            `Error response from server while retrieving configuration: HTTP status ${response.status}`
          )
        return response.json()
      })
      .then(conf => {
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
