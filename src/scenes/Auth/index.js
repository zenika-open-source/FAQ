import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Route, Switch, Redirect } from 'react-router-dom'

import { auth } from 'services'

import Login from './Login'
import Callback from './Callback'
import AccessToken from './AccessToken'
import Authenticated from 'components/Authenticated'

class Auth extends Component {
  render () {
    const { match } = this.props
    return (
      <Switch>
        <Route
          path={`${match.url}/login`}
          render={() => (
            <Authenticated reverse redirect="/">
              <Login />
            </Authenticated>
          )}
        />
        <Route path={`${match.url}/callback`} component={Callback} />
        <Route
          path={`${match.url}/logout`}
          render={() => {
            auth.logout()
            return <Redirect to="/" />
          }}
        />
        <Route render={() => <Redirect to="/" />} />
      </Switch>
    )
  }
}

Auth.propTypes = {
  match: PropTypes.object.isRequired
}

export default Auth

export { AccessToken }
