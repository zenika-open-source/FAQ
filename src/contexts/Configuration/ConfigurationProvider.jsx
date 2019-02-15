import React, { useState, useEffect } from 'react'

import routing from 'services/routing'

export const ConfigurationContext = React.createContext()

const ConfigurationProvider = ({ children }) => {
  const [configuration, setConfiguration] = useState({ loading: true })

  useEffect(() => {
    if (localStorage.configuration) {
      setConfiguration({ loading: false, ...JSON.parse(localStorage.configuration) })
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
        if (configuration.loading) {
          setConfiguration({ loading: false, ...conf })
        }
      })

    return () => setConfiguration(state => ({ loading: false, ...state }))
  }, [])

  return (
    <ConfigurationContext.Provider value={configuration}>{children}</ConfigurationContext.Provider>
  )
}

export default ConfigurationProvider
