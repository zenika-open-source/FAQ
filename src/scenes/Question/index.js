import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'

import { gql } from 'apollo-boost'
import { graphql } from 'react-apollo'

const getNode = gql`
  query getNode($id: ID!) {
    ZNode(id: $id) {
      id
      question {
        id
        title
      }
      answer {
        id
        content
      }
    }
  }
`

class Question extends Component {
  render () {
    const { match } = this.props
    const { loading, error, ZNode } = this.props.data

    if (loading) {
      return <div>Loading...</div>
    }

    if (error) {
      return <div>Error :(</div>
    }

    if (ZNode === null) {
      return <Redirect to="/" />
    }

    return (
      <div>
        <h3 style={{ textAlign: 'center' }}>{ZNode.question.title}</h3>
        <b>Answer:</b>
        <br />
        {ZNode.answer ? ZNode.answer.content : ''}
        <br />
        <Link to={`/q/${match.params.id}/answer`}>Answer the question</Link>
      </div>
    )
  }
}

export default graphql(getNode, {
  options: ({ match }) => ({ variables: { id: match.params.id } })
})(Question)
