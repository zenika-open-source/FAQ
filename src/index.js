import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import App from './scenes/App'
import store from './store'

import './index.css'

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)

// TODO:
// * Retrieve user profile (img,...)
// * Refact data/auth => data/user ?
// * Push !
