/* eslint-disable react/display-name */
import React from 'react'
import { useQuery } from '@apollo/react-hooks'

import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import { ApolloLink } from 'apollo-link'
import { setContext } from 'apollo-link-context'

import routing from './routing'

const apolloCache = new InMemoryCache()

const apollo = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.map(({ message, locations, path }) =>
          // eslint-disable-next-line no-console
          console.error(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}. Please refresh the page.`
          )
        )
      }
      if (networkError) {
        // eslint-disable-next-line no-console
        console.error(`[Network error]: ${networkError}. Please refresh the page.`)
      }
    }),
    setContext((_, { headers }) => {
      const token = localStorage.accessToken || null
      return {
        headers: {
          ...headers,
          Authorization: token ? `Bearer ${token}` : '',
          'faq-tenant': routing.getPrismaService()
        }
      }
    }),
    new HttpLink({
      uri: process.env.REACT_APP_GRAPHQL_ENDPOINT
    })
  ]),
  cache: apolloCache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network'
    }
  }
})

const query = (query, { variables, skip, parse, ...queryProps } = {}) => Wrapped => {
  const ApolloQueryWrapper = props => {
    const { loading, error, data } = useQuery(query, {
      variables: variables ? variables(props) : {},
      skip: skip ? skip(props) : false,
      pollInterval: 60 * 1000, // Poll every min
      ...queryProps
    })

    let parsedData = parse && data ? parse(data) : data

    return (
      <Wrapped
        {...props}
        {...{ loading: loading && Object.values(data || {}).length === 0, error, ...parsedData }}
      />
    )
  }
  return ApolloQueryWrapper
}

export default apollo
export { query, apolloCache }
