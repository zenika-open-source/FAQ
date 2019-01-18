import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

export const getConfiguration = gql`
  query {
    configuration {
      id
      title
      algoliaSynonyms
      tags
    }
  }
`

export const updateConfigurationMutation = gql`
  mutation updateConfiguration($title: String, $tags: Json!, $synonyms: Json!) {
    updateConfiguration(title: $title, tags: $tags, algoliaSynonyms: $synonyms) {
      id
    }
  }
`

export const updateConfiguration = graphql(updateConfigurationMutation, {
  name: 'updateConfiguration',
  props: ({ updateConfiguration }) => ({
    updateConfiguration: variables => updateConfiguration({ variables })
  })
})
