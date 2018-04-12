import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

import { auth } from 'services'

export const getAllPersonalDataQuery = gql`
  query getAllPersonalData($userId: ID!) {
    User(id: $userId) {
      createdAt
      email
      familyName
      givenName
      name
      picture
      flags {
        id
        createdAt
        type
        node {
          id
          question {
            id
            title
          }
        }
      }
      answers {
        id
        createdAt
        node {
          id
          question {
            id
            title
            slug
          }
        }
      }
      questions {
        id
        createdAt
        node {
          id
          question {
            id
            title
            slug
          }
        }
      }
    }
  }
`

export const getAllPersonalData = graphql(getAllPersonalDataQuery, {
  options: props => ({ variables: { userId: auth.getUserNodeId() } })
})
