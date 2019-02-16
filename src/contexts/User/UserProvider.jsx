import React, { useState } from 'react'
import { Query } from 'react-apollo'

import { isAuthenticated } from '../Auth'

import { me } from './queries'

export const UserContext = React.createContext()

const UserProvider = ({ children }) => {
  const isAuth = isAuthenticated()

  const [user, setUser] = useState(null)

  return (
    <>
      {isAuth && (
        <Query query={me}>
          {({ data }) => {
            if (data && data.me && data.me !== user) setUser(data.me)
            return null
          }}
        </Query>
      )}
      <UserContext.Provider value={user}>{children}</UserContext.Provider>
    </>
  )
}

export default UserProvider
