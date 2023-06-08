import gql from 'graphql-tag'

const CONFIGURATION_FRAGMENT = `
  id
  title
  subjectCategories {
    id
    order
    name
    labels {
      id
      order
      name
    }
  }
  algoliaSynonyms
  workplaceSharing
  authorizedDomains
  bugReporting
  slackChannelHook
  slackCommandKey
`

export const GET_CONFIGURATION = gql`
  query {
    configuration {
      ${CONFIGURATION_FRAGMENT}
    }
  }
`

export const UPDATE_CONFIGURATION = gql`
  mutation updateConfiguration(
    $title: String!
    $subjectCategories: Json!
    $algoliaSynonyms: Json!
    $workplaceSharing: Boolean!
    $authorizedDomains: [String!]!
    $bugReporting: BugReporting!
    $slackChannelHook: String
  ) {
    updateConfiguration(
      title: $title
      subjectCategories: $subjectCategories
      algoliaSynonyms: $algoliaSynonyms
      workplaceSharing: $workplaceSharing
      authorizedDomains: $authorizedDomains
      bugReporting: $bugReporting
      slackChannelHook: $slackChannelHook
    ) {
      ${CONFIGURATION_FRAGMENT}
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
