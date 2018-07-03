import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Link, Redirect } from 'react-router-dom'
import Helmet from 'react-helmet'

import { compose } from 'react-apollo'
import { createFlag, removeFlag } from './queries'

import { markdown } from 'services'

import NotFound from 'scenes/NotFound'

import Loading from 'components/Loading'
import Button from 'components/Button'
import Card, { CardTitle, CardText } from 'components/Card'
import Dropdown, { DropdownItem } from 'components/Dropdown'
import Flags from 'components/Flags'
import Tags from 'components/Tags'

import ActionMenu from '../../components/ActionMenu'
import FlagsDropdown from './components/FlagsDropdown'
import Sources from './components/Sources'
import Meta from './components/Meta'
import Share from './components/Share'
import History from './components/History'

const Read = ({ history, match, data, createFlag, removeFlag }) => {
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
        <FlagsDropdown
          flags={ZNode.flags}
          onSelect={type => createFlag(type, ZNode.id)}
          onRemove={type => removeFlag(type, ZNode.id)}
        />
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
        <CardTitle style={{ padding: '0.9rem' }}>
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
          <History node={ZNode} />
        </CardText>
      </Card>
    </div>
  )
}

Read.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  createFlag: PropTypes.func.isRequired,
  removeFlag: PropTypes.func.isRequired
}

export default compose(createFlag, removeFlag)(Read)
