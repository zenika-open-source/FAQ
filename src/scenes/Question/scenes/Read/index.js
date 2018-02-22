import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { DateTime } from 'luxon'

import { graphql } from 'react-apollo'
import { getNode } from './queries'

import { flags, markdown } from 'services'

import NotFound from 'scenes/NotFound'

import Loading from 'components/Loading'

import Card from 'react-toolbox/lib/card/Card'
import CardTitle from 'react-toolbox/lib/card/CardTitle'
import CardText from 'react-toolbox/lib/card/CardText'
import Avatar from 'react-toolbox/lib/avatar/Avatar'
import Tooltip from 'react-toolbox/lib/tooltip/Tooltip'
import Button from 'react-toolbox/lib/button/Button'
import 'react-mde/lib/styles/css/react-mde-all.css'

const TooltipAvatar = Tooltip()(Avatar)

class Read extends Component {
  render () {
    const { match } = this.props
    const { loading, error, ZNode } = this.props.data

    if (loading) {
      return <Loading />
    }

    if (error) {
      return <div>Error :(</div>
    }

    if (ZNode === null) {
      return <NotFound {...this.props} />
    }

    return (
      <div>
        <Link to="/">
          <Button icon="chevron_left" label="Home" flat primary />
        </Link>
        <Card style={{ marginTop: '1rem' }} raised>
          <CardTitle
            avatar={
              <TooltipAvatar
                tooltip={ZNode.question.user.name + ''}
                tooltipPosition="top"
                image={ZNode.question.user.picture + ''}
              />
            }
            title={markdown.title(ZNode.question.title)}
            style={{ backgroundColor: '#f0f0f0' }}
          />
          <CardText style={{ paddingTop: '10px' }}>
            {ZNode.answer ? (
              <div>
                <b>
                  Answered by {ZNode.answer.user.name} on{' '}
                  {DateTime.fromISO(ZNode.answer.createdAt).toFormat(
                    'dd LLL yyyy'
                  )}:
                </b>
                <br />
                {markdown.html(ZNode.answer.content)}
              </div>
            ) : flags.question.answer ? (
              <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                <b>No answer yet...</b>
                <br />
                <br />
                <Link to={`/q/${match.params.id}/answer`}>
                  <Button icon="question_answer" accent raised>
                    Answer the question
                  </Button>
                </Link>
              </div>
            ) : (
              <i>No answer yet...</i>
            )}
          </CardText>
        </Card>
      </div>
    )
  }
}

Read.propTypes = {
  match: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired
}

export default graphql(getNode, {
  options: ({ match }) => ({ variables: { id: match.params.id } })
})(Read)
