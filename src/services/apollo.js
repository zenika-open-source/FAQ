import ApolloClient from 'apollo-client'
import { split } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import { InMemoryCache } from 'apollo-cache-inmemory'
import gql from 'graphql-tag'

const httpLink = new HttpLink({
  uri: process.env.REACT_APP_GRAPHCOOL_URI
})

/* const wsLink = new WebSocketLink({
  uri: process.env.REACT_APP_GRAPHCOOL_URI_WS,
  options: { reconnect: true }
}) */

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return true
    // return kind === 'OperationDefinition' && operation === 'subscription'
  },
  // wsLink,
  httpLink
)

const cache = new InMemoryCache()

const apollo = new ApolloClient({ link, cache })
// const apollo = new ApolloClient({ httpLink, cache })

const subscribeToNodes = gql`
  subscription {
    ZNode {
      mutation
      node {
        id
      }
    }
  }
`

const subscribeToQuestions = gql`
  subscription {
    Question {
      mutation
      node {
        id
        node {
          id
        }
      }
    }
  }
`

const subscribeToAnswers = gql`
  subscription {
    Answer {
      mutation
      node {
        id
        node {
          id
        }
      }
    }
  }
`

const subscribeToFlags = gql`
  subscription {
    Flag {
      mutation
      node {
        node {
          id
        }
      }
    }
  }
`

const subscribeToTags = gql`
  subscription {
    Tag {
      mutation
      node {
        node {
          id
        }
      }
    }
  }
`

class ApolloWatcher {
  hooks = []

  start () {
    return
    const subscriptions = [
      subscribeToNodes,
      subscribeToQuestions,
      subscribeToAnswers,
      subscribeToFlags,
      subscribeToTags
    ]

    subscriptions.forEach(query => {
      apollo.subscribe({ query }).subscribe({
        next: ({ data }) => this.onMutation(data)
      })
    })
  }

  onMutation (data) {
    return
    const model = Object.keys(data)[0]
    const mutation = data[model].mutation
    const node = data[model].node
    const id = node ? (node.node ? node.node.id : node.id) : null

    this.hooks.forEach(hook => {
      if (hook.model !== model) return
      if (hook.mutation !== mutation && hook.mutation !== '*') return

      const query = hook.query
      const variables = hook.variablesFunc ? hook.variablesFunc(node) : { id }

      apollo.query({ query, variables, fetchPolicy: 'network-only' })
    })
  }

  watch (model, mutation, query, variablesFunc) {
    this.hooks.push({ model, mutation, query, variablesFunc })
  }
}

const apolloWatcher = new ApolloWatcher()

export default apollo

export { apolloWatcher }
