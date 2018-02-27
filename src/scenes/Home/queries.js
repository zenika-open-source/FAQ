import { gql } from 'apollo-boost'

export const getAllNodes = gql`
  query {
    allZNodes(orderBy: createdAt_DESC) {
      id
      question {
        id
        title
        user {
          id
          picture
        }
      }
      answer {
        id
        content
      }
    }
  }
`
