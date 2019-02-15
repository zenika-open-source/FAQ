import React, { useEffect } from 'react'

import { isAuthenticated } from '../Auth'

import { useTriggeredQuery } from 'services/apollo'

import { me } from './queries'

export const UserContext = React.createContext()

const UserProvider = ({ children }) => {
  const isAuth = isAuthenticated()

  const [{ data }, setReady] = useTriggeredQuery(me)

  useEffect(() => {
    if (isAuth) {
      setReady(true)
    }
  }, [isAuth])

  return <UserContext.Provider value={data && data.me}>{children}</UserContext.Provider>
}

export default UserProvider
