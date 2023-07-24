import { gql } from '@apollo/client'

export const LOAD_HISTORY = gql`
  query ($nodeId: ID!, $first: Int!, $skip: Int!) {
    history(where: { node: { id: $nodeId } }, first: $first, skip: $skip, orderBy: createdAt_DESC) {
      historyActions {
        id
        node {
          id
        }
        action
        model
        meta
        user {
          id
          name
          picture
        }
        createdAt
      }
      meta {
        pagesCount
        pageCurrent
      }
    }
  }
`
