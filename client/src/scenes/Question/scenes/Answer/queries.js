import gql from 'graphql-tag'

import { zNodeFragment } from '../../queries'

export const SUBMIT_ANSWER = gql`
  mutation($content: String!, $language: String!, $sources: String!, $nodeId: ID!) {
    createAnswerAndSources(
      content: $content
      language: $language
      sources: $sources
      nodeId: $nodeId
    ) {
      id
      content
      sources {
        label
        url
      }
      node {
        ${zNodeFragment}
      }
      user {
        id
      }
      createdAt
    }
  }
`

export const EDIT_ANSWER = gql`
  mutation(
    $id: ID!
    $content: String!
    $previousContent: String!
    $language: String!
    $sources: String!
  ) {
    updateAnswerAndSources(
      id: $id
      content: $content
      previousContent: $previousContent
      language: $language
      sources: $sources
    ) {
      id
      content
      language
      sources {
        label
        url
      }
    }
  }
`
