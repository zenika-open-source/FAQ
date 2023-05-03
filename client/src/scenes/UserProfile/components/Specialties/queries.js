import gql from 'graphql-tag'

export const GET_SPECIALITIES = gql`
  query {
    me {
      id
      specialities {
        id
        name
      }
    }
  }
`
