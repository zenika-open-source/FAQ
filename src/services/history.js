import gql from 'graphql-tag'

import apollo from './apollo'
import auth from './auth'

const addActionQuery = gql`
  mutation addAction(
    $action: String!
    $model: String!
    $meta: Json
    $nodeId: ID!
    $userId: ID!
  ) {
    createHistoryAction(
      action: $action
      model: $model
      meta: $meta
      nodeId: $nodeId
      userId: $userId
    ) {
      id
    }
  }
`

export const loadHistoryQuery = gql`
  query($nodeId: ID!) {
    allHistoryActions(filter: { node: { id: $nodeId } }) {
      id
      node {
        id
      }
      action
      model
      meta
      user {
        id
        name
        picture
      }
      createdAt
    }
  }
`

const history = {
  addAction: (action, model, meta, nodeId) => {
    return apollo
      .mutate({
        mutation: addActionQuery,
        variables: { action, model, meta, nodeId, userId: auth.getUserNodeId() }
      })
      .then(() =>
        apollo.query({
          query: loadHistoryQuery,
          variables: { nodeId }
        })
      )
  }
}

export default history
