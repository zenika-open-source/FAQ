import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import { alert, auth } from 'services'

import { Loading, Button } from 'components'

const Login = ({ history, location }) => {
  const redirectedFrom = location.state ? location.state.from : '/'

  if (auth.wasAuthenticated()) {
    auth
      .renewAuth()
      .then(() => history.push(redirectedFrom))
      .catch(err => {
        if (err.error !== 'login_required') {
          alert.pushError(
            'Authentication failed: ' + JSON.stringify(err.message),
            err
          )
        }
        auth.logout() // Remove session for clean login
        history.push('/auth/login')
      })
    return <Loading text="Authenticating..." />
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h1>Welcome</h1>
      <p>Please sign in to access the FAQ</p>
      <Button
        icon="fingerprint"
        label="Sign in"
        onClick={() => auth.login(redirectedFrom)}
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
