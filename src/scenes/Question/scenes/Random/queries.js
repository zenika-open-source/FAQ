import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

export const getRandomNodeQuery = gql`
  query($tag: String) {
    randomNode(tag: $tag) {
      id
    }
  }
`

export const getRandomNode = graphql(getRandomNodeQuery, {
  options: props => ({ variables: { flag: props.match.params.tag } })
})
