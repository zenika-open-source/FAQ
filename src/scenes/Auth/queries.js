import { gql } from 'apollo-boost'

export const authUser = gql`
  mutation authUser($accessToken: String!, $idToken: String!) {
    authenticateUser(accessToken: $accessToken, idToken: $idToken) {
      id
      token
    }
  }
`
