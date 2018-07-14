import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

import { zNodeFragment } from '../../queries'
import { getAllNodesQuery } from '../../../Home/queries'

export const submitQuestionMutation = gql`
  mutation($title: String!, $tags: [String!]!) {
    createQuestionAndTags(title: $title, tags: $tags) {
      id
      title
      slug
      user {
        id
      }
      node {
        ${zNodeFragment}
      }
      createdAt
    }
  }
`

export const editQuestionMutation = gql`
  mutation($questionId: ID!, $title: String!, $tags: [String!]!) {
    updateQuestionAndTags(id: $questionId, title: $title, tags: $tags) {
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

export const submitQuestion = graphql(submitQuestionMutation, {
  name: 'submitQuestion',
  props: ({ submitQuestion }) => ({
    submitQuestion: (title, tags) => {
      return submitQuestion({
        variables: {
          title,
          tags
        }
      })
    }
  }),
  options: {
    update: (proxy, { data: { createQuestionAndTags } }) => {
      const data = proxy.readQuery({ query: getAllNodesQuery })
      data.zNodes.unshift(createQuestionAndTags.node)
      proxy.writeQuery({ query: getAllNodesQuery, data })
    }
  }
})

export const editQuestion = graphql(editQuestionMutation, {
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
