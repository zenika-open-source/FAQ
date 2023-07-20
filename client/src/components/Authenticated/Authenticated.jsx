import PropTypes from 'prop-types'
import { Navigate } from 'react-router-dom'

import { useAuth } from 'contexts'

const Authenticated = ({ reverse, redirect, children, admin, specialist }) => {
  const { isAuth, isAdmin, isSpecialist } = useAuth()

  if (admin && isAdmin) {
    return children
  }

  if (specialist && isSpecialist) {
    return children
  }

  if (admin || specialist) {
    return redirect ? <Navigate replace to="/" /> : ''
  }

  if ((isAuth && !reverse) || (!isAuth && reverse)) {
    return children
  }

  if (redirect) {
    return <Navigate replace to={redirect} />
  }

  return ''
}

Authenticated.propTypes = {
  reverse: PropTypes.bool,
  redirect: PropTypes.string,
  children: PropTypes.node,
  admin: PropTypes.bool,
  specialist: PropTypes.bool
}

export default Authenticated
