import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'

import theme from 'toolbox/theme'
import ThemeProvider from 'react-toolbox/lib/ThemeProvider'
import 'toolbox/theme.css'

import { auth } from 'services'

import Auth, { AccessToken } from 'scenes/Auth'
import Home from 'scenes/Home'
import Question from 'scenes/Question'
import NotFound from 'scenes/NotFound'

import PrivateRoute from 'components/PrivateRoute'

import Navbar from './components/Navbar'

import './style.css'

class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      user: null
    }
  }

  checkUserLoaded () {
    const user = this.state.user

    if (auth.isAuthenticated() && !user) {
      auth.getProfile((err, profile) => {
        if (err) alert(err)
        this.setState({ user: profile })
      })
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
      <ThemeProvider theme={theme}>
        <div>
          <Navbar user={this.state.user} />
          <div className="Main">
            {/* ROUTES */}
            <Switch>
              {/* HOME */}
              <PrivateRoute exact path="/" component={Home} />
              {/* AUTH */}
              <Route path="/auth" component={Auth} />
              <Route path="/access_token=:rest" component={AccessToken} />
              <Route path="/error=:rest" component={AccessToken} error={true} />
              {/* QUESTIONS */}
              <PrivateRoute path="/q" component={Question} />
              {/* 404 */}
              <PrivateRoute component={NotFound} />
            </Switch>
          </div>
        </div>
      </ThemeProvider>
    )
  }
}

export default App
