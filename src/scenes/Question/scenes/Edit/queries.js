import { gql } from 'apollo-boost'
import { graphql } from 'react-apollo'
import slug from 'slug'

import { getNodeQuery } from '../Read/queries'
import { getAllNodes } from 'scenes/Home/queries'

export const submitQuestionQuery = gql`
  mutation submitQuestion($title: String!, $slug: String!, $idUser: ID!) {
    createZNode(question: { title: $title, slug: $slug, userId: $idUser }) {
      id
      question {
        slug
      }
    }
  }
`

export const editQuestionQuery = gql`
  mutation editQuestion(
    $idQuestion: ID!
    $title: String!
    $slug: String!
    $idUser: ID!
  ) {
    updateQuestion(
      id: $idQuestion
      title: $title
      slug: $slug
      userId: $idUser
    ) {
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
        variables: { title, slug: slug(title).toLowerCase(), idUser }
      })
    }
  }),
  options: props => ({
    refetchQueries: [
      {
        query: getAllNodes
      }
    ]
  })
})

export const editQuestion = graphql(editQuestionQuery, {
  name: 'editQuestion',
  props: ({ editQuestion }) => ({
    editQuestion: (idQuestion, title, idUser) => {
      return editQuestion({
        variables: {
          idQuestion,
          title,
          slug: slug(title).toLowerCase(),
          idUser
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
