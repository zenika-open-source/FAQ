import gql from 'graphql-tag'

import { zNodeFragment } from '../../queries'

// TMP_TAGS

export const SUBMIT_QUESTION = gql`
  mutation($title: String!, $tags: [ID!]!) {
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
      slug
      user {
        id
      }
      node {
        id
        tags {
          id
          tagLabel {
            id
            name
          }
        }
      }
    }
  }
`
