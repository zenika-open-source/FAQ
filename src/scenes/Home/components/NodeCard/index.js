import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactMarkdown from 'react-markdown'

import MarkdownEmoji from './markdown-emoji'

import Card from 'react-toolbox/lib/card/Card'
import CardText from 'react-toolbox/lib/card/CardText'
import CardTitle from 'react-toolbox/lib/card/CardTitle'

import './style.css'

class NodeCard extends Component {
  render () {
    const node = this.props.node

    return (
      <Card className="NodeCard" {...this.props}>
        <CardTitle
          avatar={node.avatar || 'https://placeimg.com/80/80/animals'}
          title={MarkdownEmoji(node.question.title)}
        />
        <CardText>
          <ReactMarkdown
            source={node.answer.content}
            renderers={{
              link: props => (
                <a href={props.href} target="_blank">
                  {props.children}
                </a>
              ),
              table: props => (
                <table className="zui-table">{props.children}</table>
              ),
              text: MarkdownEmoji
            }}
          />
        </CardText>
      </Card>
    )
  }
}

NodeCard.propTypes = {
  node: PropTypes.object.isRequired
}

export default NodeCard
