import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Helmet from 'react-helmet'

import Auth from 'scenes/Auth'
import Home from 'scenes/Home'
import Question from 'scenes/Question'
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
      <Switch>
        <PrivateRoute exact path="/" component={Home} />
        <Route path="/auth" component={Auth} />
        <PrivateRoute path="/q" component={Question} />
        <PrivateRoute component={NotFound} />
      </Switch>
    </div>
    <Footer />
  </div>
)

export default App
