import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactMarkdown from 'react-markdown'

import MarkdownEmoji from './markdown-emoji'

import Card from 'react-toolbox/lib/card/Card'
import CardText from 'react-toolbox/lib/card/CardText'
import CardTitle from 'react-toolbox/lib/card/CardTitle'

import './style.css'

class QuestionCard extends Component {
  render () {
    const question = this.props.question

    return (
      <Card className="QuestionCard" {...this.props}>
        <CardTitle
          avatar={question.avatar || 'https://placeimg.com/80/80/animals'}
          title={MarkdownEmoji(question.question)}
        />
        <CardText>
          <ReactMarkdown
            source={question.answer}
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

QuestionCard.propTypes = {
  question: PropTypes.object.isRequired
}

export default QuestionCard
