import gql from 'graphql-tag'

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
