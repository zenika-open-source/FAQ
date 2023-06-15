import { useMutation } from '@apollo/client'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link, Redirect } from 'react-router-dom'

import { CREATE_FLAG, INCREMENT_VIEWS_COUNTER, REMOVE_FLAG } from './queries'

import { markdown, getIntl } from 'services'

import NotFound from 'scenes/NotFound'

import { Loading, Button, Flags, Tags } from 'components'
import Card, { CardTitle, CardText } from 'components/Card'
import Dropdown, { DropdownItem } from 'components/Dropdown'

import { ActionMenu } from '../../components'
import { FlagsDropdown, History, Meta, Share, Sources, Views } from './components'

const Read = ({ history, match, zNode, loading }) => {
  const [loaded, setLoaded] = useState(false)
  const [incremented, setIncremented] = useState(false)

  const [createFlag] = useMutation(CREATE_FLAG)
  const [removeFlag] = useMutation(REMOVE_FLAG)
  const [incrementViewsCounter] = useMutation(INCREMENT_VIEWS_COUNTER)

  useEffect(() => {
    if (!loaded || incremented) return
    incrementViewsCounter({ variables: { questionId: zNode.question.id } })
    setIncremented(true)
  }, [loaded, incremented, incrementViewsCounter, zNode])

  useEffect(() => {
    if (!loaded && zNode) setLoaded(true)
  }, [zNode, loaded])

  const intl = getIntl(Read)

  if (loading) return <Loading />

  if (zNode === null) {
    return <NotFound />
  }

  /* Redirect to correct URL if old slug used */
  const correctSlug = zNode.question.slug + '-' + zNode.id
  if (match.params.slug !== correctSlug) {
    return <Redirect to={'/q/' + correctSlug} />
  }

  return (
    <div>
      <Helmet>
        <title>FAQ - {markdown.title(zNode.question.title)}</title>
      </Helmet>
      <ActionMenu backLink="/" backLabel={intl('menu.home')} goBack>
        <FlagsDropdown
          zNode={zNode}
          onSelect={type => createFlag({ variables: { type, nodeId: zNode.id } })}
          onRemove={type => removeFlag({ variables: { type, nodeId: zNode.id } })}
        />
        <Dropdown button={<Button icon="edit" label={intl('menu.edit.label')} link />}>
          <DropdownItem icon="edit" onClick={() => history.push(`/q/${match.params.slug}/edit`)}>
            {intl('menu.edit.question')}
          </DropdownItem>
          <DropdownItem
            icon="question_answer"
            onClick={() => history.push(`/q/${match.params.slug}/answer`)}
          >
            {intl('menu.edit.answer')}
          </DropdownItem>
        </Dropdown>
      </ActionMenu>
      <Card>
        <CardTitle style={{ padding: '1.2rem' }}>
          <div className="grow">
            <h1>{markdown.title(zNode.question.title)}</h1>
            {zNode.tags.length > 0 && <Tags tags={zNode.tags} />}
          </div>
          <Flags node={zNode} withLabels={true} />
          <Views value={zNode.question.views} />
          <Share node={zNode} />
        </CardTitle>
        <CardText>
          {zNode.answer ? (
            <>
              <div style={{ padding: '0.5rem', marginBottom: '0.5rem' }}>
                {markdown.html(zNode.answer.content)}
              </div>
              <Sources sources={zNode.answer.sources} />
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
              <Link to={`/q/${match.params.slug}/answer`} className="btn-container">
                <Button icon="question_answer" primary>
                  {intl('answer')}
                </Button>
              </Link>
            </div>
          )}
          <hr />
          <Meta node={zNode} />
          <History />
        </CardText>
      </Card>
    </div>
  )
}

Read.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  zNode: PropTypes.object,
  loading: PropTypes.bool.isRequired
}

Read.translations = {
  en: {
    menu: {
      home: 'Home',
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
      home: 'Accueil',
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
