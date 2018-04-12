import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

export const getRandomNodeQuery = gql`
  query($flag: String) {
    randomNode(flag: $flag) {
      id
    }
  }
`

export const getRandomNode = graphql(getRandomNodeQuery, {
  options: props => ({ variables: { flag: props.match.params.flag } })
})
