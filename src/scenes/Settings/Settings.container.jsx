import React, { useState, useEffect } from 'react'
import { Query } from 'react-apollo'

import { Loading } from 'components'
import { alert } from 'services'

import { getConfiguration } from './queries'

import Settings from './Settings'

export default () => {
  const [err, setError] = useState(null)

  useEffect(() => {
    if (err) {
      alert.pushDefaultError(err)
    }
  }, [err])

  return (
    <Query query={getConfiguration}>
      {({ loading, data, error }) => {
        if (loading) return <Loading />
        if (error) {
          if (!err) setError(error)
          return null
        }
        return <Settings configuration={data.configuration} />
      }}
    </Query>
  )
}
