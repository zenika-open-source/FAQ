import { gql } from '@apollo/client'

export const GET_TAG_CATEGORIES = gql`
  query {
    configuration {
      id
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
      specialties {
        id
        name
      }
    }
  }
`

export const UPDATE_SPECIALTIES = gql`
  mutation updateSpecialties($id: ID!, $specialties: [SpecialtiesInput]!) {
    updateSpecialties(id: $id, specialties: $specialties) {
      id
    }
  }
`
