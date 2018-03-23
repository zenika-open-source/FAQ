import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import Helmet from 'react-helmet'

import { auth } from 'services'

import Auth from 'scenes/Auth'
import Home from 'scenes/Home'
import Question from 'scenes/Question'
import NotFound from 'scenes/NotFound'

import PrivateRoute from 'components/PrivateRoute'

import Navbar from './components/Navbar'

import 'styles'

class App extends Component {
  state = { user: null }

  checkUserLoaded () {
    const user = this.state.user

    if (auth.isAuthenticated() && !user) {
      auth
        .getProfile()
        .then(profile => {
          this.setState({ user: profile })
        })
        .catch(err => alert(err))
    }
  }

  componentDidMount () {
    this.checkUserLoaded()
  }

  componentDidUpdate () {
    this.checkUserLoaded()
  }

  render () {
    return (
      <div className="app theme">
        <Helmet>
          <title>FAQ</title>
        </Helmet>
        <Navbar user={this.state.user} />
        <div className="main">
          <Switch>
            <PrivateRoute exact path="/" component={Home} />
            <Route path="/auth" component={Auth} />
            <PrivateRoute path="/q" component={Question} />
            <PrivateRoute component={NotFound} />
          </Switch>
        </div>
      </div>
    )
  }
}

export default App
