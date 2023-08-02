import { gql } from '@apollo/client'

export const GET_ME = gql`
  query {
    me {
      id
      auth0Id
      name
      email
      picture
      specialties {
        id
        name
      }
    }
  }
`
