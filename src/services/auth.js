import auth0 from 'auth0-js'

class Auth {
  constructor () {
    this.auth0 = new auth0.WebAuth({
      domain: process.env.REACT_APP_AUTH0_DOMAIN,
      clientID: process.env.REACT_APP_AUTH0_CLIENTID,
      redirectUri: window.location.origin + '/auth/callback',
      audience: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/userinfo`,
      responseType: 'token id_token',
      scope: 'openid profile email'
    })

    if (
      !this.session &&
      localStorage.auth &&
      localStorage.userId &&
      localStorage.userProfile
    ) {
      this.session = JSON.parse(localStorage.auth)
      this.userProfile = JSON.parse(localStorage.userProfile)
    }
  }

  /* Action methods */
  login (redirectTo) {
    sessionStorage.after_login_redirect_url = redirectTo
    this.auth0.authorize()
  }

  logout () {
    localStorage.removeItem('auth')
    localStorage.removeItem('userId')
    localStorage.removeItem('userProfile')
    this.session = null
    this.userId = null
    this.userProfile = null
    if (this.scheduledTimeout) {
      clearTimeout(this.scheduledTimeout)
    }
  }

  parseHash (hash) {
    return new Promise((resolve, reject) => {
      this.auth0.parseHash({ hash }, (err, authResult) => {
        if (authResult && authResult.accessToken && authResult.idToken) {
          resolve(authResult)
        } else if (err) {
          alert(`Error: ${err.error}. Check the console for further details.`)
          reject(err)
        } else {
          reject(new Error('Authentication did not work'))
        }
      })
    })
  }

  setSession (authResult) {
    const expiresAt = authResult.expiresIn * 1000 + new Date().getTime()

    this.session = {
      accessToken: authResult.accessToken,
      idToken: authResult.idToken,
      expiresAt
    }

    localStorage.auth = JSON.stringify(this.session)

    this.scheduleRenew()
  }

  /* Internal actions methods */

  renewAuth = () => {
    return new Promise((resolve, reject) => {
      this.auth0.checkSession({}, (err, authResult) => {
        if (err) {
          // eslint-disable-next-line
          console.log(`Error while renewing session: ${err.error}`)
          reject(err)
          return
        }

        this.setSession(authResult)

        this.getProfile().then(resolve)
      })
    })
  }

  scheduleRenew () {
    // Renew session 5min before expiresAt
    const expiresAt = this.session.expiresAt
    const fiveMinBefore = expiresAt - new Date().getTime() - 5 * 60 * 1000
    if (this.scheduledTimeout) {
      clearTimeout(this.scheduledTimeout)
    }
    this.scheduledTimeout = setTimeout(this.renewAuth, fiveMinBefore)
  }

  getProfile () {
    return new Promise((resolve, reject) => {
      let accessToken = this.session.accessToken
      if (this.userProfile) {
        resolve(this.userProfile)
      } else {
        this.auth0.client.userInfo(accessToken, (err, profile, ...rest) => {
          if (profile) {
            this.userProfile = profile
            localStorage.userProfile = JSON.stringify(profile)
            resolve(this.userProfile)
          }
          reject(err)
        })
      }
    })
  }

  /* State getters and setters */
  isAuthenticated () {
    return (
      this.session &&
      this.session.expiresAt > new Date().getTime() &&
      localStorage.userId
    )
  }

  wasAuthenticated () {
    return (
      this.session &&
      this.session.expiresAt < new Date().getTime() &&
      localStorage.userId
    )
  }

  getAfterLoginRedirectUrl () {
    const url = sessionStorage.after_login_redirect_url
    sessionStorage.removeItem('after_login_redirect_url')
    return url
  }

  setUserId (id) {
    localStorage.userId = id
  }

  getUserId () {
    const id = localStorage.userId
    localStorage.removeItem('userId')
    return id
  }

  getUserProfile () {
    return this.isAuthenticated() ? this.userProfile : null
  }
}

const auth = new Auth()

export default auth
