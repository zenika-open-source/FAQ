import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

import { auth } from 'services'

export const getAllPersonalDataQuery = gql`
  query getAllPersonalData($userId: ID!) {
    User(id: $userId) {
      id
      createdAt
      email
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

export const updateIdentityMutation = gql`
  mutation updateIdentity(
    $id: ID!,
    $name: String!,
    $email: String!,
    $picture: String!
  ) {
    updateUser(
      id: $id,
      name: $name,
      email: $email,
      picture: $picture
    ) {
      id
    }
  }
`

export const updateIdentity = graphql(updateIdentityMutation, {
  name: 'updateIdentity',
  props: ({ updateIdentity }) => ({
    updateIdentity: (id, identity) => {
      return updateIdentity({ variables: { id, ...identity } })
    }
  })
})
