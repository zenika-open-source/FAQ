import gql from 'graphql-tag'

export const getRandomNode = gql`
  query($tag: String) {
    randomNode(tag: $tag) {
      id
      question {
        slug
      }
    }
  }
`
