import React, { Component } from 'react'
import PropTypes from 'prop-types'
import auth from 'auth'

import Button from 'react-toolbox/lib/button/Button'

class Login extends Component {
  render () {
    const { error } = this.props
    return (
      <div style={{ textAlign: 'center' }}>
        <h3>Welcome</h3>
        <p>Please sign in to access the FAQ</p>
        <Button
          icon="fingerprint"
          label="Sign in"
          raised
          primary
          onClick={() => auth.login()}
        />
        {error ? (
          <div style={{ color: 'red', marginTop: '1rem' }}>
            {JSON.stringify(error)}
          </div>
        ) : (
          ''
        )}
      </div>
    )
  }
}

Login.propTypes = {
  error: PropTypes.object
}

export default Login
