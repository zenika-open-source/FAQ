import { persistCache } from 'apollo-cache-persist'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import { apolloCache } from 'services'

import 'normalize.css'

import App from 'scenes/App'
import ApolloWrapper from 'services/apollo'

persistCache({
  cache: apolloCache,
  storage: window.localStorage
}).then(() => {
  ReactDOM.render(
    <ApolloWrapper>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloWrapper>,
    document.getElementById('root')
  )
})
