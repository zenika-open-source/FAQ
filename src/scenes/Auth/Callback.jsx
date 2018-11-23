import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { authUser } from './queries'

import { alert, auth } from 'services'

import { Loading } from 'components'

class Callback extends Component {
  componentDidMount() {
    const { location, history, authQL } = this.props

    auth
      .parseHash(location.hash) // Get auth0 data
      .then(authResult => auth.setSession(authResult)) // Set auth0 data into session
      .then(authResult => authQL(authResult.idToken)) // Authenticate user to backend
      .then(({ data }) => auth.setUserData(data.authenticate)) // Set user data
      .then(() => history.push(auth.popAfterLoginRedirectUrl())) // Redirect user
      .catch(err => {
        alert.pushError(
          'Authentication failed: ' + JSON.stringify(err.message),
          err
        )
        auth.setSession(null)
        history.push('/auth/login')
      })
  }

  render() {
    return <Loading text="Authenticating..." />
  }
}

Callback.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  authQL: PropTypes.func.isRequired
}

export default authUser(Callback)
