import { gql } from 'apollo-boost'

export const getNode = gql`
  query getNode($id: ID!) {
    ZNode(id: $id) {
      id
      question {
        id
        title
      }
      answer {
        id
        content
      }
    }
  }
`
