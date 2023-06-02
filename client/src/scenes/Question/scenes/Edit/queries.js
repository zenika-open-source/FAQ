import gql from 'graphql-tag'

import { zNodeFragment } from '../../queries'

export const SUBMIT_QUESTION = gql`
  mutation($title: String!, $language: String!, $translation: String!, $tags: [ID!]!) {
    createQuestionAndTags(title: $title, language: $language, translation: $translation, tags: $tags) {
      id
      title
      language
      translation {
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
  mutation(
    $questionId: ID!
    $title: String!
    $previousTitle: String!
    $language: String!
    $translation: String!
    $tags: [ID!]!
  ) {
    updateQuestionAndTags(
      id: $questionId
      title: $title
      previousTitle: $previousTitle
      language: $language
      translation: $translation
      tags: $tags
    ) {
      id
      title
      language
      translation {
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
