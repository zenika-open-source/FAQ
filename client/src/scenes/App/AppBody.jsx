import React from 'react'
import { Route, Switch } from 'react-router-dom'

import Auth from 'scenes/Auth'
import Home from 'scenes/Home'
import Question from 'scenes/Question'
import UserProfile from 'scenes/UserProfile'
import Settings from 'scenes/Settings'
import NotFound from 'scenes/NotFound'

import { PrivateRoute, Loading } from 'components'

import { useIntl } from 'services'
import { useConfiguration, useAuth } from 'contexts'

const AppBody = () => {
  const intl = useIntl(AppBody)

  const conf = useConfiguration()
  const auth = useAuth()

  return (
    <div className="main">
      {conf.loading || !auth.ready ? (
        <Loading text={intl('loading')} />
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

AppBody.translations = {
  en: { loading: 'Preparing the questions...' },
  fr: { loading: 'Préparation des questions...' }
}

export default AppBody
