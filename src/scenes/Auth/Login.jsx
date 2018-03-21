import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import { auth } from 'services'

import Button from 'components/Button'

const Login = ({ location }) => {
  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h1>Welcome</h1>
      <p>Please sign in to access the FAQ</p>
      <Button
        icon="fingerprint"
        label="Sign in"
        onClick={() => auth.login(location.state ? location.state.from : '/')}
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
  location: PropTypes.object.isRequired
}

export default withRouter(Login)
