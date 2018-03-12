import { gql } from 'apollo-boost'
import { graphql } from 'react-apollo'

import { auth } from 'services'

import { getNodeQuery } from '../Read/queries'
import { getAllNodesQuery } from 'scenes/Home/queries'

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
  mutation editQuestion($questionId: ID!, $title: String!, $userId: ID!) {
    updateQuestion(id: $questionId, title: $title, slug: "", userId: $userId) {
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
  }),
  options: props => ({
    refetchQueries: [
      {
        query: getAllNodesQuery
      }
    ]
  })
})

export const editQuestion = graphql(editQuestionQuery, {
  name: 'editQuestion',
  props: ({ editQuestion }) => ({
    editQuestion: (questionId, title) => {
      return editQuestion({
        variables: { questionId, title, userId: auth.getUserNodeId() }
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
