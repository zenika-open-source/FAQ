import React from 'react'

import { ConfigurationProvider, AuthProvider, UserProvider, GroupsProvider } from 'contexts'

import { AlertStack, AlertProvider } from 'components'

import Navbar from './components/Navbar'
import Footer from './components/Footer'

import AppBody from './AppBody'

import 'styles'

const App = () => (
  <div className="app theme">
    <AlertProvider>
      <ConfigurationProvider>
        <AuthProvider>
          <UserProvider>
            <GroupsProvider>
              <Navbar />
              <AppBody />
              <Footer />
            </GroupsProvider>
          </UserProvider>
        </AuthProvider>
      </ConfigurationProvider>
      <AlertStack />
    </AlertProvider>
  </div>
)

export default App
