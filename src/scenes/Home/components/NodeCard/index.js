import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { markdown } from 'services'

import Card from 'react-toolbox/lib/card/Card'
import CardText from 'react-toolbox/lib/card/CardText'
import CardTitle from 'react-toolbox/lib/card/CardTitle'

import './style.css'

class NodeCard extends Component {
  render () {
    const node = this.props.node

    return (
      <Card className="NodeCard" {...this.props}>
        <Link
          to={`/q/${node.question.slug}`}
          style={{ color: 'initial', textDecoration: 'none' }}
        >
          {node.highlight ? (
            <CardTitle
              avatar={node.question.user.picture}
              title={
                <span
                  dangerouslySetInnerHTML={{
                    __html: markdown.title(node.highlight.question.title.value)
                  }}
                />
              }
              style={{ backgroundColor: '#f0f0f0' }}
            />
          ) : (
            <CardTitle
              avatar={node.question.user.picture}
              title={markdown.title(node.question.title)}
              style={{ backgroundColor: '#f0f0f0' }}
            />
          )}
        </Link>
        <CardText>
          {node.answer ? (
            markdown.html(
              node.highlight
                ? node.highlight.answer.content.value
                : node.answer.content
            )
          ) : (
            <p style={{ textAlign: 'center' }}>
              <i>No answer yet...</i>
            </p>
          )}
        </CardText>
      </Card>
    )
  }
}

NodeCard.propTypes = {
  node: PropTypes.object.isRequired
}

export default NodeCard
