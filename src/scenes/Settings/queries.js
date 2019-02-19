import gql from 'graphql-tag'

export const updateConfigurationMutation = gql`
  mutation updateConfiguration($title: String!, $groups: [GroupUpdateInput!]!) {
    updateConfiguration(title: $title, groups: $groups) {
      id
      groups {
        id
        slug
        tags
        workplaceSharing
      }
    }
  }
`
