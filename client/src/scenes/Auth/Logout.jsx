import React, { useEffect } from 'react'

import { useAuth } from 'contexts'

import { Loading } from 'components'

const Logout = ({ history }) => {
  const [auth] = useAuth()

  useEffect(() => {
    auth.actions.logout().then(() => history.push('/'))
  }, [auth.actions, history])

  return <Loading />
}

export default Logout
