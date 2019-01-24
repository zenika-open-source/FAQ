import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { markdown } from 'services'

// import Avatar from 'components/Avatar'
import Card, { CardTitle, CardText } from 'components/Card'
import Flags from 'components/Flags'
import Tags from 'components/Tags'
import { Button } from 'components'

import './Result.css'

class Result extends Component {
  constructor(props) {
    super(props)

    this.state = {
      collapsed: props.collapsed || false
    }
  }

  render() {
    const { node } = this.props
    const { collapsed } = this.state

    var titlebis;
    if (node.question.titleTranslations[0]) {
      titlebis = node.question.titleTranslations[0].text
    } else {
      titlebis = node.question.title;
    }

    var contentbis;
    if (node.answer != null) {
      if (node.answer.contentTranslations[0]) {
        contentbis = node.answer.contentTranslations[0].text;
      } else {
        contentbis = node.answer.content;
      }
    }

    
    var buttonTranslation;
    buttonTranslation = <Button
      style = {{ "textAlign" : 'right'}}
      icon="language"
      data-tooltip="Translated by Google Translate"
      round
      disabled
      ></Button>

    var messageTranslationTitle;
    var messageTranslationAnswer
    if (node.answer != null && contentbis != node.answer.content) {
      if (node.question.title != titlebis) {
        messageTranslationTitle = buttonTranslation
        messageTranslationAnswer = buttonTranslation
      }
      else {
        messageTranslationAnswer = buttonTranslation
      }
    } else {
      if (node.answer == null || node.answer.content == contentbis) {
        if (node.question.title != titlebis) {
          messageTranslationTitle = buttonTranslation
        }
      }
    }


    return (
      <Card className="result">
        <CardTitle onClick={() => this.setState({ collapsed: !collapsed })}>
          <div className="grow">
            {!node.highlights ? (
              <h1>{markdown.title(titlebis)}</h1>
            ) : (
                <h1
                  dangerouslySetInnerHTML={{
                    __html: markdown.title(node.highlights.question)
                  }}
                />
              )}
            {node.tags.length > 0 && <Tags tags={node.tags} />}
            {messageTranslationTitle}
          </div>
          <Flags node={node} withLabels={false} />
          <Link
            to={{
              pathname: `/q/${node.question.slug}-${node.id}`,
              state: { from: 'home' }
            }}
            className="open-card"
          >
            <i className="material-icons">keyboard_arrow_right</i>
          </Link>
        </CardTitle>
        <CardText collapsed={collapsed}>
          {node.answer ? (
            markdown.html(
              node.highlights ? node.highlights.answer : contentbis)
          ) : (
              <p style={{ textAlign: 'center' }}>
                <i>No answer yet...</i>
              </p>
            )}
          <div className="translationMessage"
            style={{ "textAlign": 'right' }}>
            {messageTranslationAnswer}
          </div>
        </CardText>
      </Card>
    )
  }
}
Result.propTypes = {
  node: PropTypes.object.isRequired,
  collapsed: PropTypes.bool
}

export default Result
