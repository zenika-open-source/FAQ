import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Route, Switch, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import theme from 'toolbox/theme'
import ThemeProvider from 'react-toolbox/lib/ThemeProvider'
import 'toolbox/theme.css'

import auth from 'auth'

import { userLoaded } from 'data/user/actions'

import Auth, { AccessToken } from 'scenes/Auth'
import Root from 'scenes/Root'

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
    return (
      <ThemeProvider theme={theme}>
        <div>
          <Navbar />
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.8rem' }}>
            <Switch>
              <Route path="/auth" component={Auth} />
              <Route path="/access_token=:rest" component={AccessToken} />
              <PrivateRoute component={Root} />
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
