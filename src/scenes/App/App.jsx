import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Helmet from 'react-helmet'

import { ConfigurationProvider } from 'services/configuration'

import Auth from 'scenes/Auth'
import Home from 'scenes/Home'
import Question from 'scenes/Question'
import UserProfile from 'scenes/UserProfile'
import Settings from 'scenes/Settings'
import NotFound from 'scenes/NotFound'

import { AlertStack, AlertProvider, PrivateRoute } from 'components'

import Navbar from './components/Navbar'
import Footer from './components/Footer'

import 'styles'

const App = () => (
  <div className="app theme">
    <AlertProvider>
      <Helmet>
        <title>FAQ</title>
      </Helmet>
      <Navbar />
      <div className="main">
        <ConfigurationProvider>
          <Switch>
            <PrivateRoute exact path="/" component={Home} />
            <Route path="/auth" component={Auth} />
            <PrivateRoute path="/q" component={Question} />
            <PrivateRoute path="/user-profile" component={UserProfile} />
            <PrivateRoute path="/settings" component={Settings} admin />
            <PrivateRoute component={NotFound} />
          </Switch>
        </ConfigurationProvider>
      </div>
      <Footer />
      <AlertStack />
    </AlertProvider>
  </div>
)

export default App
