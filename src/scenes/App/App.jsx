import React from 'react'

import { ConfigurationProvider } from 'contexts'

import { AlertStack, AlertProvider } from 'components'

import AppBody from './AppBody'

import 'styles'

const App = () => (
  <div className="app theme">
    <AlertProvider>
      <ConfigurationProvider>
        <AppBody />
      </ConfigurationProvider>
      <AlertStack />
    </AlertProvider>
  </div>
)

export default App
