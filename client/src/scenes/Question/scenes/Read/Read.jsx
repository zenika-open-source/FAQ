import React from 'react'
import { Redirect, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

import { Loading, Card, Button, Dropdown, Tags, Flags } from 'components'
import { markdown, useConfiguration, useIntl } from 'services'
import NotFound from 'scenes/NotFound'

import { useNode } from '../../queries'
import { ActionMenu } from '../../components'
import { FlagsDropdown, Share, Views, Meta, Sources, History } from './components'

const Read = ({ match }) => {
  const intl = useIntl(Read)
  const conf = useConfiguration({ cacheOnly: true })
  const { loading, data } = useNode(match.params.slugid, { pollInterval: 60 * 1000 })
  const node = data?.node

  if (loading && !node) return <Loading />

  if (!node) return <NotFound />

  /* Redirect to correct URL if incorrect slug */
  const correctSlug = node.question.slug + '-' + node.id
  if (match.params.slugid !== correctSlug) {
    return <Redirect to={'/q/' + correctSlug} />
  }

  return (
    <div>
      <Helmet>
        <title>
          FAQ {conf.title} - {markdown.title(node.question.title)}
        </title>
      </Helmet>
      <ActionMenu home>
        <FlagsDropdown nodeId={node.id} flags={node.flags} />
        <Dropdown button={<Button icon="edit" label={intl('menu.edit.label')} link />}>
          <Dropdown.Item icon="edit" path={`/q/${match.params.slugid}/edit`}>
            {intl('menu.edit.question')}
          </Dropdown.Item>
          <Dropdown.Item icon="question_answer" path={`/q/${match.params.slugid}/answer`}>
            {intl('menu.edit.answer')}
          </Dropdown.Item>
        </Dropdown>
      </ActionMenu>
      <Card>
        <Card.Title style={{ padding: '1.2rem' }}>
          <div className="grow">
            <h1>{markdown.title(node.question.title)}</h1>
            {node.tags.length > 0 && <Tags tags={node.tags} />}
          </div>
          <Flags node={node} withLabels={true} />
          <Views questionId={node.question.id} value={node.question.views} />
          <Share node={node} />
        </Card.Title>
        <Card.Text>
          {node.answer ? (
            <>
              <div style={{ padding: '0.5rem', marginBottom: '0.5rem' }}>
                {markdown.html(node.answer.content)}
              </div>
              <Sources sources={node.answer.sources} />
            </>
          ) : (
            <div
              style={{
                textAlign: 'center',
                marginTop: '2rem',
                marginBottom: '2rem'
              }}
            >
              <b>{intl('no_answer')}</b>
              <br />
              <br />
              <Link to={`/q/${match.params.slugid}/answer`} className="btn-container">
                <Button icon="question_answer" primary>
                  {intl('answer')}
                </Button>
              </Link>
            </div>
          )}
          <hr />
          <Meta node={node} />
          <History node={node} />
        </Card.Text>
      </Card>
    </div>
  )
}

Read.translations = {
  en: {
    menu: {
      edit: {
        label: 'Edit ...',
        question: 'Question',
        answer: 'Answer'
      }
    },
    no_answer: 'No answer yet...',
    answer: 'Answer the question'
  },
  fr: {
    menu: {
      edit: {
        label: 'Modifier ...',
        question: 'Question',
        answer: 'Réponse'
      }
    },
    no_answer: 'Pas encore de réponse...',
    answer: 'Répondre à la question'
  }
}

export default Read
