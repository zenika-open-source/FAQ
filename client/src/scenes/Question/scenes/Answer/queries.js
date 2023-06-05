import gql from 'graphql-tag'

import { zNodeFragment } from '../../queries'

export const SUBMIT_ANSWER = gql`
  mutation($content: String!, $sources: String!, $nodeId: ID!) {
    createAnswerAndSources(
      content: $content
      sources: $sources
      nodeId: $nodeId
    ) {
      id
      content
      translation {
        language
        text
      }
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
  mutation($id: ID!, $content: String!, $previousContent: String!, $sources: String!) {
    updateAnswerAndSources(
      id: $id
      content: $content
      previousContent: $previousContent
      sources: $sources
    ) {
      id
      content
      language
      translation {
        language
        text
      }
      sources {
        label
        url
      }
    }
  }
`
