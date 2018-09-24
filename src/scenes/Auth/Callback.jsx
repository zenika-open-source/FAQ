import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { authUser } from './queries'

import { auth } from 'services'

import Loading from 'components/Loading'

class Callback extends Component {
  componentDidMount() {
    const { location, history, authQL } = this.props

    auth
      .parseHash(location.hash) // Get auth0 data
      .then(authResult => auth.setSession(authResult)) // Set auth0 data into session
      .then(authResult => authQL(authResult.idToken)) // Authenticate user to backend
      .then(({ data }) => auth.setUserId(data.authenticate.id)) // Set user's id
      .then(() => history.push(auth.popAfterLoginRedirectUrl())) // Redirect user
      .catch(err => {
        // eslint-disable-next-line
        console.log(err)
        auth.setSession(null)
        history.push({ pathname: '/auth/login', state: { error: err } })
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
