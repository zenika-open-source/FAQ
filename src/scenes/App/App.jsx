import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import Helmet from 'react-helmet'

import { auth } from 'services'
import { apolloWatcher } from 'services/apollo'

import { getAllNodesQuery } from 'scenes/Home/queries'
import { getNodeQuery } from 'scenes/Question/queries'

import Auth from 'scenes/Auth'
import Home from 'scenes/Home'
import Question from 'scenes/Question'
import UserProfile from 'scenes/UserProfile'
import NotFound from 'scenes/NotFound'

import PrivateRoute from 'components/PrivateRoute'

import Navbar from './components/Navbar'
import Footer from './components/Footer'

import 'styles'

class App extends Component {
  constructor (props) {
    super(props)

    this.subscribed = false
  }

  subscribeToChanges () {
    apolloWatcher.watch('ZNode', 'CREATED', getAllNodesQuery)
    apolloWatcher.watch('Question', 'UPDATED', getNodeQuery)
    apolloWatcher.watch('Answer', '*', getNodeQuery)
    apolloWatcher.watch('Flag', 'CREATED', getNodeQuery)
    apolloWatcher.start()
  }

  componentDidMount () {
    if (!this.subscribed && auth.isAuthenticated()) {
      this.subscribeToChanges()
      this.subscribed = true
    }
  }

  componentDidUpdate = this.componentDidMount

  render () {
    return (
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
            <PrivateRoute path="/user-profile" component={UserProfile} />
            <PrivateRoute component={NotFound} />
          </Switch>
        </div>
        <Footer />
      </div>
    )
  }
}

export default App
