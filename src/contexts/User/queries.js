import gql from 'graphql-tag'

export const me = gql`
  query {
    me {
      id
      auth0Id
      name
      email
      picture
      currentGroup {
        id
        name
      }
    }
  }
`
