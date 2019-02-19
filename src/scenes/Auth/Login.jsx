import React from 'react'
import PropTypes from 'prop-types'
import { withRouter, Redirect } from 'react-router-dom'

import { useAuth, isAuthenticated, wasAuthenticated } from 'contexts'

import { Loading, Button } from 'components'

const Login = ({ location }) => {
  const redirectedFrom = location.state && location.state.from

  const auth = useAuth()
  const isAuth = isAuthenticated()
  const wasAuth = wasAuthenticated()

  if (isAuth) {
    return <Redirect to="/" />
  }

  if (wasAuth) {
    auth.actions.renewAuth()

    return <Loading text="Authenticating..." />
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h1>Welcome</h1>
      <p>Please sign in to access the FAQ</p>
      <Button
        icon="fingerprint"
        label="Sign in"
        onClick={() => auth.actions.login(redirectedFrom)}
        primary
        raised
      />
    </div>
  )
}

Login.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
}

export default withRouter(Login)
