import React from 'react'
import { Query } from 'react-apollo'

import { isAuthenticated } from '../Auth'

import { me } from './queries'

export const UserContext = React.createContext()

const UserProvider = ({ children }) => {
  const isAuth = isAuthenticated()

  return (
    <Query query={me} skip={!isAuth}>
      {({ data }) => (
        <UserContext.Provider value={isAuth && data && data.me}>{children}</UserContext.Provider>
      )}
    </Query>
  )
}

export default UserProvider
