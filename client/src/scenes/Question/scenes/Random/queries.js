import gql from 'graphql-tag'

export const GET_RANDOM = gql`
  query($tag: String) {
    randomNode(tag: $tag) {
      id
      question {
        id
        slug
      }
    }
  }
`
