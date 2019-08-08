/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react'
import { Query } from 'react-apollo'

import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import { ApolloLink } from 'apollo-link'
import { setContext } from 'apollo-link-context'

import routing from './routing'

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
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network'
    }
  }
})

const query = (query, { variables, skip, parse, ...queryProps } = {}) => Wrapped => {
  const ApolloQueryWrapper = props => (
    <Query
      query={query}
      skip={skip ? skip(props) : false}
      variables={variables ? variables(props) : {}}
      {...queryProps}
    >
      {({ loading, error, data }) => {
        data = parse && data ? parse(data) : data
        return <Wrapped {...props} {...{ loading, error, ...data }} />
      }}
    </Query>
  )
  return ApolloQueryWrapper
}

const useMutation = mutation => {
  const [response, setResponse] = useState({ loading: false, variables: null })

  const mutate = variables => {
    return new Promise((resolve, reject) => {
      setResponse({ ...response, loading: true, variables })
      apollo
        .mutate({ mutation, variables })
        .then(resp => {
          if (mounted) {
            const newResponse = { ...response, ...resp, loading: false }
            setResponse(newResponse)
            resolve(newResponse)
          }
        })
        .catch(reject)
    })
  }

  let mounted = true
  useEffect(() => {
    return () => {
      // This file will soon be replaced using @apollo/react-hooks
      // This is currently working, so I won't try to change this
      // eslint-disable-next-line
      mounted = false
    }
  }, [])

  return [response, mutate]
}

export default apollo

export { query, useMutation }
