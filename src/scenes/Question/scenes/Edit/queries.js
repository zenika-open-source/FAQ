import { gql } from 'apollo-boost'
import { graphql } from 'react-apollo'

import { getNodeQuery } from '../Read/queries'
import { getAllNodesQuery } from 'scenes/Home/queries'

export const submitQuestionQuery = gql`
  mutation submitQuestion($title: String!, $idUser: ID!) {
    createZNode(question: { title: $title, slug: "", userId: $idUser }) {
      id
      question {
        slug
      }
    }
  }
`

export const editQuestionQuery = gql`
  mutation editQuestion($idQuestion: ID!, $title: String!, $idUser: ID!) {
    updateQuestion(id: $idQuestion, title: $title, slug: "", userId: $idUser) {
      id
      slug
    }
  }
`

export const submitQuestion = graphql(submitQuestionQuery, {
  name: 'submitQuestion',
  props: ({ submitQuestion }) => ({
    submitQuestion: (title, idUser) => {
      return submitQuestion({
        variables: { title, idUser }
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
    editQuestion: (idQuestion, title, idUser) => {
      return editQuestion({
        variables: { idQuestion, title, idUser }
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
