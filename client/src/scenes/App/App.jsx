import React from 'react'
import { Helmet } from 'react-helmet'

import { ConfigurationProvider, AuthProvider, UserProvider } from 'contexts'

import { AlertStack, AlertProvider } from 'components'

import Navbar from './components/Navbar'
import Footer from './components/Footer'

import AppBody from './AppBody'

import 'styles'

const App = () => (
  <div className="app theme">
    <Helmet>
      <title>FAQ</title>
    </Helmet>
    <AlertProvider>
      <ConfigurationProvider>
        <AuthProvider>
          <UserProvider>
            <Navbar />
            <AppBody />
            <Footer />
          </UserProvider>
        </AuthProvider>
      </ConfigurationProvider>
      <AlertStack />
    </AlertProvider>
  </div>
)

export default App
