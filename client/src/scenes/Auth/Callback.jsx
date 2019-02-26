import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import { useAuth } from 'contexts'

import { Loading } from 'components'

const Callback = ({ location }) => {
  const auth = useAuth()

  useEffect(() => {
    auth.actions.parseHash(location.hash)
  }, [])

  return <Loading text="Authenticating..." />
}

Callback.propTypes = {
  location: PropTypes.object.isRequired
}

export default Callback
