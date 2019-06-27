import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { withRouter, Redirect } from 'react-router-dom'

import { useIntl } from 'services'
import { useAuth, isAuthenticated, wasAuthenticated } from 'contexts'

import { Loading, Button } from 'components'

const Login = ({ location }) => {
  const intl = useIntl(Login)

  const [renewing, setRenewing] = useState(false)
  const redirectedFrom = location.state && location.state.from

  const auth = useAuth()
  const isAuth = isAuthenticated()
  const wasAuth = wasAuthenticated()

  if (isAuth) {
    return <Redirect to="/" />
  }

  if (wasAuth) {
    if (!renewing) {
      auth.actions.renewAuth(redirectedFrom)
      setRenewing(true)
    }

    return <Loading text={intl('loading')} />
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h1>{intl('welcome')}</h1>
      <p>{intl('text')}</p>
      <Button
        icon="fingerprint"
        label={intl('sign_in')}
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

Login.translations = {
  en: {
    loading: 'Authenticating...',
    welcome: 'Welcome',
    text: 'Please sign in to access the FAQ',
    sign_in: 'Sign in'
  },
  fr: {
    loading: 'Authentification en cours...',
    welcome: 'Bienvenue',
    text: 'Connectez-vous pour accéder à la FAQ',
    sign_in: 'Se connecter'
  }
}

export default withRouter(Login)
