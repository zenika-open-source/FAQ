import gql from 'graphql-tag'

export const searchNodes = gql`
  query(
    $text: String
    $tags: [String!]
    $flags: [String!]
    $first: Int!
    $skip: Int!
    $locale: String!
    
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
          titleTranslations (where : {lang: $locale}){
            text 
          }
          slug
          createdAt
        }
        answer {
          id
          content
          contentTranslations (where : {lang: $locale}){
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
