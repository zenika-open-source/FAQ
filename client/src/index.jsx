import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { persistCache, LocalStorageWrapper } from 'apollo3-cache-persist'

import { apolloCache } from 'services'

import 'normalize.css'

import App from 'scenes/App'
import ApolloWrapper from 'services/apollo'

const cache = apolloCache

const initializeApp = async () => {
  await persistCache({
    cache,
    storage: new LocalStorageWrapper(window.localStorage)
  })

  ReactDOM.render(
    <ApolloWrapper>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloWrapper>,
    document.getElementById('root')
  )
}

initializeApp()
