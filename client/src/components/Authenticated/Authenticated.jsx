import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { Redirect } from 'react-router-dom'

import { useAuth } from 'contexts'

const Authenticated = ({ location, reverse, redirect, children, admin, specialist }) => {
  const { isAuth, isAdmin, isSpecialist } = useAuth()

  if (import.meta.env.VITE_DISABLE_AUTH === 'true') {
    return children
  }

  const currentURL = location.pathname + location.search

  if (admin) {
    if (!isAdmin) {
      return redirect ? <Redirect to="/" /> : ''
    } else {
      return children
    }
  }

  if (specialist) {
    if (!isSpecialist) {
      return redirect ? <Redirect to="/" /> : ''
    } else {
      return children
    }
  }

  if ((isAuth && !reverse) || (!isAuth && reverse)) {
    return children
  }

  if (redirect) {
    return <Redirect to={{ pathname: redirect, state: { from: currentURL } }} />
  }

  return ''
}

Authenticated.propTypes = {
  location: PropTypes.object.isRequired,
  reverse: PropTypes.bool,
  redirect: PropTypes.string,
  children: PropTypes.node,
  admin: PropTypes.bool
}

export default withRouter(Authenticated)
