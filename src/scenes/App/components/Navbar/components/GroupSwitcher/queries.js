import gql from 'graphql-tag'

export const groups = gql`
  query {
    groups {
      id
      name
    }
  }
`

export const changeCurrentGroup = gql`
  mutation($group: ID!) {
    changeCurrentGroup(group: $group) {
      id
      currentGroup {
        id
        name
      }
    }
  }
`
