import React from 'react'
import PropTypes from 'prop-types'
import { Route } from 'react-router-dom'

import Authenticated from 'components/Authenticated'

const PrivateRoute = ({ component: Component, render, admin, ...otherProps }) => (
  <Route
    {...otherProps}
    render={props => (
      <Authenticated {...props} admin={admin} redirect="/auth/login">
        {Component ? <Component {...props} {...otherProps} /> : render(props)}
      </Authenticated>
    )}
  />
)

PrivateRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  render: PropTypes.func,
  admin: PropTypes.bool
}

export default PrivateRoute
