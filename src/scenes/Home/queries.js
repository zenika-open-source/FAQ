import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

export const getAllNodesQuery = gql`
  query {
    zNodes(orderBy: createdAt_DESC, first: 30) {
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
      tags {
        id
        label
      }
    }
  }
`

export const getListNodesQuery = gql`
  query getListNodes($ids: [ID!]!) {
    zNodes(filter: { id_in: $ids }) {
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
      tags {
        id
        label
      }
    }
  }
`

export const getAllNodes = graphql(getAllNodesQuery)
