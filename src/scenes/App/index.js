import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'

import theme from 'toolbox/theme'
import ThemeProvider from 'react-toolbox/lib/ThemeProvider'
import 'toolbox/theme.css'

import { auth } from 'services'

import Auth, { AccessToken } from 'scenes/Auth'
import Home from 'scenes/Home'
import Question from 'scenes/Question'

import PrivateRoute from 'components/PrivateRoute'
import Navbar from './components/Navbar'

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
          <Navbar />
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.8rem' }}>
            {/* ROUTES */}
            <Switch>
              {/* HOME */}
              <PrivateRoute exact path="/" component={Home} />
              {/* AUTH */}
              <Route path="/auth" component={Auth} />
              <Route path="/access_token=:rest" component={AccessToken} />
              {/* QUESTIONS */}
              <PrivateRoute path="/q" component={Question} />
              {/* 404 */}
              <PrivateRoute render={() => 404} />
            </Switch>
          </div>
        </div>
      </ThemeProvider>
    )
  }
}

export default App
