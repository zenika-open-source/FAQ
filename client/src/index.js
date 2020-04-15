import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client'
import { persistCache } from 'apollo-cache-persist'
import { HelmetProvider } from 'react-helmet-async'

import 'normalize.css'

import { apollo, apolloCache, AuthProvider } from 'services'
import { AlertProvider } from 'components'

import App from './scenes/App'

persistCache({
  cache: apolloCache,
  storage: window.localStorage
}).then(() => {
  ReactDOM.render(
    <HelmetProvider>
      <AlertProvider>
        <ApolloProvider client={apollo}>
          <BrowserRouter>
            <AuthProvider>
              <App />
            </AuthProvider>
          </BrowserRouter>
        </ApolloProvider>
      </AlertProvider>
    </HelmetProvider>,
    document.getElementById('root')
  )
})
