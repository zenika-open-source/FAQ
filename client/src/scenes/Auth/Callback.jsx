import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import { useIntl } from 'services'
import { useAuth } from 'contexts'

import { Loading } from 'components'

const Callback = ({ location }) => {
  const intl = useIntl(Callback)

  const auth = useAuth()

  useEffect(() => {
    auth.actions.parseHash(location.hash)
  }, [])

  return <Loading text={intl('loading')} />
}

Callback.propTypes = {
  location: PropTypes.object.isRequired
}

Callback.translations = {
  en: { loading: 'Authenticating...' },
  fr: { loading: 'Authentification en cours...' }
}

export default Callback
