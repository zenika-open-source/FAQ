import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

import { auth } from 'services'

export const submitQuestionQuery = gql`
  mutation submitQuestion($title: String!, $userId: ID!) {
    createZNode(question: { title: $title, slug: "", userId: $userId }) {
      id
      question {
        slug
      }
    }
  }
`

export const editQuestionQuery = gql`
  mutation editQuestion($questionId: ID!, $title: String!) {
    updateQuestion(id: $questionId, title: $title, slug: "") {
      id
      slug
    }
  }
`

export const submitQuestion = graphql(submitQuestionQuery, {
  name: 'submitQuestion',
  props: ({ submitQuestion }) => ({
    submitQuestion: title => {
      return submitQuestion({
        variables: { title, userId: auth.getUserNodeId() }
      })
    }
  })
})

export const editQuestion = graphql(editQuestionQuery, {
  name: 'editQuestion',
  props: ({ editQuestion }) => ({
    editQuestion: (questionId, title) => {
      return editQuestion({
        variables: { questionId, title }
      })
    }
  })
})
