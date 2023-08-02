import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { useAuth } from 'contexts'
import { getIntl } from 'services'

import { Button, Loading } from 'components'

const Login = () => {
  const intl = getIntl(Login)
  const location = useLocation()

  const [renewing, setRenewing] = useState(false)
  const redirectedFrom = location.state && location.state.from

  const { login, renewAuth, isAuth, wasAuth } = useAuth()

  if (isAuth) {
    return <Navigate to="/" />
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

Login.translations = {
  en: {
    loading: 'Authenticating...',
    welcome: 'Welcome',
    text: 'Please sign in to access the FAQ',
    sign_in: 'Sign in',
  },
  fr: {
    loading: 'Authentification en cours...',
    welcome: 'Bienvenue',
    text: 'Connectez-vous pour accéder à la FAQ',
    sign_in: 'Se connecter',
  },
}

export default Login
