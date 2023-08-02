import PropTypes from 'prop-types'
import { Outlet } from 'react-router-dom'

import Authenticated from 'components/Authenticated'

const PrivateRoute = ({ element, render, admin, specialist, ...otherProps }) => {
  return (
    <Authenticated admin={admin} specialist={specialist} redirect="/auth/login">
      <Outlet {...otherProps} />
    </Authenticated>
  )
}

PrivateRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  render: PropTypes.func,
  admin: PropTypes.bool,
}

export default PrivateRoute
