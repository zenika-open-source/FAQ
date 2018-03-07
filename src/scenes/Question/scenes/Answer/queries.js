import { gql } from 'apollo-boost'
import { graphql } from 'react-apollo'

import { getNodeQuery } from '../Read/queries'

export const submitAnswerQuery = gql`
  mutation submitAnswer($id: ID!, $answer: ZNodeanswerAnswer!) {
    updateZNode(id: $id, answer: $answer) {
      id
    }
  }
`

export const editAnswerQuery = gql`
  mutation editAnswer($idAnswer: ID!, $content: String!, $idUser: ID!) {
    updateAnswer(id: $idAnswer, content: $content, userId: $idUser) {
      id
    }
  }
`

export const submitAnswer = graphql(submitAnswerQuery, {
  name: 'submitAnswer',
  props: ({ submitAnswer }) => ({
    submitAnswer: (id, answer) => {
      return submitAnswer({ variables: { id, answer } })
    }
  }),
  options: props => ({
    refetchQueries: [
      {
        query: getNodeQuery,
        variables: {
          slug: props.match.params.slug
        }
      }
    ]
  })
})

export const editAnswer = graphql(editAnswerQuery, {
  name: 'editAnswer',
  props: ({ editAnswer }) => ({
    editAnswer: (idAnswer, content, idUser) => {
      return editAnswer({ variables: { idAnswer, content, idUser } })
    }
  }),
  options: props => ({
    refetchQueries: [
      {
        query: getNodeQuery,
        variables: {
          slug: props.match.params.slug
        }
      }
    ]
  })
})
