import { useContext } from 'react'

import { UserContext } from './UserProvider'

export const useUser = () => useContext(UserContext)
