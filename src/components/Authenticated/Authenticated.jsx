import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { Redirect } from 'react-router-dom'

import { auth } from 'services'

const Authenticated = ({ location, reverse, redirect, children }) => {
  const isAuth = auth.isAuthenticated()
  const currentURL = location.pathname

  return (isAuth && !reverse) || (!isAuth && reverse) ? (
    children
  ) : redirect ? (
    <Redirect to={{ pathname: redirect, state: { from: currentURL } }} />
  ) : (
    ''
  )
}

Authenticated.propTypes = {
  location: PropTypes.object.isRequired,
  reverse: PropTypes.bool,
  redirect: PropTypes.string,
  children: PropTypes.node
}

export default withRouter(Authenticated)
