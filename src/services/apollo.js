/* eslint-disable react/display-name */
import React from 'react'
import { Query } from 'react-apollo'

import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import { ApolloLink } from 'apollo-link'
import { setContext } from 'apollo-link-context'

import auth from './auth'
import { Loading } from 'components'

const apollo = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.map(({ message, locations, path }) =>
          // eslint-disable-next-line no-console
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        )
      }
      // eslint-disable-next-line no-console
      if (networkError) console.log(`[Network error]: ${networkError}`)
    }),
    setContext((_, { headers }) => {
      const token = auth.session ? auth.session.idToken : null
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : ''
        }
      }
    }),
    new HttpLink({
      uri: process.env.REACT_APP_GRAPHQL_ENDPOINT
    })
  ]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network'
    }
  }
})

const query = (
  query,
  { variables, skip, loadingText } = {}
) => Component => props => {
  const queryName = query.definitions[0].selectionSet.selections[0].name.value
  return (
    <Query
      query={query}
      skip={skip ? skip(props) : false}
      variables={variables ? variables(props) : {}}
    >
      {({ loading, error, data }) => {
        if (loading && !data[queryName]) {
          return <Loading text={loadingText || null} />
        }
        if (error) return <div>Error :(</div>

        return <Component {...props} {...data} />
      }}
    </Query>
  )
}

export default apollo

export { query }
