import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

import { routing } from 'services'

export const getNodeQuery = gql`
  query($id: ID!) {
    zNode(where: { id: $id }) {
      id
      question {
        id
        title
        slug
        user {
          id
          name
          picture
        }
        createdAt
      }
      answer {
        id
        content
        sources {
          id
          label
          url
        }
        user {
          id
          name
          picture
        }
        createdAt
      }
      flags {
        id
        type
        user {
          id
          name
        }
        createdAt
      }
      tags {
        id
        label
      }
    }
  }
`

export const getNode = graphql(getNodeQuery, {
  skip: props => !props.match.params.slug,
  options: props => ({ variables: { id: routing.getUIDFromSlug(props.match) } })
})
