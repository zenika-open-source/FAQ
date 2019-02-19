import React, { useState, useEffect } from 'react'

import routing from 'services/routing'

export const ConfigurationContext = React.createContext()

const ConfigurationProvider = ({ children }) => {
  const [reload, setReload] = useState(0)
  const [configuration, setConfiguration] = useState({
    loading: true,
    reload: () => setReload(state => state + 1)
  })

  useEffect(() => {
    if (localStorage.configuration) {
      setConfiguration(conf => ({
        ...conf,
        loading: false,
        ...JSON.parse(localStorage.configuration)
      }))
    }

    fetch(process.env.REACT_APP_GRAPHQL_ENDPOINT + '/configuration', {
      headers: { 'prisma-service': routing.getPrismaService() }
    })
      .then(response => {
        if (!response.ok)
          throw new Error(
            `Error response from server while retrieving configuration: HTTP status ${
              response.status
            }`
          )
        return response.json()
      })
      .then(conf => {
        localStorage.configuration = JSON.stringify(conf)
        setConfiguration(state => ({ ...state, loading: false, ...conf }))
      })

    return () => setConfiguration(state => ({ ...state, loading: false }))
  }, [reload])

  return (
    <ConfigurationContext.Provider value={configuration}>{children}</ConfigurationContext.Provider>
  )
}

export default ConfigurationProvider
