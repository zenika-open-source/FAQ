import { useContext } from 'react'

import { GroupsContext } from './GroupsProvider'
import { useUser } from '../User'

export const useGroups = () => useContext(GroupsContext)

export const useCurrentGroup = () => {
  const groups = useGroups()
  const user = useUser()
  return user && groups && groups.find(g => g.id === user.currentGroup.id)
}
