import { useContext } from 'react'

import { AuthContext } from './AuthProvider'

export const useAuth = () => {
  return useContext(AuthContext)
}

export const isAuthenticated = () => {
  const auth = useAuth()

  return auth.session && auth.session.expiresAt > new Date().getTime() && auth.user && true
}

export const wasAuthenticated = () => {
  const auth = useAuth()

  return auth.session && auth.session.expiresAt < new Date().getTime() && auth.user && true
}

export const isAdmin = () => {
  const auth = useAuth()
  const isAuth = isAuthenticated()

  return isAuth && auth.user && auth.user.admin
}
