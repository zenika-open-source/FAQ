import React from 'react'
import { Helmet } from 'react-helmet-async'

import { useConfiguration } from 'services'
import { AlertStack } from 'components'

import { Navbar } from './components'

import AppBody from './AppBody'

import 'styles'

const App = () => {
  const conf = useConfiguration()

  return (
    <div className="app theme">
      <Helmet>
        <title>FAQ {conf?.title || ''}</title>
      </Helmet>
      <Navbar />
      <AppBody />
      <AlertStack />
    </div>
  )
}

export default App
