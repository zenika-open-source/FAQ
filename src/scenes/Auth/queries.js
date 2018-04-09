import { gql } from 'apollo-boost'
import { graphql } from 'react-apollo'

export const authUserQuery = gql`
  mutation authUser($accessToken: String!, $idToken: String!, $consent: Consent!) {
    authenticateUser(accessToken: $accessToken, idToken: $idToken, consent: $consent) {
      id
      token
    }
  }
`

export const authUser = graphql(authUserQuery, {
  props: ({ mutate }) => ({
    authQL: (accessToken, idToken, consent) => {
      return mutate({ variables: { accessToken, idToken, consent } })
    }
  })
})
