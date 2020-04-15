import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import { PrivateRoute } from 'components'

import Login from './Login'

const Auth = ({ match }) => (
  <Switch>
    <PrivateRoute reverse path={`${match.url}/login`} component={Login} />
    <Route render={() => <Redirect to="/" />} />
  </Switch>
)

export default Auth
