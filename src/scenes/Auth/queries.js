import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

export const authUserMutation = gql`
  mutation($idToken: String!) {
    authenticate(idToken: $idToken) {
      id
      auth0Id
      admin
      name
      email
      picture
      locale
    }
  }
`

export const authUser = graphql(authUserMutation, {
  props: ({ mutate }) => ({
    authQL: idToken => {
      return mutate({ variables: { idToken } })
    }
  })
})
