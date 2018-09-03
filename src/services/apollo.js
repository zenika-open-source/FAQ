/* eslint-disable react/display-name */
import React, { PureComponent } from 'react'
import { Query } from 'react-apollo'

import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import { ApolloLink } from 'apollo-link'
import { setContext } from 'apollo-link-context'

import auth from './auth'

const apollo = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError, operation }) => {
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

const query = (query, { variables, skip, ...queryProps } = {}) => Wrapped => {
  return class extends PureComponent {
    render() {
      const props = this.props
      return (
        <Query
          query={query}
          skip={skip ? skip(props) : false}
          variables={variables ? variables(props) : {}}
          {...queryProps}
        >
          {({ loading, error, data }) => (
            <Wrapped {...props} {...{ loading, error, ...data }} />
          )}
        </Query>
      )
    }
  }
}

export default apollo

export { query }
