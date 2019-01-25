import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

import { zNodeFragment } from '../../queries'
import auth from 'services/auth'

export const submitAnswerMutation = gql`
  mutation($content: String!, $sources: String!, $nodeId: ID!, $locale: String!) {
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
        ${zNodeFragment}
      }
      user {
        id
      }
      createdAt
    }
  }
`

export const editAnswerMutation = gql`
  mutation($id: ID!, $content: String!, $sources: String!) {
    updateAnswerAndSources(id: $id, content: $content, sources: $sources) {
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
        variables: { content, sources: JSON.stringify(sources), nodeId, locale: auth.getLocale() }
      })
    }
  })
})

export const editAnswer = graphql(editAnswerMutation, {
  name: 'editAnswer',
  props: ({ editAnswer }) => ({
    editAnswer: (id, content, sources) => {
      return editAnswer({
        variables: { id, content, sources: JSON.stringify(sources), locale: auth.getLocale() }
      })
    }
  })
})
