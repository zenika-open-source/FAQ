import React from 'react'
import { Query } from 'react-apollo'

import { useAuth } from '../Auth'

import { me } from './queries'

export const UserContext = React.createContext()

const UserProvider = ({ children }) => {
  const [, { isAuth }] = useAuth()

  return (
    <Query query={me} skip={!isAuth}>
      {({ data }) => (
        <UserContext.Provider value={isAuth && data && data.me}>{children}</UserContext.Provider>
      )}
    </Query>
  )
}

export default UserProvider
