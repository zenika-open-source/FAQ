import { useLazyQuery, gql } from '@apollo/client'

export const useFullConfiguration = () =>
  useLazyQuery(
    gql`
      query {
        configuration {
          id
          title
          authorizedDomains
          algoliaSynonyms {
            objectID
            type
            synonyms
          }
          slackChannelHook
          slackCommandKey
          workplaceSharing
          bugReporting
          tagCategories {
            name
            order
            labels {
              name
              order
            }
          }
        }
      }
    `,
    {
      fetchPolicy: 'network-only'
    }
  )
