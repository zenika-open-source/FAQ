import { useContext } from 'react'

import { AuthContext } from './AuthProvider'

export const useAuth = () => {
  const [auth, actions] = useContext(AuthContext)

  const isAuth = !!(auth.session && auth.session.expiresAt > new Date().getTime() && auth.user)
  const wasAuth = !!(auth.session && auth.session.expiresAt < new Date().getTime() && auth.user)
  const isAdmin = isAuth && auth.user && auth.user.admin
  const isSpecialist = isAuth && auth.user && (auth.user.specialties?.length > 0 ?? false)

  return { ready: auth.ready, isAuth, wasAuth, isAdmin, isSpecialist, ...actions }
}
