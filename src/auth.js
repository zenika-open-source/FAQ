import auth0 from 'auth0-js'

class Auth {
  constructor () {
    this.auth0 = new auth0.WebAuth({
      domain: process.env.REACT_APP_AUTH0_DOMAIN,
      clientID: process.env.REACT_APP_AUTH0_CLIENTID,
      redirectUri: window.location.origin,
      audience: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/userinfo`,
      responseType: 'token id_token',
      scope: 'openid profile email'
    })

    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
    this.handleAuthentication = this.handleAuthentication.bind(this)
    this.isAuthenticated = this.isAuthenticated.bind(this)
    this.getAccessToken = this.getAccessToken.bind(this)
    this.getProfile = this.getProfile.bind(this)
  }

  login () {
    this.auth0.authorize()
  }

  handleAuthentication (successCallback, errorCallback) {
    this.auth0.parseHash(
      {
        hash: window.location.hash.split('?')[1]
      },
      (err, authResult) => {
        if (authResult && authResult.accessToken && authResult.idToken) {
          this.setSession(authResult)
          successCallback()
          // errorCallback({ error: 'Not an error' })
        } else if (err) {
          alert(`Error: ${err.error}. Check the console for further details.`)
          errorCallback(err)
        } else {
          errorCallback({ error: 'Authentication did not work' })
        }
      }
    )
  }

  setSession (authResult) {
    let expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    )
    localStorage.setItem('access_token', authResult.accessToken)
    localStorage.setItem('id_token', authResult.idToken)
    localStorage.setItem('expires_at', expiresAt)
  }

  logout () {
    localStorage.removeItem('access_token')
    localStorage.removeItem('id_token')
    localStorage.removeItem('expires_at')
    this.userProfile = null
  }

  isAuthenticated () {
    let expiresAt = JSON.parse(localStorage.getItem('expires_at'))
    return new Date().getTime() < expiresAt
  }

  getAccessToken () {
    const accessToken = localStorage.getItem('access_token')
    if (!accessToken) {
      throw new Error('No access token found')
    }
    return accessToken
  }

  getProfile (cb) {
    let accessToken = this.getAccessToken()
    if (this.userProfile) {
      cb(null, this.userProfile)
    } else {
      this.auth0.client.userInfo(accessToken, (err, profile, ...rest) => {
        if (profile) {
          this.userProfile = profile
        }
        cb(err, profile)
      })
    }
  }
}

const auth = new Auth()

export default auth
