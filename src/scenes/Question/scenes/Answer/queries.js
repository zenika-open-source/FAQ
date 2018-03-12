import { gql } from 'apollo-boost'
import { graphql } from 'react-apollo'

import { auth } from 'services'

import { getNodeQuery } from '../Read/queries'

export const submitAnswerQuery = gql`
  mutation submitAnswer($id: ID!, $answer: ZNodeanswerAnswer!) {
    updateZNode(id: $id, answer: $answer) {
      id
    }
  }
`

export const editAnswerQuery = gql`
  mutation editAnswer($answerId: ID!, $content: String!, $userId: ID!) {
    updateAnswer(id: $answerId, content: $content, userId: $userId) {
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
    editAnswer: (answerId, content) => {
      return editAnswer({
        variables: { answerId, content, userId: auth.getUserNodeId() }
      })
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
