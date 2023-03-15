import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { ApolloProvider } from '@apollo/react-hooks'
import { persistCache } from 'apollo-cache-persist'

import { apollo, apolloCache } from '@services'

import 'normalize.css'

import App from '@scenes/App'

persistCache({
  cache: apolloCache,
  storage: window.localStorage
}).then(() => {
  ReactDOM.render(
    <ApolloProvider client={apollo}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloProvider>,
    document.getElementById('root')
  )
})
