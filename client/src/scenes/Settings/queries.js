import { gql } from '@apollo/client'

const CONFIGURATION_FRAGMENT = `
  id
  title
  tagCategories {
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
    $tagCategories: Json!
    $algoliaSynonyms: Json!
    $workplaceSharing: Boolean!
    $authorizedDomains: [String!]!
    $bugReporting: BugReporting!
    $slackChannelHook: String
  ) {
    updateConfiguration(
      title: $title
      tagCategories: $tagCategories
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
