import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { markdown, getIntl } from '@services'

// import Avatar from 'components/Avatar'
import Card, { CardTitle, CardText } from '@components/Card'
import Flags from '@components/Flags'
import Tags from '@components/Tags'

import './Result.css'

class Result extends Component {
  constructor(props) {
    super(props)

    this.state = {
      collapsed: props.collapsed || false
    }
  }

  render() {
    const intl = getIntl(Result)

    const { node } = this.props
    const { collapsed } = this.state

    return (
      <Card className="result">
        <CardTitle onClick={() => this.setState({ collapsed: !collapsed })}>
          <div className="grow">
            {!node.highlights ? (
              <h1>{markdown.title(node.question.title)}</h1>
            ) : (
              <h1
                dangerouslySetInnerHTML={{
                  __html: markdown.title(node.highlights.question)
                }}
              />
            )}
            {node.tags.length > 0 && <Tags tags={node.tags} />}
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
              node.highlights && node.highlights.answer
                ? node.highlights.answer
                : node.answer.content
            )
          ) : (
            <p style={{ textAlign: 'center' }}>
              <i>{intl('no_answer')}</i>
            </p>
          )}
        </CardText>
      </Card>
    )
  }
}

Result.propTypes = {
  node: PropTypes.object.isRequired,
  collapsed: PropTypes.bool
}

Result.translations = {
  en: { no_answer: 'No answer yet...' },
  fr: { no_answer: 'Pas encore de réponse...' }
}

export default Result
