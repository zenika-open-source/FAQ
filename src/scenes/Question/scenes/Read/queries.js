import { gql } from 'apollo-boost'
import { graphql } from 'react-apollo'

export const getNodeQuery = gql`
  query getNode($slug: String!) {
    allQuestions(filter: { slug_in: [$slug] }) {
      node {
        id
        question {
          id
          title
          slug
          user {
            id
            name
            picture
          }
          updatedAt
        }
        answer {
          id
          content
          user {
            id
            name
            picture
          }
          updatedAt
        }
      }
    }
  }
`

export const getNode = graphql(getNodeQuery, {
  props: ({ data: { allQuestions, ...rest } }) => ({
    data: {
      ZNode: allQuestions
        ? allQuestions.length >= 1 ? allQuestions[0].node : null
        : undefined,
      ...rest
    }
  }),
  skip: props => !props.match.params.slug,
  options: props => ({ variables: { slug: props.match.params.slug } })
})
