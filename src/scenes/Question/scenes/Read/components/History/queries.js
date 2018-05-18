import gql from 'graphql-tag'

export const loadHistoryQuery = gql`
  query($nodeId: ID!) {
    allHistoryActions(filter: { node: { id: $nodeId } }) {
      id
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
