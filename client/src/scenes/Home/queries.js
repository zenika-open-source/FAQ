import gql from 'graphql-tag'

export const searchNodes = gql`
  query($text: String, $tags: [String!], $flags: [String!], $first: Int!, $skip: Int!) {
    search(
      text: $text
      tags: $tags
      flags: $flags
      first: $first
      skip: $skip
      orderBy: { createdAt: desc }
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
