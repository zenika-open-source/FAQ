import React, { Component } from 'react'
import { withRouter } from 'react-router'

import { ConfigurationContext } from '../Configuration'
import { alert, auth } from 'services'

import { authUser } from './queries'

export const AuthContext = React.createContext()

class AuthProvider extends Component {
  static contextType = ConfigurationContext

  constructor(props) {
    super(props)

    const { session, user } = auth.retrieveFromLocalStorage()

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

  componentDidUpdate() {
    const conf = this.context

    if (!conf.loading && !this.state.ready) {
      auth.init(conf)
      this.setState({ ready: true })
    }
  }

  render() {
    return <AuthContext.Provider value={this.state}>{this.props.children}</AuthContext.Provider>
  }

  /* Auth lifecyle */

  login = auth.login

  logout = () => {
    auth.logout()

    return new Promise(resolve =>
      this.setState(
        {
          session: null,
          user: null
        },
        resolve
      )
    )
  }

  parseHash = async hash => {
    const { history, authQL } = this.props

    try {
      const authResult = await auth.parseHash(hash)

      const { redirectTo } = auth.popStateBeforeLogin()

      const { data } = await authQL(authResult.idToken)

      const session = this.setSession(authResult)

      this.setState(
        {
          session,
          user: data.authenticate
        },
        () => {
          auth.cacheToLocalStorage(this.state)
          this.scheduleRenew()
        }
      )

      history.push(redirectTo || '')
    } catch (err) {
      alert.pushError('Authentication failed: ' + JSON.stringify(err.message), err)
      this.logout()
      history.push('/auth/login')
    }
  }

  renewAuth = async () => {
    const { history, location } = this.props

    const redirectTo = location.pathname || '/'

    try {
      const authResult = await auth.renewAuth()

      const session = this.setSession(authResult)

      this.setState({ session }, () => {
        this.scheduleRenew()
      })
    } catch (err) {
      // "Login required" isn't an error per se
      if (err.error !== 'login_required') {
        alert.pushError('Renewing authentication failed: ' + JSON.stringify(err), err)
      }
      this.logout()
      auth.cacheStateBeforeLogin({ redirectTo })
      history.push('/auth/login')
    }
  }

  /* Accessors */

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
    auth.scheduleRenew(this.state.session, this.renewAuth)
  }
}

export default withRouter(authUser(AuthProvider))
