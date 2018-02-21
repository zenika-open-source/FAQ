import { gql } from 'apollo-boost'

export const submitQuestion = gql`
  mutation submitQuestion($title: String!, $idUser: ID!) {
    createZNode(question: { title: $title, userId: $idUser }) {
      id
    }
  }
`
