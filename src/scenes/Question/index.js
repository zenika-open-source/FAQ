import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { gql } from 'apollo-boost'
import { Query } from 'react-apollo'

const GET_ALL_NODES = gql`
  query {
    allNodes {
      id
      question {
        title
      }
      answer {
        content
      }
    }
  }
`

class Question extends Component {
  render () {
    const { match } = this.props

    return (
      <div>
        Question read
        <Link to={`/q/${match.params.id}/answer`}>Answer</Link>
        <Query query={GET_ALL_NODES}>
          {({ loading, error, data }) => {
            if (loading) return <div>Loading...</div>
            if (error) return <div>Error :(</div>

            return <p>{JSON.stringify(data)}</p>
          }}
        </Query>
      </div>
    )
  }
}

export default Question
