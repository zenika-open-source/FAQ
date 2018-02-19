import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'

import App from './scenes/App'
import store from './store'

import './index.css'

const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_URI
})

ReactDOM.render(
  <Provider store={store}>
    <ApolloProvider client={client}>
      <Router>
        <App />
      </Router>
    </ApolloProvider>
  </Provider>,
  document.getElementById('root')
)
