import { gql } from '@apollo/client'

export const CREATE_FLAG = gql`
  mutation($type: String!, $nodeId: ID!) {
    addFlag(type: $type, nodeId: $nodeId) {
      id
      flags {
        id
        type
        user {
          id
          name
        }
        createdAt
      }
    }
  }
`

export const REMOVE_FLAG = gql`
  mutation($type: String!, $nodeId: ID!) {
    removeFlag(type: $type, nodeId: $nodeId) {
      id
      flags {
        id
        type
        user {
          id
          name
        }
        createdAt
      }
    }
  }
`

export const INCREMENT_VIEWS_COUNTER = gql`
  mutation($questionId: ID!) {
    incrementQuestionViewsCounter(id: $questionId) {
      id
      views
    }
  }
`
