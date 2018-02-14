import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { loginError } from './actions'

import auth from 'auth'

class Callback extends Component {
  componentDidMount () {
    const { history, loginError } = this.props
    auth.handleAuthentication(
      () => {
        history.push('/')
      },
      err => {
        loginError(err)
        history.push('/auth/login')
      }
    )
  }

  render () {
    return <div>Authenticating...</div>
  }
}

Callback.propTypes = {
  history: PropTypes.object.isRequired,
  loginError: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
  loginError: bindActionCreators(loginError, dispatch)
})

export default connect(null, mapDispatchToProps)(Callback)
