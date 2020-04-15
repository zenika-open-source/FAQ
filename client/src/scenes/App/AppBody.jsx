import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Home from 'scenes/Home'
import Auth from 'scenes/Auth'
import Question from 'scenes/Question'
import NotFound from 'scenes/NotFound'
import Settings from 'scenes/Settings'
import User from 'scenes/User'

import { Loading, ErrorBoundary, PrivateRoute } from 'components'
import { useAuth } from 'services'

const AppBody = () => {
  const auth = useAuth()

  return (
    <div className="main">
      {!auth.ready ? (
        <Loading text="Loading auth..." />
      ) : (
        <ErrorBoundary>
          <Switch>
            <PrivateRoute exact path="/" component={Home} />
            <Route path="/auth" component={Auth} />
            <PrivateRoute path="/q" component={Question} />
            <PrivateRoute path="/settings" component={Settings} admin />
            <PrivateRoute path="/user" component={User} />
            <PrivateRoute component={NotFound} />
          </Switch>
        </ErrorBoundary>
      )}
    </div>
  )
}

export default AppBody
