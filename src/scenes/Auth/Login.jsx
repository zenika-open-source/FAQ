import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import { auth } from 'services'

import Loading from 'components/Loading'
import Button from 'components/Button'

const Login = ({ history, location }) => {
  const redirectedFrom = location.state ? location.state.from : '/'

  if (auth.wasAuthenticated()) {
    auth
      .renewAuth()
      .then(() => history.push(redirectedFrom))
      .catch(err => {
        // eslint-disable-next-line
        console.log(err)
        auth.logout() // Remove session for clean login
        history.push({
          pathname: '/auth/login',
          state: err.error === 'login_required' ? null : { error: err }
        })
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
      {location.state ? (
        <div style={{ color: 'red', marginTop: '1rem' }}>
          {JSON.stringify(location.state.error)}
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

Login.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
}

export default withRouter(Login)
