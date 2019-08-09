import gql from 'graphql-tag'

export const GET_ME = gql`
  query {
    me {
      id
      email
      name
      picture
    }
  }
`

export const UPDATE_INDENTITY = gql`
  mutation updateIdentity($name: String!, $email: String!, $picture: String!) {
    updateMe(name: $name, email: $email, picture: $picture) {
      id
    }
  }
`

export const DELETE_IDENTITY = gql`
  mutation deleteIdentity {
    forgetMe {
      id
    }
  }
`
