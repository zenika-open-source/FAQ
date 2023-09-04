import { gql } from '@apollo/client'

export const SEARCH_NODES = gql`
  query ($text: String, $tags: [String!], $flags: [String!], $first: Int!, $skip: Int!) {
    search(
      text: $text
      tags: $tags
      flags: $flags
      orderBy: createdAt_DESC
      first: $first
      skip: $skip
    ) {
      nodes {
        id
        question {
          id
          title
          slug
          createdAt
          language
          translation {
            text
            language
          }
        }
        answer {
          id
          content
          language
          translation {
            text
            language
          }
        }
        flags {
          id
          type
        }
        tags {
          id
          label {
            id
            name
          }
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
