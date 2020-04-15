import { useLazyQuery, gql } from '@apollo/client'

export const useSearch = () =>
  useLazyQuery(
    gql`
      query($text: String, $tags: [String!], $first: Int!, $skip: Int!) {
        search(text: $text, tags: $tags, first: $first, skip: $skip) {
          nodes {
            id
            question {
              id
              title
              slug
            }
            answer {
              id
              content
            }
            tags {
              id
              label {
                id
                name
              }
            }
            flags {
              id
              type
            }
            highlights {
              question
              answer
            }
          }
          meta {
            entriesCount
            pagesCount
            pageCurrent
          }
        }
      }
    `,
    {
      fetchPolicy: 'no-cache'
    }
  )
