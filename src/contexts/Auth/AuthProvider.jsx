import React, { Component } from 'react'
import auth0 from 'auth0-js'
import { withRouter } from 'react-router'

import { ConfigurationContext } from '../Configuration'
import { alert } from 'services'

import { authUser } from './queries'

export const AuthContext = React.createContext()

class AuthProvider extends Component {
  static contextType = ConfigurationContext

  constructor(props) {
    super(props)

    const { session, user } = this.retrieveFromLS()

    this.state = {
      session,
      user,
      actions: {
        login: this.login,
        logout: this.logout,
        parseHash: this.parseHash,
        renewAuth: this.renewAuth
      }
    }
  }

  componentDidMount() {
    const { session, user } = this.state
    if (session && user) this.scheduleRenew()
  }

  componentDidUpdate(prevProps, prevState) {
    const conf = this.context

    if (!conf.loading && !prevState.auth0 && !this.state.auth0) {
      this.setState({ auth0: this.initAuth0(conf), ready: true })
    }
  }

  render() {
    return <AuthContext.Provider value={this.state}>{this.props.children}</AuthContext.Provider>
  }

  /* Auth lifecyle */

  login = redirectTo => {
    if (redirectTo) this.cacheStateBeforeLogin({ redirectTo })
    this.state.auth0.authorize()
  }

  logout = () => {
    const { scheduledTimeout } = this.state

    if (scheduledTimeout) {
      clearTimeout(scheduledTimeout)
    }

    this.clearLS()

    return new Promise(resolve =>
      this.setState(
        {
          session: null,
          user: null,
          scheduledTimeout: null
        },
        resolve
      )
    )
  }

  parseHash = hash => {
    const { history, authQL } = this.props

    this.state.auth0.parseHash({ hash }, async (err, authResult) => {
      const { redirectTo } = this.retrieveStateBeforeLogin()

      try {
        if (authResult && authResult.accessToken && authResult.idToken) {
          localStorage.accessToken = authResult.idToken

          const { data } = await authQL(authResult.idToken)

          const session = this.setSession(authResult)

          this.setState(
            {
              session,
              user: data.authenticate
            },
            () => {
              this.cacheToLS()
              this.scheduleRenew()
            }
          )

          history.push(redirectTo || '')
        } else if (err) {
          throw new Error(JSON.stringify(err))
        } else {
          throw new Error('Unknown error')
        }
      } catch (err) {
        alert.pushError('Authentication failed: ' + JSON.stringify(err.message), err)
        this.logout()
        history.push('/auth/login')
      }
    })
  }

  renewAuth = () => {
    const { history, location } = this.props
    const { auth0 } = this.state

    const redirectTo = location.pathname || '/'

    auth0.checkSession({}, (err, authResult) => {
      if (err) {
        // "Login required" isn't an error per se
        if (err.error !== 'login_required') {
          alert.pushError('Renewing authentication failed: ' + JSON.stringify(err), err)
        }
        this.logout()
        this.cacheStateBeforeLogin({ redirectTo })
        history.push('/auth/login')
        return
      }

      const session = this.setSession(authResult)

      this.setState({ session }, () => {
        this.scheduleRenew()
      })
    })
  }

  /* Accessors */

  retrieveFromLS() {
    return {
      session: localStorage.session ? JSON.parse(localStorage.session) : null,
      user: localStorage.user ? JSON.parse(localStorage.user) : null
    }
  }

  cacheToLS = () => {
    const { session, user } = this.state
    localStorage.session = JSON.stringify(session)
    localStorage.user = JSON.stringify(user)
    localStorage.accessToken = session.idToken
  }

  clearLS() {
    localStorage.removeItem('session')
    localStorage.removeItem('user')
    localStorage.removeItem('accessToken')
  }

  cacheStateBeforeLogin(state) {
    localStorage.state_before_login = JSON.stringify(state)
  }

  retrieveStateBeforeLogin() {
    const state = JSON.parse(localStorage.state_before_login)
    localStorage.removeItem('state_before_login')
    return state
  }

  initAuth0(configuration) {
    return new auth0.WebAuth({
      domain: configuration.auth0Domain,
      clientID: configuration.auth0ClientId,
      redirectUri: window.location.origin + '/auth/callback',
      audience: `https://${configuration.auth0Domain}/userinfo`,
      responseType: 'token id_token',
      scope: 'openid profile email'
    })
  }

  setSession(authResult) {
    if (!authResult) return this.logout()

    const expiresAt = authResult.expiresIn * 1000 + new Date().getTime()

    const session = {
      ...authResult,
      expiresAt
    }

    return session
  }

  scheduleRenew() {
    const { session, scheduledTimeout } = this.state
    // Renew session 5min before expiresAt
    const expiresAt = session.expiresAt
    const fiveMinBefore = expiresAt - new Date().getTime() - 5 * 60 * 1000

    if (scheduledTimeout) {
      clearTimeout(scheduledTimeout)
    }

    this.setState({
      scheduledTimeout: setTimeout(this.renewAuth, fiveMinBefore)
    })
  }
}

export default withRouter(authUser(AuthProvider))
