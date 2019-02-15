import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

export const me = gql`
  query {
    me {
      id
      email
      name
      picture
      currentGroup {
        id
        name
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
