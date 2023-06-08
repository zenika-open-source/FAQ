import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { withRouter, Redirect } from 'react-router-dom'

import { getIntl } from '@services'
import { useAuth } from '@contexts'

import { Loading, Button } from '@components'

const Login = ({ location }) => {
  const intl = getIntl(Login)

  const [renewing, setRenewing] = useState(false)
  const redirectedFrom = location.state && location.state.from

  const { login, renewAuth, isAuth, wasAuth } = useAuth()

  if (isAuth || import.meta.env.VITE_DISABLE_AUTH === 'true') {
    return <Redirect to="/" />
  }

  if (wasAuth) {
    if (!renewing) {
      renewAuth(redirectedFrom)
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
        onClick={() => login(redirectedFrom)}
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
