import { gql } from 'apollo-boost'

export const getAllNodes = gql`
  query {
    allZNodes {
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
