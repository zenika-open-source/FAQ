import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

export const getAllPersonalData = gql`
  query {
    me {
      id
      createdAt
      email
      name
      picture
      history {
        id
        action
        model
        meta
        createdAt
        node {
          id
          question {
            id
            title
          }
        }
      }
    }
  }
`

export const updateIdentityMutation = gql`
  mutation updateIdentity($name: String!, $email: String!, $picture: String!) {
    updateMe(name: $name, email: $email, picture: $picture) {
      id
    }
  }
`

export const updateIdentity = graphql(updateIdentityMutation, {
  name: 'updateIdentity',
  props: ({ updateIdentity }) => ({
    updateIdentity: identity => {
      return updateIdentity({ variables: identity })
    }
  })
})
