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
    this.session = JSON.parse(localStorage.getItem('auth'))
  }

  login (redirectURL) {
    this.saveRedirectURL(redirectURL)
    this.auth0.authorize()
  }

  handleAuthentication (successCallback, errorCallback) {
    return new Promise((resolve, reject) => {
      this.auth0.parseHash(
        {
          hash: window.location.hash.split('?')[1]
        },
        (err, authResult) => {
          if (authResult && authResult.accessToken && authResult.idToken) {
            resolve(authResult)
          } else if (err) {
            alert(`Error: ${err.error}. Check the console for further details.`)
            reject(err)
          } else {
            reject(new Error('Authentication did not work'))
          }
        }
      )
    })
  }

  setSession (authResult, userNodeId) {
    // const expiresAt = new Date().getTime() + 7 * 24 * 60 * 60 * 1000 // A week
    const expiresAt = authResult.expiresIn * 1000 + new Date().getTime()
    // authResult.expiresIn * 1000 + new Date().getTime()

    const auth = {
      accessToken: authResult.accessToken,
      idToken: authResult.idToken,
      expiresAt,
      userNodeId
    }
    localStorage.setItem('auth', JSON.stringify(auth))
    this.session = auth
  }

  logout () {
    localStorage.removeItem('auth')
    this.userProfile = null
    this.session = null
  }

  isAuthenticated () {
    let expiresAt = this.session ? this.session.expiresAt : 0
    return new Date().getTime() < expiresAt
  }

  getAccessToken () {
    const accessToken = this.session ? this.session.accessToken : null
    if (!accessToken) {
      throw new Error('No access token found')
    }
    return accessToken
  }

  getUserNodeId () {
    const userNodeId = this.session ? this.session.userNodeId : null
    if (!userNodeId) {
      throw new Error('No user node id found')
    }
    return userNodeId
  }

  getProfile (cb) {
    return new Promise((resolve, reject) => {
      let accessToken = this.getAccessToken()
      if (this.userProfile) {
        resolve(this.userProfile)
      } else {
        this.auth0.client.userInfo(accessToken, (err, profile, ...rest) => {
          if (profile) {
            this.userProfile = profile
            resolve(this.userProfile)
          }
          reject(err)
        })
      }
    })
  }

  saveRedirectURL (url) {
    sessionStorage.setItem('after_login_redirect_url', url)
  }

  retrieveRedirectURL () {
    const url = sessionStorage.getItem('after_login_redirect_url')
    sessionStorage.removeItem('after_login_redirect_url')
    return url
  }
}

const auth = new Auth()

export default auth
