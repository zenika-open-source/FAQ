import { gql } from 'apollo-boost'
import { graphql } from 'react-apollo'

export const getAllNodesQuery = gql`
  query {
    allZNodes(orderBy: createdAt_DESC, first: 30) {
      id
      question {
        id
        title
        slug
        user {
          id
          picture
          name
        }
        createdAt
      }
      answer {
        id
        content
      }
      flags {
        id
        type
      }
    }
  }
`

export const getListNodesQuery = gql`
  query getListNodes($ids: [ID!]!) {
    allZNodes(filter: { id_in: $ids }) {
      id
      question {
        id
        title
        slug
        user {
          id
          picture
          name
        }
        createdAt
      }
      answer {
        id
        content
      }
      flags {
        id
        type
      }
    }
  }
`

export const getAllNodes = graphql(getAllNodesQuery)
