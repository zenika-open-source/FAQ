import React, { useMemo } from 'react'
import { useQuery } from '@apollo/react-hooks'

import { useAuth } from '../Auth'

import { GET_ME } from './queries'

export const UserContext = React.createContext()

const UserProvider = ({ children }) => {
  const { isAuth } = useAuth()

  const { data } = useQuery(GET_ME, { skip: !isAuth })

  const value = useMemo(() => isAuth && data && data.me, [isAuth, data])

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export default UserProvider
