import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import { getIntl } from '@services'
import { useAuth } from '@contexts'

import { Loading } from '@components'

const Callback = ({ location }) => {
  const intl = getIntl(Callback)

  const { parseHash } = useAuth()

  useEffect(() => {
    parseHash(location.hash)
  }, [parseHash, location.hash])

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
