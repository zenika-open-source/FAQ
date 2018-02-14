import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
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
  render () {
    const { user, userLoaded } = this.props
    return (
      <div className="App">
        <Router>
          <ThemeProvider theme={theme}>
            <div>
              <Navbar />
              <div style={{ flex: 1, overflowY: 'auto', padding: '1.8rem' }}>
                <Switch>
                  <PrivateRoute
                    exact
                    path="/"
                    render={() => {
                      if (auth.isAuthenticated() && !user) {
                        auth.getProfile((err, profile) => {
                          if (err) alert(err)
                          userLoaded(profile)
                        })
                      }
                      return user ? <Home /> : <div>Loading user...</div>
                    }}
                  />
                  <Route path="/auth" component={Auth} />
                  <Route render={() => 404} />
                </Switch>
              </div>
            </div>
          </ThemeProvider>
        </Router>
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(App)
