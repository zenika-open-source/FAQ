import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import { Card, Tags, Flags } from 'components'
import { useIntl, markdown } from 'services'

import './Result.scss'

const Result = ({ collapsed: inheritedCollapsed, node }) => {
  const intl = useIntl(Result)
  const [collapsed, setCollapsed] = useState(inheritedCollapsed)

  return (
    <Card className="result">
      <Card.Title onClick={() => setCollapsed(cl => !cl)}>
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
      </Card.Title>
      <Card.Text collapsed={collapsed}>
        {node.answer ? (
          markdown.html(
            node.highlights && node.highlights.answer ? node.highlights.answer : node.answer.content
          )
        ) : (
          <p style={{ textAlign: 'center' }}>
            <i>{intl('no_answer')}</i>
          </p>
        )}
      </Card.Text>
    </Card>
  )
}

Result.translations = {
  en: { no_answer: 'No answer yet...' },
  fr: { no_answer: 'Pas encore de réponse...' }
}

export default Result
