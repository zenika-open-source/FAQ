import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

export const createFlagMutation = gql`
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

export const removeFlagMutation = gql`
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

export const incrementViewsCounterMutation = gql`
  mutation($questionId: ID!) {
    incrementQuestionViewsCounter(id: $questionId) {
      id
      views
    }
  }
`

export const createFlag = graphql(createFlagMutation, {
  name: 'createFlag',
  props: ({ createFlag }) => ({
    createFlag: (type, nodeId) => {
      return createFlag({
        variables: {
          type,
          nodeId
        }
      })
    }
  })
})

export const removeFlag = graphql(removeFlagMutation, {
  name: 'removeFlag',
  props: ({ removeFlag }) => ({
    removeFlag: (type, nodeId) => {
      return removeFlag({
        variables: {
          type,
          nodeId
        }
      })
    }
  })
})

export const incrementViewsCounter = graphql(incrementViewsCounterMutation, {
  name: 'incrementViewsCounter',
  props: ({ incrementViewsCounter }) => ({
    incrementViewsCounter: questionId => {
      return incrementViewsCounter({
        variables: {
          questionId
        }
      })
    }
  })
})
