import gql from 'graphql-tag'

export const loadHistoryQuery = gql`
  query($nodeId: ID!, $first: Int!, $skip: Int!) {
    history(
      where: { node: { id: $nodeId } }
      first: $first
      skip: $skip
      orderBy: { createdAt: "desc" }
    ) {
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
