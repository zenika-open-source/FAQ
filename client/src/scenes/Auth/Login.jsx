import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { useIntl, signIn } from 'services'
import { Button } from 'components'

const Login = () => {
  const intl = useIntl(Login)
  const location = useLocation()

  useEffect(() => {
    localStorage.setItem('redirectAfterLogin', location.state?.redirectedFrom)
  }, [location.state])

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h1>{intl('welcome')}</h1>
      <p>{intl('text')}</p>
      <Button icon="fingerprint" label={intl('sign_in')} onClick={signIn} primary raised />
    </div>
  )
}

Login.translations = {
  en: {
    welcome: 'Welcome',
    text: 'Please sign in to access the FAQ',
    sign_in: 'Sign in'
  },
  fr: {
    welcome: 'Bienvenue',
    text: 'Connectez-vous pour accéder à la FAQ',
    sign_in: 'Se connecter'
  }
}

export default Login
