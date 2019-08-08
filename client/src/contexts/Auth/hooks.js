import { useContext } from 'react'

import { AuthContext } from './AuthProvider'

export const useAuth = () => {
  const auth = useContext(AuthContext)

  const isAuth = !!(auth.session && auth.session.expiresAt > new Date().getTime() && auth.user)
  const wasAuth = !!(auth.session && auth.session.expiresAt < new Date().getTime() && auth.user)
  const isAdmin = isAuth && auth.user && auth.user.admin

  return [auth, { isAuth, wasAuth, isAdmin }]
}
