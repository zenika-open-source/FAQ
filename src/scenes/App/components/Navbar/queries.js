import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

import { routing } from 'services'

export const meQuery = gql`
  query {
    me {
      id
      auth0Id
      name
      email
      picture
      locale
    }
  }
`

export const me = graphql(meQuery)
