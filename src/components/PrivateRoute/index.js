import React from 'react'
import { Route } from 'react-router-dom'
import PropTypes from 'prop-types'

import Authenticated from 'components/Authenticated'

const PrivateRoute = ({ component: Component, render, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      <Authenticated {...props} redirect="/auth/login">
        {Component ? <Component {...props} {...rest} /> : render(props)}
      </Authenticated>
    )}
  />
)

PrivateRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  render: PropTypes.func
}

export default PrivateRoute
