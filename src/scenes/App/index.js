import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import theme from 'toolbox/theme'
import ThemeProvider from 'react-toolbox/lib/ThemeProvider'
import 'toolbox/theme.css'

import Login from 'scenes/Login'
import Home from 'scenes/Home'
import Navbar from 'components/Navbar'

class App extends Component {
  render () {
    const { user } = this.props.auth

    const body = user ? <Home /> : <Login />

    return (
      <div className="App">
        <ThemeProvider theme={theme}>
          <div>
            <Navbar />
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.8rem' }}>
              {body}
            </div>
          </div>
        </ThemeProvider>
      </div>
    )
  }
}

App.propTypes = {
  auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps)(App)
