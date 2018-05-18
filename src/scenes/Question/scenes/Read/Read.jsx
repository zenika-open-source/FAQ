import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Link, Redirect } from 'react-router-dom'
import Helmet from 'react-helmet'

import { createFlag } from './queries'

import { markdown } from 'services'

import NotFound from 'scenes/NotFound'

import Loading from 'components/Loading'
import Button from 'components/Button'
import Card, { CardTitle, CardText } from 'components/Card'
import Dropdown, { DropdownItem } from 'components/Dropdown'
import Flags, { flagMeta } from 'components/Flags'
import Tags from 'components/Tags'

import ActionMenu from '../../components/ActionMenu'
import Sources from './components/Sources'
import Meta from './components/Meta'
import Share from './components/Share'

const Read = ({ history, match, data, createFlag }) => {
  const { loading, error, ZNode } = data

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <div>Error :(</div>
  }

  if (ZNode === null) {
    return <NotFound {...this.props} />
  } else {
    /* Redirect to correct URL if old slug used */
    const correctSlug = ZNode.question.slug + '-' + ZNode.id
    if (match.params.slug !== correctSlug) {
      return <Redirect to={'/q/' + correctSlug} />
    }
  }

  return (
    <div>
      <Helmet>
        <title>FAQ - {markdown.title(ZNode.question.title)}</title>
      </Helmet>
      <ActionMenu backLink="/" backLabel="Home">
        <Dropdown button={<Button icon="flag" label="Flag as ..." link />}>
          {['incomplete', 'outdated', 'duplicate'].map(type => (
            <DropdownItem
              key={type}
              icon={flagMeta[type].icon}
              disabled={ZNode.flags.filter(f => f.type === type).length > 0}
              onClick={() => createFlag(type, ZNode.id)}
            >
              {type}
            </DropdownItem>
          ))}
        </Dropdown>
        <Dropdown button={<Button icon="edit" label="Edit ..." link />}>
          <DropdownItem
            icon="edit"
            onClick={() => history.push(`/q/${match.params.slug}/edit`)}
          >
            Question
          </DropdownItem>
          <DropdownItem
            icon="question_answer"
            onClick={() => history.push(`/q/${match.params.slug}/answer`)}
          >
            Answer
          </DropdownItem>
        </Dropdown>
      </ActionMenu>
      <Card>
        <CardTitle style={{ padding: '1.2rem' }}>
          <div className="grow">
            <h1>{markdown.title(ZNode.question.title)}</h1>
            {ZNode.tags.length > 0 && <Tags tags={ZNode.tags} />}
          </div>
          <Flags node={ZNode} withLabels={true} />
          <Share node={ZNode} />
        </CardTitle>
        <CardText>
          {ZNode.answer ? (
            <Fragment>
              <div style={{ padding: '0.5rem', marginBottom: '0.5rem' }}>
                {markdown.html(ZNode.answer.content)}
              </div>
              <Sources sources={ZNode.answer.sources} />
            </Fragment>
          ) : (
            <div
              style={{
                textAlign: 'center',
                marginTop: '2rem',
                marginBottom: '2rem'
              }}
            >
              <b>No answer yet...</b>
              <br />
              <br />
              <Link
                to={`/q/${match.params.slug}/answer`}
                className="btn-container"
              >
                <Button icon="question_answer" primary>
                  Answer the question
                </Button>
              </Link>
            </div>
          )}
          <hr />
          <Meta node={ZNode} />
        </CardText>
      </Card>
    </div>
  )
}

Read.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  createFlag: PropTypes.func.isRequired
}

export default createFlag(Read)
