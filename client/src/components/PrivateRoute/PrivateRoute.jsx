import React, { useEffect } from 'react'
import { Route, useHistory, useLocation } from 'react-router-dom'

import { useAuth, useUser } from 'services'

const PrivateRoute = ({ reverse, admin, ...props }) => {
  const user = useUser()
  const auth = useAuth()
  const history = useHistory()
  const location = useLocation()

  useEffect(() => {
    const shouldRedirectToLogin = !reverse && auth.ready && !auth.user
    const shouldRedirectToPage =
      (reverse && auth.ready && auth.user) || (admin && user && !user.admin)

    if (shouldRedirectToLogin) {
      history.push('/auth/login', { redirectedFrom: location.pathname + location.search })
    } else if (shouldRedirectToPage) {
      history.push(localStorage.getItem('redirectAfterLogin') || '/')
      localStorage.removeItem('redirectAfterLogin')
    }
  }, [reverse, auth, user, history, location, admin])

  const hasAccess =
    auth.ready &&
    ((!reverse && auth.user) || (reverse && !auth.user)) &&
    (!admin || (admin && user?.admin))

  return hasAccess ? <Route {...props} /> : null
}

export default PrivateRoute
