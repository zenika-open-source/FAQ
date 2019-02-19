import gql from 'graphql-tag'

export const searchNodes = gql`
  query(
    $text: String
    $tags: [String!]
    $flags: [String!]
    $first: Int!
    $skip: Int!
    $group: ID!
  ) {
    search(
      text: $text
      tags: $tags
      flags: $flags
      first: $first
      skip: $skip
      group: $group
      orderBy: createdAt_DESC
    ) {
      nodes {
        id
        question {
          id
          title
          slug
          createdAt
        }
        answer {
          id
          content
        }
        flags {
          id
          type
        }
        tags {
          id
          label
        }
        group {
          id
        }
        highlights
      }
      meta {
        entriesCount
        pagesCount
        pageCurrent
      }
    }
  }
`
