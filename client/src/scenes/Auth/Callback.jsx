import { useEffect } from 'react'

import { useAuth } from 'contexts'
import { getIntl } from 'services'

import { Loading } from 'components'
import { useLocation } from 'react-router'

const Callback = () => {
  const intl = getIntl(Callback)
  const location = useLocation()

  const { parseHash } = useAuth()

  useEffect(() => {
    parseHash(location.hash)
  }, [parseHash, location.hash])

  return <Loading text={intl('loading')} />
}

Callback.translations = {
  en: { loading: 'Authenticating...' },
  fr: { loading: 'Authentification en cours...' }
}

export default Callback
