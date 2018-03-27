import { gql } from 'apollo-boost'
import { graphql } from 'react-apollo'

import { auth, routing } from 'services'

import { getNodeQuery } from 'scenes/Question/queries'

export const createFlagQuery = gql`
  mutation createFlag($type: String!, $nodeId: ID!, $userId: ID!) {
    createFlag(type: $type, nodeId: $nodeId, userId: $userId) {
      id
    }
  }
`

export const createFlag = graphql(createFlagQuery, {
  name: 'createFlag',
  props: ({ createFlag }) => ({
    createFlag: (type, nodeId) => {
      return createFlag({
        variables: {
          type,
          nodeId,
          userId: auth.getUserNodeId()
        }
      })
    }
  }),
  options: props => ({
    refetchQueries: [
      {
        query: getNodeQuery,
        variables: {
          id: routing.getUIDFromSlug(props.match)
        }
      }
    ]
  })
})
