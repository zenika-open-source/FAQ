import React from 'react'
import { Route, Switch } from 'react-router-dom'

import Auth from 'scenes/Auth'
import Home from 'scenes/Home'
import Question from 'scenes/Question'
import UserProfile from 'scenes/UserProfile'
import Settings from 'scenes/Settings'
import NotFound from 'scenes/NotFound'

import { PrivateRoute, Loading } from 'components'

import { useConfiguration, useAuth } from 'contexts'

const AppBody = () => {
  const conf = useConfiguration()
  const auth = useAuth()

  return (
    <div className="main">
      {conf.loading || !auth.ready ? (
        <Loading text="Preparing the questions..." />
      ) : (
        <Switch>
          <PrivateRoute exact path="/" component={Home} />
          <Route path="/auth" component={Auth} />
          <PrivateRoute path="/q" component={Question} />
          <PrivateRoute path="/user-profile" component={UserProfile} />
          <PrivateRoute path="/settings" component={Settings} admin />
          <PrivateRoute component={NotFound} />
        </Switch>
      )}
    </div>
  )
}

export default AppBody
