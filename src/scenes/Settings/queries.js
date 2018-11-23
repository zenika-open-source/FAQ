import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

export const getConfiguration = gql`
  query {
    configuration {
      id
      algoliaSynonyms
      tags
    }
  }
`

export const updateConfigurationMutation = gql`
  mutation updateConfiguration($tags: Json!, $synonyms: Json!) {
    updateConfiguration(tags: $tags, algoliaSynonyms: $synonyms) {
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
