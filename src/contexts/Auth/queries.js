import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

export const authUserMutation = gql`
  mutation($idToken: String!, $group: String) {
    authenticate(idToken: $idToken, group: $group) {
      id
      auth0Id
      admin
      name
      email
      picture
    }
  }
`

export const authUser = graphql(authUserMutation, {
  props: ({ mutate }) => ({
    authQL: (idToken, group) => {
      return mutate({ variables: { idToken, group } })
    }
  })
})
