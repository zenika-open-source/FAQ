import React from 'react'
import PropTypes from 'prop-types'
import { Route, Switch, Redirect } from 'react-router-dom'

import Login from './Login'
import Callback from './Callback'
import Logout from './Logout'

const Auth = ({ match }) => (
  <Switch>
    <Route path={`${match.url}/login`} component={Login} />
    <Route path={`${match.url}/callback`} component={Callback} />
    <Route path={`${match.url}/logout`} component={Logout} />
    <Route render={() => <Redirect to="/" />} />
  </Switch>
)

Auth.propTypes = {
  match: PropTypes.object.isRequired
}

export default Auth
