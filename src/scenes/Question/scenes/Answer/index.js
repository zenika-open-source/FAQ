import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link, Redirect } from 'react-router-dom'

import { compose, graphql } from 'react-apollo'
import { submitAnswer, editAnswer } from './queries'
import { getNode } from '../Read/queries'

import { auth, markdown } from 'services'

import NotFound from 'scenes/NotFound'

import Loading from 'components/Loading'

import Button from 'react-toolbox/lib/button/Button'
import { Card, CardText, CardActions } from 'react-toolbox/lib/card'

import ReactMde, { ReactMdeCommands } from 'react-mde'
import 'react-mde/lib/styles/css/react-mde-all.css'
import 'font-awesome/css/font-awesome.css'

class Answer extends Component {
  constructor (props) {
    super(props)

    this.state = {
      answer: { text: '', selection: null },
      loading: false,
      redirect: false
    }
  }

  componentDidMount () {
    const { ZNode } = this.props.data
    if (ZNode && ZNode.answer) {
      this.setState({ answer: { text: ZNode.answer.content } })
    }
  }

  componentWillReceiveProps (nextProps) {
    const ZNode = this.props.data.ZNode
    const nextZNode = nextProps.data.ZNode
    if (!ZNode && nextZNode && nextZNode.answer) {
      this.setState({ answer: { text: nextZNode.answer.content } })
    }
  }

  handleChange (value) {
    this.setState({ answer: value })
  }

  submitAnswer () {
    const { submitAnswer } = this.props
    const id = this.props.match.params.id

    this.setState({ loadingSubmit: true })

    const answer = {
      content: this.state.answer.text,
      userId: auth.getUserNodeId()
    }

    submitAnswer(id, answer)
      .then(() => {
        this.setState({ redirect: true })
      })
      .catch(error => {
        alert(error)
        // eslint-disable-next-line
        console.log(error)
      })
  }

  editAnswer () {
    const { editAnswer } = this.props
    const { ZNode } = this.props.data

    this.setState({ loadingSubmit: true })

    editAnswer(ZNode.answer.id, this.state.answer.text, auth.getUserNodeId())
      .then(() => {
        this.setState({ redirect: true })
      })
      .catch(error => {
        alert(error)
        // eslint-disable-next-line
        console.log(error)
      })
  }

  render () {
    const { match } = this.props
    const { loadingSubmit, redirect } = this.state
    const { loading, error, ZNode } = this.props.data

    if (redirect) {
      return <Redirect to={`/q/${match.params.id}`} />
    }

    if (loadingSubmit || loading) {
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
        <Link to={`/q/${match.params.id}`}>
          <Button icon="chevron_left" label="Back" flat primary />
        </Link>
        <br />
        <h3 style={{ textAlign: 'center' }}>
          {markdown.title(ZNode.question.title)}
        </h3>
        <Card>
          <CardText>
            <div className="container">
              <ReactMde
                value={this.state.answer}
                showdownFlavor="github"
                onChange={this.handleChange.bind(this)}
                commands={ReactMdeCommands.getDefaultCommands()}
              />
            </div>
          </CardText>
          <CardActions
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end'
            }}
          >
            <Button
              label={ZNode.answer ? 'Edit' : 'Submit'}
              raised
              primary
              disabled={this.state.answer.text.length === 0}
              onClick={
                ZNode.answer
                  ? this.editAnswer.bind(this)
                  : this.submitAnswer.bind(this)
              }
            />
          </CardActions>
        </Card>
      </div>
    )
  }
}

Answer.propTypes = {
  match: PropTypes.object.isRequired,
  submitAnswer: PropTypes.func.isRequired,
  editAnswer: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
}

export default compose(
  graphql(submitAnswer, {
    name: 'submitAnswer',
    props: ({ submitAnswer }) => ({
      submitAnswer: (id, answer) => {
        return submitAnswer({ variables: { id, answer } })
      }
    }),
    options: props => ({
      refetchQueries: [
        {
          query: getNode,
          variables: {
            id: props.match.params.id
          }
        }
      ]
    })
  }),
  graphql(editAnswer, {
    name: 'editAnswer',
    props: ({ editAnswer }) => ({
      editAnswer: (idAnswer, content, idUser) => {
        return editAnswer({ variables: { idAnswer, content, idUser } })
      }
    }),
    options: props => ({
      refetchQueries: [
        {
          query: getNode,
          variables: {
            id: props.match.params.id
          }
        }
      ]
    })
  }),
  graphql(getNode, {
    options: props => ({ variables: { id: props.match.params.id } })
  })
)(Answer)
