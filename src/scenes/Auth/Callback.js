import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { gql } from 'apollo-boost'
import { graphql } from 'react-apollo'

import auth from 'auth'

const authUser = gql`
  mutation authUser($accessToken: String!, $idToken: String!) {
    authenticateUser(accessToken: $accessToken, idToken: $idToken) {
      id
      token
    }
  }
`

class Callback extends Component {
  componentDidMount () {
    const { history, authQL } = this.props
    auth.handleAuthentication(
      authResult => {
        authQL(authResult.accessToken, authResult.idToken).then(() => {
          auth.setSession(authResult)
          history.push('/')
        })
        // history.push('/')
      },
      err => {
        // loginError(err)
        history.push('/auth/login')
      }
    )
  }

  render () {
    return <div>Authenticating...</div>
  }
}

/* Callback.propTypes = {
  history: PropTypes.object.isRequired,
  loginError: PropTypes.func.isRequired
}

/* const mapDispatchToProps = dispatch => ({
  loginError: bindActionCreators(loginError, dispatch)
})

export default connect(null, mapDispatchToProps)(Callback) */

export default graphql(authUser, {
  props: ({ mutate }) => ({
    authQL: (accessToken, idToken) => {
      return mutate({ variables: { accessToken, idToken } })
    }
  })
})(Callback)
