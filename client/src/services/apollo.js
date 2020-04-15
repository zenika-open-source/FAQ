import React from 'react'
import { ApolloClient } from '@apollo/client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloLink } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import { setContext } from 'apollo-link-context'

import { getTenantName } from './tenant'
import { alert } from './alert'

const apolloCache = new InMemoryCache()

let wrongTenantRedirection = false
const tenantName = getTenantName()

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

        // If the tenant does not exists, we redirect
        if (
          networkError?.result?.extensions?.type === 'unknown-faq-tenant' &&
          !wrongTenantRedirection
        ) {
          wrongTenantRedirection = true
          alert.pushError(
            <>
              This tenant does not exists.
              <br />
              You will be redirected in 5 seconds.
            </>
          )
          if (process.env.NODE_ENV === 'production') {
            setTimeout(() => {
              window.location.href = `https://${process.env.REACT_APP_FAQ_URL}`
            }, 5000)
          }
        }
      }
    }),
    setContext((_, { headers }) => {
      const token = localStorage.idToken || null
      return {
        headers: {
          ...headers,
          Authorization: token ? `Bearer ${token}` : '',
          'faq-tenant': tenantName
        }
      }
    }),
    new HttpLink({
      uri: process.env.REACT_APP_SERVER_ENDPOINT
    })
  ]),
  cache: apolloCache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network'
    }
  }
})

export { apollo, apolloCache }
