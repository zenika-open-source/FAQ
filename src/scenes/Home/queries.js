import gql from 'graphql-tag'

export const getAllNodes = gql`
  query {
    zNodes(orderBy: createdAt_DESC, first: 30) {
      id
      question {
        id
        title
        slug
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
  query($ids: [ID!]!) {
    zNodes(where: { id_in: $ids }) {
      id
      question {
        id
        title
        slug
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
