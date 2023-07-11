import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { Redirect } from 'react-router-dom'

import { useAuth } from 'contexts'

const Authenticated = ({ location, reverse, redirect, children, admin, specialist }) => {
  const { isAuth, isAdmin, isSpecialist } = useAuth()
  const currentURL = location.pathname + location.search

  console.log({ admin, isAdmin, specialist, isSpecialist })
  if (admin && isAdmin) {
    return children
  }

  if (specialist && isSpecialist) {
    console.log('first')
    return children
  }

  if (admin || specialist) {
    console.log('second')
    return redirect ? <Redirect to="/" /> : ''
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
