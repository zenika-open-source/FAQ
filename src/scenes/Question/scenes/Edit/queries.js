import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

import { auth } from 'services'

export const submitQuestionQuery = gql`
  mutation submitQuestion(
    $title: String!
    $userId: ID!
    $tags: [ZNodetagsTag!]!
  ) {
    createZNode(
      question: { title: $title, slug: "", userId: $userId }
      tags: $tags
    ) {
      id
      question {
        slug
      }
    }
  }
`

export const editQuestionQuery = gql`
  mutation editQuestion(
    $questionId: ID!
    $title: String!
    $tags: [String!]!
    $nodeId: ID!
    $userId: ID!
  ) {
    fullUpdateQuestion(
      id: $questionId
      title: $title
      tags: $tags
      nodeId: $nodeId
      userId: $userId
    ) {
      id
      slug
    }
  }
`

export const submitQuestion = graphql(submitQuestionQuery, {
  name: 'submitQuestion',
  props: ({ submitQuestion }) => ({
    submitQuestion: (title, tags) => {
      const userId = auth.getUserNodeId()
      tags = tags.map(tag => ({
        label: tag,
        userId
      }))
      return submitQuestion({
        variables: {
          title,
          userId,
          tags
        }
      })
    }
  })
})

export const editQuestion = graphql(editQuestionQuery, {
  name: 'editQuestion',
  props: ({ editQuestion }) => ({
    editQuestion: (questionId, title, tags, nodeId) => {
      return editQuestion({
        variables: {
          questionId,
          title,
          tags,
          nodeId,
          userId: auth.getUserNodeId()
        }
      })
    }
  })
})
