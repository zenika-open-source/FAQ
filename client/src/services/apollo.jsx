import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  useQuery,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'

import { LocalStorageWrapper, persistCache } from 'apollo3-cache-persist'
import routing from './routing'

const apolloCache = new InMemoryCache()

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      // eslint-disable-next-line no-console
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}. Please refresh the page.`,
      )
    })
  }
  if (networkError) {
    // eslint-disable-next-line no-console
    console.error('[Network error] Please refresh the page.', networkError)
  }
})

const authLink = setContext((_, { headers }) => {
  let token = localStorage.accessToken || null
  if (import.meta.env.VITE_DISABLE_AUTH === 'true' && localStorage.user) {
    token = JSON.parse(localStorage.user).id
  }
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
      'faq-tenant': routing.getPrismaService(),
    },
  }
})

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_GRAPHQL_ENDPOINT || '/gql',
})

const cache = apolloCache

await persistCache({
  cache,
  storage: new LocalStorageWrapper(window.localStorage),
})

const apolloClient = new ApolloClient({
  cache: apolloCache,
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
})

const query =
  (gqlQuery, { variables, skip, parse, ...queryProps } = {}) =>
  (Wrapped) => {
    const ApolloQueryWrapper = (props) => {
      const { loading, error, data } = useQuery(gqlQuery, {
        variables: variables ? variables(props) : {},
        skip: skip ? skip(props) : false,
        pollInterval: 60 * 1000, // Poll every min
        ...queryProps,
      })

      let parsedData = parse && data ? parse(data) : data

      return (
        <Wrapped
          {...props}
          loading={loading && Object.values(data || {}).length === 0}
          error={error}
          {...parsedData}
        />
      )
    }

    return ApolloQueryWrapper
  }

const ApolloWrapper = ({ children }) => {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
}

export default ApolloWrapper
export { apolloCache, query }
