import { gql } from '@apollo/client'

export const AUTHENTICATE_MUTATION = gql`
  mutation($idToken: String!) {
    authenticate(idToken: $idToken) {
      id
      auth0Id
      admin
      name
      email
      picture
    }
  }
`
