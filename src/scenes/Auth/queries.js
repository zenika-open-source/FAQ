import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

export const authUserQuery = gql`
  mutation($idToken: String!) {
    authenticate(idToken: $idToken) {
      id
      auth0Id
      name
      email
      picture
      locale
    }
  }
`

export const authUser = graphql(authUserQuery, {
  props: ({ mutate }) => ({
    authQL: idToken => {
      return mutate({ variables: { idToken } })
    }
  })
})
