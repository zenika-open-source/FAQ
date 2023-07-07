import auth0 from 'auth0-js'

class Auth {
  init({ auth0Domain, auth0ClientId }) {
    this.auth0 = new auth0.WebAuth({
      domain: auth0Domain,
      clientID: auth0ClientId,
      redirectUri: window.location.origin + '/auth/callback',
      audience: `https://${auth0Domain}/userinfo`,
      responseType: 'token id_token',
      scope: 'openid profile email'
    })
    return this.auth0
  }

  /* AUTH LIFECYCLE */

  login = redirectTo => {
    if (redirectTo) this.cacheStateBeforeLogin({ redirectTo })
    this.auth0.authorize()
  }

  logout = () => {
    this.clearLocalStorage()
  }

  parseHash = hash =>
    new Promise((resolve, reject) => {
      this.auth0.parseHash({ hash }, this.authCheck(resolve, reject))
    })

  renewAuth = () =>
    new Promise((resolve, reject) => {
      this.auth0.checkSession({}, this.authCheck(resolve, reject))
    })

  /* HELPERS */

  authCheck = (resolve, reject) => (err, authResult) => {
    if (authResult && authResult.idToken) {
      localStorage.accessToken = authResult.idToken

      const expiresAt = authResult.expiresIn * 1000 + new Date().getTime()

      resolve({
        ...authResult,
        expiresAt
      })
    } else {
      reject(err || null)
    }
  }

  scheduleRenew = (session, renewCallback) => {
    // Renew session 5min before end of token
    const fiveMinBefore = (session.expiresIn - 5 * 60) * 1000

    if (this.scheduledTimeout) {
      clearTimeout(this.scheduledTimeout)
    }

    return setTimeout(renewCallback, fiveMinBefore)
  }

  /* LOCAL STORAGE */

  retrieveFromLocalStorage() {
    return {
      session: localStorage.session ? JSON.parse(localStorage.session) : null,
      user: localStorage.user ? JSON.parse(localStorage.user) : null
    }
  }

  cacheToLocalStorage = ({ session, user }) => {
    localStorage.session = JSON.stringify(session)
    localStorage.user = JSON.stringify(user)
    localStorage.accessToken = session.idToken
  }

  clearLocalStorage() {
    localStorage.removeItem('session')
    localStorage.removeItem('user')
    localStorage.removeItem('accessToken')
  }

  cacheStateBeforeLogin(state) {
    localStorage.state_before_login = JSON.stringify(state)
  }

  getStateBeforeLogin() {
    return JSON.parse(localStorage.state_before_login || '{}')
  }

  clearStateBeforeLogin() {
    localStorage.removeItem('state_before_login')
  }
}

const auth = new Auth()

export default auth
