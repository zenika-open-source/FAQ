import { gql } from 'apollo-boost'

export const submitQuestion = gql`
  mutation submitQuestion($title: String!, $idUser: ID!) {
    createZNode(question: { title: $title, userId: $idUser }) {
      id
    }
  }
`

export const editQuestion = gql`
  mutation editQuestion($idQuestion: ID!, $title: String!, $idUser: ID!) {
    updateQuestion(id: $idQuestion, title: $title, userId: $idUser) {
      id
    }
  }
`
