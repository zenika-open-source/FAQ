import gql from 'graphql-tag'

export const searchNodes = gql`
  query(
    $text: String
    $tags: [String!]
    $flags: [String!]
    $first: Int!
    $skip: Int!
    
  ) {
    search(
      text: $text
      tags: $tags
      flags: $flags
      first: $first
      skip: $skip
      orderBy: createdAt_DESC
    ) {
      nodes {
        id
        question {
          id
          title
          titleTranslations (where : {lang: "en"}){
            text 
          }
          slug
          createdAt
        }
        answer {
          id
          content
          contentTranslations (where : {lang: "en"}){
            text
          }
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
