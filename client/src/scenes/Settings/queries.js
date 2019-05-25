import gql from 'graphql-tag'

export const getConfiguration = gql`
  query {
    configuration {
      title
      tags
      algoliaSynonyms
      workplaceSharing
      authorizedDomains
      bugReporting
      slackCommandKey
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
    $bugReporting: BugReporting!
  ) {
    updateConfiguration(
      title: $title
      tags: $tags
      algoliaSynonyms: $algoliaSynonyms
      workplaceSharing: $workplaceSharing
      authorizedDomains: $authorizedDomains
      bugReporting: $bugReporting
    ) {
      title
    }
  }
`

export const regenerateSlackCommandKeyMutation = gql`
  mutation regenerateSlackCommandKey {
    regenerateSlackCommandKey {
      slackCommandKey
    }
  }
`
