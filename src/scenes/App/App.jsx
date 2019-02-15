import React from 'react'
import { Route, Switch } from 'react-router-dom'

import { ConfigurationProvider, AuthProvider, UserProvider } from 'contexts'

import Auth from 'scenes/Auth'
import Home from 'scenes/Home'
import Question from 'scenes/Question'
import UserProfile from 'scenes/UserProfile'
import Settings from 'scenes/Settings'
import NotFound from 'scenes/NotFound'

import { AlertStack, AlertProvider, PrivateRoute, Loading } from 'components'

import Navbar from './components/Navbar'
import Footer from './components/Footer'

import 'styles'

const App = () => (
  <div className="app theme">
    <AlertProvider>
      <ConfigurationProvider>
        {conf => (
          <AuthProvider>
            <UserProvider>
              <Navbar />
              <div className="main">
                {conf.loading ? (
                  <Loading text="Retrieving configuration..." />
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
              <Footer />
            </UserProvider>
          </AuthProvider>
        )}
      </ConfigurationProvider>
      <AlertStack />
    </AlertProvider>
  </div>
)

export default App
