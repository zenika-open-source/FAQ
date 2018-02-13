import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import theme from 'toolbox/theme'
import ThemeProvider from 'react-toolbox/lib/ThemeProvider'
import 'toolbox/theme.css'

import Navbar from './components/Navbar'

import Login from 'scenes/Login'
import Home from 'scenes/Home'

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

const mapStateToProps = ({ data: { auth } }) => ({
  auth: auth
})

export default connect(mapStateToProps)(App)
