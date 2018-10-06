import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Helmet from 'react-helmet'

import { ConfigurationProvider } from 'services/configuration'

import Auth from 'scenes/Auth'
import Home from 'scenes/Home'
import Question from 'scenes/Question'
import UserProfile from 'scenes/UserProfile'
import NotFound from 'scenes/NotFound'

import PrivateRoute from 'components/PrivateRoute'

import Navbar from './components/Navbar'
import Footer from './components/Footer'

import 'styles'

const App = () => (
  <div className="app theme">
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
          <PrivateRoute component={NotFound} />
        </Switch>
      </ConfigurationProvider>
    </div>
    <Footer />
  </div>
)

export default App
