import gql from 'graphql-tag'

export const GET_TAG_CATEGORIES = gql`
  query {
    configuration {
      tagCategories {
        id
        name
        labels {
          id
          name
        }
      }
    }
  }
`

export const GET_USERS = gql`
  query {
    users {
      id
      name
      email
      admin
      specialities {
        id
        name
      }
    }
  }
`
