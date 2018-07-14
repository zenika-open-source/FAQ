import gql from 'graphql-tag'

export const loadHistoryQuery = gql`
  query($nodeId: ID!) {
    historyActions(where: { node: { id: $nodeId } }) {
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
