import gql from 'graphql-tag'

export const getConfiguration = gql`
  query {
    configuration {
      title
      tags
      algoliaSynonyms
      workplaceSharing
      authorizedDomains
    }
  }
`

export const updateConfigurationMutation = gql`
  mutation updateConfiguration(
    $title: String!
    $tags: Json!
    $algoliaSynonyms: Json!
    $workplaceSharing: Boolean!
    $authorizedDomains: [String!]!
  ) {
    updateConfiguration(
      title: $title
      tags: $tags
      algoliaSynonyms: $algoliaSynonyms
      workplaceSharing: $workplaceSharing
      authorizedDomains: $authorizedDomains
    ) {
      title
      tags
      algoliaSynonyms
      workplaceSharing
    }
  }
`
