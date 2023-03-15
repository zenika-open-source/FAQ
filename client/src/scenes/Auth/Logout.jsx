import React, { useEffect } from 'react'

import { useAuth } from '@contexts'

import { Loading } from '@components'

const Logout = () => {
  const { logout } = useAuth()

  useEffect(() => {
    logout()
  }, [logout])

  return <Loading />
}

export default Logout
