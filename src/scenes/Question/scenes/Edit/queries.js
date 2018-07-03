import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

import { auth, history } from 'services'

export const submitQuestionQuery = gql`
  mutation($title: String!, $userId: ID!, $tags: [ZNodetagsTag!]!) {
    createZNode(
      question: { title: $title, slug: "", userId: $userId }
      tags: $tags
    ) {
      id
      question {
        id
        title
        slug
      }
      tags {
        label
      }
    }
  }
`

export const editQuestionQuery = gql`
  mutation($questionId: ID!, $title: String!, $tags: [String!]!) {
    updateQuestionAndTags(
      where: { id: $questionId }
      data: { title: $title }
      tags: $tags
    ) {
      id
      title
      slug
      user {
        id
      }
      node {
        id
        tags {
          id
          label
        }
      }
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
  }),
  options: {
    onCompleted: ({ createZNode }) =>
      history.addAction(
        'CREATED',
        'Question',
        {
          title: createZNode.question.title,
          tags: createZNode.tags.map(t => t.label)
        },
        createZNode.id
      )
  }
})

export const editQuestion = graphql(editQuestionQuery, {
  name: 'editQuestion',
  props: ({ editQuestion }) => ({
    editQuestion: (questionId, title, tags) => {
      return editQuestion({
        variables: {
          questionId,
          title,
          tags
        }
      })
    }
  })
})
