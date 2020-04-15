import React from 'react'
import { Redirect, Switch, Route } from 'react-router'

import { Me } from './scenes'

const User = ({ match }) => (
  <Switch>
    <Route path={`${match.path}/me`} component={Me} />
    <Route render={() => <Redirect to="/" />} />
  </Switch>
)

export default User
