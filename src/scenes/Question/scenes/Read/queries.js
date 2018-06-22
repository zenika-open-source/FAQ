import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

import { apollo, auth, history } from 'services'

import { getNodeQuery } from '../../queries'

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

export const removeFlagQuery = gql`
  mutation removeFlag($type: String!, $nodeId: ID!) {
    removeFlag(type: $type, nodeId: $nodeId) {
      id
      type
      nodeId
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
        }
      })
    }
  }),
  options: {
    onCompleted: ({ createFlag }) => {
      history.addAction(
        'CREATED',
        'Flag',
        { type: createFlag.type },
        createFlag.node.id
      )
    }
  }
})

export const removeFlag = graphql(removeFlagQuery, {
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
  }),
  options: {
    onCompleted: ({ removeFlag }) => {
      history.addAction(
        'DELETED',
        'Flag',
        { type: removeFlag.type },
        removeFlag.nodeId
      )
      // Update cache
      apollo.query({
        query: getNodeQuery,
        variables: { id: removeFlag.nodeId },
        fetchPolicy: 'network-only'
      })
    }
  }
})
