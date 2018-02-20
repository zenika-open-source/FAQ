import { gql } from 'apollo-boost'

// TODO: don't use a ZNodeanswerAnswer ?
export const submitAnswer = gql`
  mutation submitAnswer($id: ID!, $answer: ZNodeanswerAnswer!) {
    updateZNode(id: $id, answer: $answer) {
      id
    }
  }
`
