import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { authUser } from './queries'

import { auth } from 'services'

import Loading from 'components/Loading'

class Callback extends Component {
  componentDidMount () {
    const { location, history, authQL } = this.props

    auth
      .parseHash(location.hash)
      .then(authResult =>
        authQL(authResult.accessToken, authResult.idToken).then(({ data }) => {
          auth.setSession(authResult)
          auth.setUserId(data.authenticateUser.id)
        })
      )
      .then(() => auth.getProfile())
      .then(() => history.push(auth.getAfterLoginRedirectUrl()))
      .catch(err => {
        // eslint-disable-next-line
        console.log(err)
        history.push({ pathname: '/auth/login', state: { error: err } })
      })
  }

  render () {
    return <Loading text="Authenticating..." />
  }
}

Callback.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  authQL: PropTypes.func.isRequired
}

export default authUser(Callback)
