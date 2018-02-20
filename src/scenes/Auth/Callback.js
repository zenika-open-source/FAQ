import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { graphql } from 'react-apollo'
import { authUser } from './queries'

import auth from 'auth'

class Callback extends Component {
  componentDidMount () {
    const { history, authQL } = this.props
    auth.handleAuthentication(
      authResult => {
        authQL(authResult.accessToken, authResult.idToken).then(({ data }) => {
          auth.setSession(authResult, data.authenticateUser.id)
          history.push('/')
        })
      },
      err => {
        history.push({ pathname: '/auth/login', state: { error: err } })
      }
    )
  }

  render () {
    return <div>Authenticating...</div>
  }
}

Callback.propTypes = {
  history: PropTypes.object.isRequired,
  authQL: PropTypes.func.isRequired
}

export default graphql(authUser, {
  props: ({ mutate }) => ({
    authQL: (accessToken, idToken) => {
      return mutate({ variables: { accessToken, idToken } })
    }
  })
})(Callback)
