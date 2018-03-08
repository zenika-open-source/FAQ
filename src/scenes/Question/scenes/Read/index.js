import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Helmet from 'react-helmet'

import Card from 'react-toolbox/lib/card/Card'
import CardTitle from 'react-toolbox/lib/card/CardTitle'
import CardText from 'react-toolbox/lib/card/CardText'
import Avatar from 'react-toolbox/lib/avatar/Avatar'
import Tooltip from 'react-toolbox/lib/tooltip/Tooltip'
import Button from 'react-toolbox/lib/button/Button'

import { compose } from 'react-apollo'
import { getNode, createFlag } from './queries'

import { flags, markdown } from 'services'

import NotFound from 'scenes/NotFound'

import Loading from 'components/Loading'

import Meta from './components/Meta'
import OptionsMenu from './components/OptionsMenu'

const TooltipAvatar = Tooltip()(Avatar)

class Read extends Component {
  flag (type) {
    const { createFlag } = this.props
    const { ZNode } = this.props.data

    createFlag(type, ZNode.id)
  }

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
      <Fragment>
        <Helmet>
          <title>FAQ - {ZNode.question.title}</title>
        </Helmet>
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
              style={{ backgroundColor: '#f0f0f0', position: 'relative' }}
            >
              <OptionsMenu node={ZNode} />
            </CardTitle>
            <CardText style={{ paddingTop: '10px' }}>
              {ZNode.answer ? (
                <div>
                  <Meta node={ZNode} createFlag={this.flag.bind(this)} />
                  {markdown.html(ZNode.answer.content)}
                </div>
              ) : (
                <div
                  style={{
                    textAlign: 'center',
                    marginTop: '2rem',
                    marginBottom: '2rem'
                  }}
                >
                  <b>No answer yet...</b>
                  {flags.question.answer && (
                    <Fragment>
                      <br />
                      <br />
                      <Link to={`/q/${match.params.slug}/answer`}>
                        <Button icon="question_answer" accent raised>
                          Answer the question
                        </Button>
                      </Link>
                    </Fragment>
                  )}
                </div>
              )}
            </CardText>
          </Card>
        </div>
      </Fragment>
    )
  }
}

Read.propTypes = {
  match: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  createFlag: PropTypes.func.isRequired
}

export default compose(getNode, createFlag)(Read)
