import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

export const getConfiguration = gql`
  query {
    configuration {
      id
      title
      algoliaSynonyms
      tags
      enableWorkplaceSharing
    }
  }
`

export const updateConfigurationMutation = gql`
  mutation updateConfiguration($title: String, $tags: Json!, $synonyms: Json!, $enableWorkplace: Boolean!) {
    updateConfiguration(title: $title, tags: $tags, algoliaSynonyms: $synonyms, enableWorkplaceSharing: $enableWorkplace) {
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
