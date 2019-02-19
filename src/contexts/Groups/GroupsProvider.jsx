import React, { useState } from 'react'
import { Query } from 'react-apollo'

import { isAuthenticated } from '../Auth'

import { groups as groupsQuery } from './queries'

export const GroupsContext = React.createContext()

const GroupsProvider = ({ children }) => {
  const isAuth = isAuthenticated()

  const [groups, setGroups] = useState(null)

  return (
    <>
      {isAuth && (
        <Query query={groupsQuery}>
          {({ data }) => {
            if (data && data.groups && data.groups !== groups) setGroups(data.groups)
            return null
          }}
        </Query>
      )}
      <GroupsContext.Provider value={isAuth && groups}>{children}</GroupsContext.Provider>
    </>
  )
}

export default GroupsProvider
