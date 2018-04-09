import { gql } from 'apollo-boost'
import { graphql } from 'react-apollo'

import auth from '../../services/auth'

export const getAllPersonalDataQuery = gql`
  query getAllPersonalData($auth0UserId: String!) {
    User(auth0UserId: $auth0UserId) {
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
          question {
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
            title
            slug
          }
        }
      }
    }
  }
`

export const getAllPersonalData = graphql(getAllPersonalDataQuery, {
  skip: props => !auth.getUserProfile(),
  options: props => ({variables: {auth0UserId: auth.getUserProfile().sub}})
})
