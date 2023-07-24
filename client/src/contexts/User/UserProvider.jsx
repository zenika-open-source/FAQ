import { useQuery } from '@apollo/client'
import React, { useMemo } from 'react'

import { useAuth } from '../Auth'

import { GET_ME } from './queries'

export const UserContext = React.createContext({})

const UserProvider = ({ children }) => {
  const { isAuth } = useAuth()

  const { data } = useQuery(GET_ME, {
    skip: !isAuth && import.meta.env.VITE_DISABLE_AUTH !== 'true',
  })

  const value = useMemo(() => data && data.me, [data])

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export default UserProvider
