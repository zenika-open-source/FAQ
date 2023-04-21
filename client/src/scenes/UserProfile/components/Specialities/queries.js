import gql from 'graphql-tag'

export const meSpecialities = gql`
  query {
    me {
      specialities {
        name
      }
    }
  }
`
