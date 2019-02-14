import gql from 'graphql-tag'

export const getConfiguration = gql`
  query {
    configuration {
      title
      tags
      algoliaSynonyms
      workplaceSharing
      authorizedMails
    }
  }
`

export const updateConfigurationMutation = gql`
  mutation updateConfiguration(
    $title: String!
    $tags: Json!
    $algoliaSynonyms: Json!
    $workplaceSharing: Boolean!
    $authorizedMails: [String!]!
  ) {
    updateConfiguration(
      title: $title
      tags: $tags
      algoliaSynonyms: $algoliaSynonyms
      workplaceSharing: $workplaceSharing
      authorizedMails: $authorizedMails
    ) {
      title
      tags
      algoliaSynonyms
      workplaceSharing
    }
  }
`
