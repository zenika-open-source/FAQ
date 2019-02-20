import gql from 'graphql-tag'

export const getConfiguration = gql`
  query {
    configuration {
      title
      tags
      algoliaSynonyms
      workplaceSharing
    }
  }
`

export const updateConfigurationMutation = gql`
  mutation updateConfiguration(
    $title: String!
    $tags: Json!
    $algoliaSynonyms: Json!
    $workplaceSharing: Boolean!
  ) {
    updateConfiguration(
      title: $title
      tags: $tags
      algoliaSynonyms: $algoliaSynonyms
      workplaceSharing: $workplaceSharing
    ) {
      title
      tags
      algoliaSynonyms
      workplaceSharing
    }
  }
`
