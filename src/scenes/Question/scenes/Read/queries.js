import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

import { auth } from 'services'

export const createFlagQuery = gql`
  mutation createFlag($type: String!, $nodeId: ID!, $userId: ID!) {
    createFlag(type: $type, nodeId: $nodeId, userId: $userId) {
      id
      type
      node {
        id
      }
      user {
        id
      }
      createdAt
    }
  }
`

export const createFlag = graphql(createFlagQuery, {
  name: 'createFlag',
  props: ({ createFlag }) => ({
    createFlag: (type, nodeId) => {
      const userId = auth.getUserNodeId()
      return createFlag({
        variables: {
          type,
          nodeId,
          userId
        },
        optimisticResponse: {
          __typename: 'Mutation',
          createFlag: {
            id: -1,
            __typename: 'Flag',
            type,
            node: {
              __typename: 'ZNode',
              id: nodeId
            },
            user: {
              __typename: 'User',
              id: userId
            },
            createdAt: new Date()
          }
        }
      })
    }
  })
})
