import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { login } from 'data/auth/actions'

import Button from 'react-toolbox/lib/button/Button'

class Login extends Component {
  render () {
    const { login } = this.props

    return (
      <div style={{ textAlign: 'center' }}>
        <h3>Welcome</h3>
        <p>Please sign in to access the FAQ</p>
        <Button
          icon="fingerprint"
          label="Sign in"
          raised
          primary
          onClick={() => login({ name: 'ErrOrnAmE', password: 'password' })}
        />
      </div>
    )
  }
}

Login.propTypes = {
  auth: PropTypes.object.isRequired,
  login: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  auth: state.data.auth
})

const mapDispatchToProps = dispatch => ({
  login: bindActionCreators(login, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
