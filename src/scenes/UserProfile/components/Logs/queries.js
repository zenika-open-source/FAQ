import gql from 'graphql-tag'

export const meHistory = gql`
  query($id: ID!, $first: Int!, $skip: Int!) {
    history(
      where: { user: { id: $id } }
      orderBy: createdAt_DESC
      first: $first
      skip: $skip
    ) {
      historyActions {
        id
        action
        model
        meta
        createdAt
        user {
          id
          name
        }
        node {
          id
          question {
            id
            title
            slug
          }
        }
      }
      meta {
        pagesCount
        pageCurrent
      }
    }
  }
`
