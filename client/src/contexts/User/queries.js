import gql from 'graphql-tag'

export const GET_ME = gql`
  query {
    me {
      id
      auth0Id
      name
      email
      picture
    }
  }
`
