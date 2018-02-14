import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Route, Switch, Redirect, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import theme from 'toolbox/theme'
import ThemeProvider from 'react-toolbox/lib/ThemeProvider'
import 'toolbox/theme.css'

import auth from 'auth'

import { userLoaded } from 'data/user/actions'

import Home from 'scenes/Home'
import Auth from 'scenes/Auth'

import PrivateRoute from 'components/PrivateRoute'
import Navbar from './components/Navbar'

class App extends Component {
  checkUserLoaded () {
    const { user, userLoaded } = this.props

    if (auth.isAuthenticated() && !user) {
      auth.getProfile((err, profile) => {
        if (err) alert(err)
        userLoaded(profile)
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
    const { user } = this.props
    return (
      <ThemeProvider theme={theme}>
        <div>
          <Navbar />
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.8rem' }}>
            <Switch>
              <PrivateRoute
                exact
                path="/"
                render={() => {
                  return user ? <Home /> : <div>Loading user...</div>
                }}
              />
              <Route path="/auth" component={Auth} />
              <Route
                path="/access_token=:rest"
                render={props => {
                  /* Why this route ?
                    - We use HashRouter (because we have a static hosting)
                    - Auth0 do not allow a "query" responseMode
                    - Auth0 sends params as fragments (#) */
                  return (
                    <Redirect
                      to={{
                        pathname: '/auth/callback',
                        search: '?access_token=' + props.match.params.rest
                      }}
                    />
                  )
                }}
              />
              <Route render={() => 404} />
            </Switch>
          </div>
        </div>
      </ThemeProvider>
    )
  }
}

App.propTypes = {
  user: PropTypes.object,
  userLoaded: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  user: state.data.user
})

const mapDispatchToProps = dispatch => ({
  userLoaded: bindActionCreators(userLoaded, dispatch)
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))
