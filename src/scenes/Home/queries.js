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

export const getListNodes = gql`
  query getListNodes($ids: [ID!]!) {
    allQuestions(filter: { id_in: $ids }) {
      id
      node {
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
  }
`
