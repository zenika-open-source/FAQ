import auth0 from 'auth0-js'

import alert from './alert'
import configuration from './configuration'

class Auth {
  constructor() {
    if (localStorage.auth && localStorage.userId) {
      this.session = JSON.parse(localStorage.auth)
    }
  }

  /* Action methods */
  login(redirectTo) {
    sessionStorage.after_login_redirect_url = redirectTo
    this.getAuth0().authorize()
  }

  logout() {
    localStorage.removeItem('auth')
    localStorage.removeItem('userId')
    localStorage.removeItem('userProfile')
    this.session = null
    this.userId = null
    if (this.scheduledTimeout) {
      clearTimeout(this.scheduledTimeout)
    }
  }

  parseHash(hash) {
    return new Promise((resolve, reject) => {
      this.getAuth0().parseHash({ hash }, (err, authResult) => {
        if (authResult && authResult.accessToken && authResult.idToken) {
          resolve(authResult)
        } else if (err) {
          reject(err)
        } else {
          reject(new Error('Unknown error'))
        }
      })
    })
  }

  setSession(authResult) {
    if (!authResult) return this.logout()

    const expiresAt = authResult.expiresIn * 1000 + new Date().getTime()

    this.session = {
      accessToken: authResult.accessToken,
      idToken: authResult.idToken,
      expiresAt
    }

    localStorage.auth = JSON.stringify(this.session)

    this.scheduleRenew()

    return authResult
  }

  /* Internal actions methods */

  renewAuth() {
    return new Promise((resolve, reject) => {
      this.getAuth0().checkSession({}, (err, authResult) => {
        if (err) {
          // "Login required" isn't an error per se
          if (err.error !== 'login_required') {
            alert.pushError(
              'Renewing authentication failed: ' + JSON.stringify(err),
              err
            )
          }
          reject(err)
          return
        }

        this.setSession(authResult)

        resolve()
      })
    })
  }

  scheduleRenew() {
    // Renew session 5min before expiresAt
    const expiresAt = this.session.expiresAt
    const fiveMinBefore = expiresAt - new Date().getTime() - 5 * 60 * 1000
    if (this.scheduledTimeout) {
      clearTimeout(this.scheduledTimeout)
    }
    this.scheduledTimeout = setTimeout(this.renewAuth, fiveMinBefore)
  }

  /* State getters and setters */
  getAuth0() {
    if (!this.auth0) {
      this.auth0 = new auth0.WebAuth({
        domain: configuration.auth0Domain,
        clientID: configuration.auth0ClientId,
        redirectUri: window.location.origin + '/auth/callback',
        audience: `https://${configuration.auth0Domain}/userinfo`,
        responseType: 'token id_token',
        scope: 'openid profile email'
      })
    }

    return this.auth0
  }

  isAuthenticated() {
    return (
      this.session &&
      this.session.expiresAt > new Date().getTime() &&
      localStorage.userId
    )
  }

  wasAuthenticated() {
    return (
      this.session &&
      this.session.expiresAt < new Date().getTime() &&
      localStorage.userId
    )
  }

  popAfterLoginRedirectUrl() {
    const url = sessionStorage.after_login_redirect_url
    sessionStorage.removeItem('after_login_redirect_url')
    return url
  }

  setUserData(data) {
    localStorage.userData = JSON.stringify(data)
    localStorage.userId = data.id
  }

  getUserNodeId() {
    return localStorage.userId
  }

  isAdmin() {
    return this.isAuthenticated() && JSON.parse(localStorage.userData).admin
  }

  getLocale() {
    return this.isAuthenticated() && JSON.parse(localStorage.userData).locale
  }
}

const auth = new Auth()

export default auth
