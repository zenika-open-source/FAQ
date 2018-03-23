import { gql } from 'apollo-boost'
import { graphql } from 'react-apollo'

import { auth } from 'services'

export const getNodeQuery = gql`
  query getNode($slug: String!) {
    allQuestions(filter: { slug_in: [$slug] }) {
      node {
        id
        question {
          id
          title
          slug
          user {
            id
            name
            picture
          }
          createdAt
        }
        answer {
          id
          content
          sources {
            id
            label
            url
          }
          user {
            id
            name
            picture
          }
          createdAt
        }
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
  }
`

export const createFlagQuery = gql`
  mutation createFlag($type: String!, $nodeId: ID!, $userId: ID!) {
    createFlag(type: $type, nodeId: $nodeId, userId: $userId) {
      id
    }
  }
`

export const getNode = graphql(getNodeQuery, {
  props: ({ data: { allQuestions, ...rest } }) => ({
    data: {
      ZNode: allQuestions
        ? allQuestions.length >= 1 ? allQuestions[0].node : null
        : undefined,
      ...rest
    }
  }),
  skip: props => !props.match.params.slug,
  options: props => ({ variables: { slug: props.match.params.slug } })
})

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
          slug: props.match.params.slug
        }
      }
    ]
  })
})
