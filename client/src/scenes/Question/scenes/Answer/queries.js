import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

import { nodeFragment } from '../../queries'

export const submitAnswerMutation = gql`
  mutation($content: String!, $sources: String!, $nodeId: ID!) {
    createAnswerAndSources(
      content: $content
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
        ${nodeFragment}
      }
      user {
        id
      }
      createdAt
    }
  }
`

export const editAnswerMutation = gql`
  mutation($id: ID!, $content: String!, $previousContent: String!, $sources: String!) {
    updateAnswerAndSources(
      id: $id
      content: $content
      previousContent: $previousContent
      sources: $sources
    ) {
      id
      content
      sources {
        label
        url
      }
    }
  }
`

export const submitAnswer = graphql(submitAnswerMutation, {
  name: 'submitAnswer',
  props: ({ submitAnswer }) => ({
    submitAnswer: (content, sources, nodeId) => {
      return submitAnswer({
        variables: { content, sources: JSON.stringify(sources), nodeId }
      })
    }
  })
})

export const editAnswer = graphql(editAnswerMutation, {
  name: 'editAnswer',
  props: ({ editAnswer }) => ({
    editAnswer: (id, content, previousContent, sources) => {
      return editAnswer({
        variables: { id, content, previousContent, sources: JSON.stringify(sources) }
      })
    }
  })
})
