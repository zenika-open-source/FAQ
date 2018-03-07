import React from 'react'
import { withRouter } from 'react-router'
import { Redirect } from 'react-router-dom'

import { auth } from 'services'

const Authenticated = props => {
  const isAuth = auth.isAuthenticated()
  const reverse = props.reverse !== undefined || false
  const redirectPath = props.redirect || false
  const currentURL = props.location.pathname

  return (isAuth && !reverse) || (!isAuth && reverse) ? (
    props.children
  ) : redirectPath ? (
    <Redirect to={{ pathname: redirectPath, state: { from: currentURL } }} />
  ) : (
    ''
  )
}

export default withRouter(Authenticated)
