import { gql } from 'apollo-boost'

export const submitQuestion = gql`
  mutation submitQuestion($title: String!, $id_user: ID!) {
    createZNode(question: { title: $title, userId: $id_user }) {
      id
    }
  }
`
