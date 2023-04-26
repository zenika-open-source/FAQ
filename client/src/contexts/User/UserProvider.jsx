import { useQuery } from '@apollo/react-hooks'
import React, { useMemo } from 'react'

import { useAuth } from '../Auth'

import { GET_ME } from './queries'

export const UserContext = React.createContext({})

const UserProvider = ({ children }) => {
  const { isAuth } = useAuth()

  const { data } = useQuery(GET_ME, {
    skip: !isAuth && process.env.REACT_APP_DISABLE_AUTH !== 'true'
  })

  const value = useMemo(() => data && data.me, [isAuth, data])

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export default UserProvider
