import { gql } from 'apollo-boost'

export const submitAnswer = gql`
  mutation submitAnswer($id: ID!, $answer: ZNodeanswerAnswer!) {
    updateZNode(id: $id, answer: $answer) {
      id
    }
  }
`

export const editAnswer = gql`
  mutation editAnswer($idAnswer: ID!, $content: String!, $idUser: ID!) {
    updateAnswer(id: $idAnswer, content: $content, userId: $idUser) {
      id
    }
  }
`
