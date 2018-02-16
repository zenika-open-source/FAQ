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
  uri: 'https://api.graph.cool/simple/v1/cjdpzliff12pj01431oz29kwn'
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
