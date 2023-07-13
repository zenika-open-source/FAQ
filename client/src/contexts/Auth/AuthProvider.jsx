import { useApolloClient } from '@apollo/client'
import { createContext, useEffect, useMemo, useReducer } from 'react'
import { useNavigate } from 'react-router'

import { alert, auth } from 'services'

import { AUTHENTICATE_MUTATION } from './queries'

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

const AuthProvider = ({ history, children }) => {
  const conf = useConfiguration()
  const navigate = useNavigate()

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
      navigate('/auth/login')
    },
    [history]
  )

  const apollo = useApolloClient()

  const parseHash = useMemo(
    () => async hash => {
      try {
        const session = await auth.parseHash(hash)

        const { redirectTo } = auth.getStateBeforeLogin()
        const {
          data: { authenticate }
        } = await apollo.mutate({
          mutation: AUTHENTICATE_MUTATION,
          variables: { idToken: session.idToken }
        })

        dispatch({ type: 'login', data: { session, user: authenticate } })

        auth.clearStateBeforeLogin()

        navigate(redirectTo || '')
      } catch (err) {
        alert.pushError('Authentication failed: ' + JSON.stringify(err.message), err)
        auth.logout()
        dispatch({ type: 'logout' })
        navigate('/auth/login')
      }
    },
    [apollo, history]
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
        navigate('/auth/login')
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

export default AuthProvider
export { AuthContext }
