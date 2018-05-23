import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

import { history } from 'services'

export const submitAnswerQuery = gql`
  mutation submitAnswer($id: ID!, $answer: ZNodeanswerAnswer!) {
    updateZNode(id: $id, answer: $answer) {
      id
      question {
        id
        title
        slug
      }
      answer {
        id
        content
        sources {
          label
          url
        }
      }
    }
  }
`

export const editAnswerQuery = gql`
  mutation editAnswer(
    $nodeId: ID!
    $answerId: ID!
    $content: String!
    $sources: String!
  ) {
    fullUpdateAnswer(
      nodeId: $nodeId
      answerId: $answerId
      content: $content
      sources: $sources
    ) {
      id
      content
      sourcesChanges
      nodeId
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
  options: {
    onCompleted: ({ updateZNode }) =>
      history.addAction(
        'CREATED',
        'Answer',
        {
          content: updateZNode.answer.content,
          sources: updateZNode.answer.sources.map(s => ({
            label: s.label,
            url: s.url
          }))
        },
        updateZNode.id
      )
  }
})

export const editAnswer = graphql(editAnswerQuery, {
  name: 'editAnswer',
  props: ({ editAnswer }) => ({
    editAnswer: (nodeId, answerId, content, sources) => {
      return editAnswer({
        variables: {
          nodeId,
          answerId,
          content,
          sources: JSON.stringify(sources)
        }
      })
    }
  }),
  options: {
    onCompleted: ({ fullUpdateAnswer }) => {
      history.addAction(
        'UPDATED',
        'Answer',
        {
          content: fullUpdateAnswer.content,
          sourcesChanges: fullUpdateAnswer.sourcesChanges
        },
        fullUpdateAnswer.nodeId
      )
    }
  }
})
