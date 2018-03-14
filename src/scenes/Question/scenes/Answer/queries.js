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
  mutation editAnswer(
    $answerId: ID!
    $content: String!
    $sources: String!
  ) {
    fullUpdateAnswer(
      answerId: $answerId
      content: $content
      sources: $sources
    ) {
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
    editAnswer: (answerId, content, sources) => {
      return editAnswer({
        variables: {
          answerId,
          content,
          sources: JSON.stringify(sources)
        }
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
