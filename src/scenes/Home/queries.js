import { gql } from 'apollo-boost'

export const getAllNodes = gql`
  query {
    allZNodes {
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
