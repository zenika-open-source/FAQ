import gql from 'graphql-tag'

export const GET_CONFIGURATION = gql`
  query {
    configuration {
      title
      tags
      algoliaSynonyms
      workplaceSharing
      authorizedDomains
      bugReporting
      slackChannelHook
      slackCommandKey
    }
  }
`

export const UPDATE_CONFIGURATION = gql`
  mutation updateConfiguration(
    $title: String!
    $tags: Json!
    $algoliaSynonyms: Json!
    $workplaceSharing: Boolean!
    $authorizedDomains: [String!]!
    $bugReporting: BugReporting!
    $slackChannelHook: String
  ) {
    updateConfiguration(
      title: $title
      tags: $tags
      algoliaSynonyms: $algoliaSynonyms
      workplaceSharing: $workplaceSharing
      authorizedDomains: $authorizedDomains
      bugReporting: $bugReporting
      slackChannelHook: $slackChannelHook
    ) {
      title
    }
  }
`

export const REGENERATE_SLACK_COMMAND_KEY = gql`
  mutation regenerateSlackCommandKey {
    regenerateSlackCommandKey {
      slackCommandKey
    }
  }
`
