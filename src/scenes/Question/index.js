import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link, Redirect } from 'react-router-dom'

import { graphql } from 'react-apollo'
import { getNode } from './queries'

import New from './scenes/New'
import Answer from './scenes/Answer'

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
        {ZNode.answer ? (
          ZNode.answer.content
        ) : (
          <Link to={`/q/${match.params.id}/answer`}>Answer the question</Link>
        )}
      </div>
    )
  }
}

Question.propTypes = {
  match: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired
}

export default graphql(getNode, {
  options: ({ match }) => ({ variables: { id: match.params.id } })
})(Question)

export { New, Answer }
