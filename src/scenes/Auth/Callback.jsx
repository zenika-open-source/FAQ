import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { authUser } from './queries'

import { auth } from 'services'

import Loading from 'components/Loading'
import Consent from './Consent'

class Callback extends Component {
  constructor (props) {
    super(props)
    this.state = {
      authResult: null
    }
  }

  componentDidMount () {
    const { location, history } = this.props

    auth
      .parseHash(location.hash)
      .then(authResult => this.setState({ authResult }))
      .catch(err => {
        // eslint-disable-next-line
        console.log(err)
        history.push({ pathname: '/auth/login', state: { error: err } })
      })
  }

  onSubmitConsent (consent) {
    const { history, authQL } = this.props
    const { authResult } = this.state
    authQL(authResult.accessToken, authResult.idToken, consent).then(({ data }) => {
      auth.setSession(authResult)
      auth.setUserId(data.authenticateUser.id)
    })
      .then(() => auth.getProfile())
      .then(() => history.push(auth.popAfterLoginRedirectUrl()))
      .catch(err => {
        // eslint-disable-next-line
        console.log(err)
        history.push({ pathname: '/auth/login', state: { error: err } })
      })
  }

  render () {
    return this.state.authResult
      ? <Consent submit={consent => this.onSubmitConsent(consent)} />
      : <Loading text="Authenticating..." />
  }
}

Callback.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  authQL: PropTypes.func.isRequired
}

export default authUser(Callback)
