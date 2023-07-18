import { gql } from '@apollo/client'

import { zNodeFragment } from '../../queries'

export const SUBMIT_QUESTION = gql`
  mutation($title: String!, $tags: [ID!]!) {
    createQuestionAndTags(title: $title, tags: $tags) {
      id
      title
      language
      translation {
        id
        language
        text
      }
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

export const EDIT_QUESTION = gql`
  mutation($questionId: ID!, $title: String!, $previousTitle: String!, $tags: [ID!]!) {
    updateQuestionAndTags(
      id: $questionId
      title: $title
      previousTitle: $previousTitle
      tags: $tags
    ) {
      id
      title
      language
      translation {
        id
        language
        text
      }
      slug
      user {
        id
      }
      node {
        id
        tags {
          id
          label {
            id
            name
          }
        }
      }
    }
  }
`
