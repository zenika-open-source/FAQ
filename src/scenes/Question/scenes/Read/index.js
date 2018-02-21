import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { graphql } from 'react-apollo'
import { getNode } from './queries'

import { flags } from 'services'

class Read extends Component {
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
      return <div>404 Node not found :/</div>
    }

    return (
      <div>
        <h3 style={{ textAlign: 'center' }}>{ZNode.question.title}</h3>
        <b>Answer:</b>
        <br />
        {ZNode.answer ? (
          ZNode.answer.content
        ) : flags.question.answer ? (
          <Link to={`/q/${match.params.id}/answer`}>Answer the question</Link>
        ) : (
          <i>No answer yet...</i>
        )}
      </div>
    )
  }
}

Read.propTypes = {
  match: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired
}

export default graphql(getNode, {
  options: ({ match }) => ({ variables: { id: match.params.id } })
})(Read)
