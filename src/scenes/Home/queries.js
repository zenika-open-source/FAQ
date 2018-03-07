import { gql } from 'apollo-boost'
import { graphql } from 'react-apollo'

export const getAllNodesQuery = gql`
  query {
    allZNodes(orderBy: createdAt_DESC) {
      id
      question {
        id
        title
        slug
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

export const getAllNodes = graphql(getAllNodesQuery)
