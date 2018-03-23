import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter } from 'react-router-dom'
import { ApolloProvider } from 'react-apollo'

import { apollo } from 'services'

import 'normalize.css'

import App from './scenes/App'

ReactDOM.render(
  <ApolloProvider client={apollo}>
    <HashRouter>
      <App />
    </HashRouter>
  </ApolloProvider>,
  document.getElementById('root')
)
