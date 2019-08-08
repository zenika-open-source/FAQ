import React, { createContext, useReducer, useEffect, useMemo } from 'react'
import { withRouter } from 'react-router'

import { alert, auth } from 'services'

import { authUser } from './queries'

import { useConfiguration } from '../Configuration'

const AuthContext = createContext()

const reducer = (state, action) => {
  switch (action.type) {
    case 'ready':
      return {
        ...state,
        ready: true
      }
    case 'login':
      return {
        ...state,
        ...action.data,
        previousState: state.state,
        state: 'signed_in'
      }
    case 'renew':
      return {
        ...state,
        ...action.data,
        previousState: state.state,
        state: 'renewed_in'
      }
    case 'logout':
      return {
        ...state,
        session: null,
        user: null,
        previousState: state.state,
        state: 'signed_out'
      }
    default:
      return state
  }
}

const AuthProvider = ({ history, authQL, children }) => {
  const conf = useConfiguration()

  const init = () => {
    const { session, user } = auth.retrieveFromLocalStorage()

    if (!conf.loading) {
      auth.init(conf)
    }

    return {
      previousState: null,
      state: session && user ? 'signed_in' : 'init',
      session,
      user,
      ready: !conf.loading
    }
  }

  const [state, dispatch] = useReducer(reducer, null, init)

  // If conf is not loaded, wait for it then set ready
  useEffect(() => {
    if (!conf.loading && !state.ready) {
      auth.init(conf)
      dispatch({ type: 'ready' })
    }
  }, [conf, state])

  const logout = useMemo(
    () => () => {
      auth.logout()
      dispatch({ type: 'logout' })
      history.push('/auth/login')
    },
    [history]
  )

  const parseHash = useMemo(
    () => async hash => {
      try {
        const session = await auth.parseHash(hash)

        const { redirectTo } = auth.getStateBeforeLogin()

        const {
          data: { authenticate }
        } = await authQL(session.idToken)

        dispatch({ type: 'login', data: { session, user: authenticate } })

        auth.clearStateBeforeLogin()

        history.push(redirectTo || '')
      } catch (err) {
        alert.pushError('Authentication failed: ' + JSON.stringify(err.message), err)
        auth.logout()
        dispatch({ type: 'logout' })
        history.push('/auth/login')
      }
    },
    [authQL, history]
  )

  const renewAuth = useMemo(() => {
    return async redirectedFrom => {
      const redirectTo = redirectedFrom || window.location.pathname || '/'

      try {
        const session = await auth.renewAuth()

        if (!session) throw new Error('Unknown error')

        dispatch({ type: 'renew', data: { session } })
      } catch (err) {
        // "Login required" isn't an error per se
        if (err.error !== 'login_required') {
          alert.pushError('Renewing authentication failed: ' + JSON.stringify(err), err)
        }
        auth.logout()
        dispatch({ type: 'logout' })
        auth.cacheStateBeforeLogin({ redirectTo })
        history.push('/auth/login')
      }
    }
  }, [history])

  // Effect after state change
  useEffect(() => {
    switch (state.state) {
      case 'signed_in':
      case 'renewed_in':
        auth.cacheToLocalStorage(state)
        auth.scheduleRenew(state.session, renewAuth)
        break
      default:
        break
    }
  }, [state, renewAuth])

  const value = useMemo(() => [state, { login: auth.login, logout, parseHash, renewAuth }], [
    state,
    logout,
    parseHash,
    renewAuth
  ])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default withRouter(authUser(AuthProvider))
export { AuthContext }
