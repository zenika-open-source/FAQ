import { gql } from 'apollo-boost'
import { graphql } from 'react-apollo'

export const authUserQuery = gql`
  mutation authUser($accessToken: String!, $idToken: String!) {
    authenticateUser(accessToken: $accessToken, idToken: $idToken) {
      id
      token
    }
  }
`

export const authUser = graphql(authUserQuery, {
  props: ({ mutate }) => ({
    authQL: (accessToken, idToken) => {
      return mutate({ variables: { accessToken, idToken } })
    }
  })
})
