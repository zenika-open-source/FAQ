import { gql } from '@apollo/client'

export const GET_SPECIALTIES = gql`
  query {
    me {
      id
      specialties {
        id
        name
      }
    }
  }
`
