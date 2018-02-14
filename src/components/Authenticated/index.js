import React from 'react'
import { Redirect } from 'react-router-dom'

import auth from 'auth'

const Authenticated = props => {
  const isAuth = auth.isAuthenticated()
  const reverse = props.reverse !== undefined || false
  const redirectPath = props.redirect || false

  return (isAuth && !reverse) || (!isAuth && reverse) ? (
    props.children
  ) : redirectPath ? (
    <Redirect to={redirectPath} />
  ) : (
    ''
  )
}

export default Authenticated
