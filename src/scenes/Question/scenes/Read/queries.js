import { gql } from 'apollo-boost'

export const getNode = gql`
  query getNode($id: ID!) {
    ZNode(id: $id) {
      id
      question {
        id
        title
        user {
          id
          name
          picture
        }
        updatedAt
      }
      answer {
        id
        content
        user {
          id
          name
          picture
        }
        updatedAt
      }
    }
  }
`
