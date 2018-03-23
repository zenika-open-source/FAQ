import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import omit from 'lodash/omit'

import { compose } from 'react-apollo'
import { submitAnswer, editAnswer } from './queries'
import { getNode } from '../Read/queries'

import { auth, markdown } from 'services'

import NotFound from 'scenes/NotFound'

import Loading from 'components/Loading'
import Card, { CardTitle, CardText, CardActions } from 'components/Card'
import Flags from 'components/Flags'
import Button from 'components/Button'

import ActionMenu from '../../components/ActionMenu'

import Sources from './components/Sources'

import ReactMde, { ReactMdeCommands } from 'react-mde'
import 'react-mde/lib/styles/css/react-mde-all.css'

class Answer extends Component {
  state = {
    answer: { text: '', selection: null },
    loading: false,
    redirect: false,
    sources: []
  }

  componentDidMount () {
    const { ZNode } = this.props.data

    if (ZNode && ZNode.answer) {
      this.setState({
        answer: { text: ZNode.answer.content },
        sources: ZNode.answer.sources
      })
    }
  }

  componentWillReceiveProps (nextProps) {
    const ZNode = this.props.data.ZNode
    const nextZNode = nextProps.data.ZNode

    if (!ZNode && nextZNode && nextZNode.answer) {
      this.setState({
        answer: { text: nextZNode.answer.content },
        sources: nextZNode.answer.sources
      })
    }
  }

  handleChange (value) {
    this.setState({ answer: value })
  }

  handleSourceChange = sources => {
    this.setState({ sources: sources })
  }

  submitAnswer = () => {
    const { submitAnswer } = this.props
    const { ZNode } = this.props.data
    const { answer } = this.state

    this.setState({ loadingSubmit: true })

    const answerObject = {
      content: answer.text,
      userId: auth.getUserNodeId()
    }

    submitAnswer(ZNode.id, answerObject)
      .then(result => {
        // To save sources
        this.editAnswer(result.data.updateZNode.answer.id)
      })
      .catch(error => {
        alert(error)
        // eslint-disable-next-line
        console.log(error)
      })
  }

  editAnswer = answerId => {
    const { editAnswer } = this.props
    const { ZNode } = this.props.data
    const { sources, answer } = this.state

    this.setState({ loadingSubmit: true })

    editAnswer(
      typeof answerId === 'string' ? answerId : ZNode.answer.id,
      answer.text,
      sources
        .map(s => {
          if (s.new) return omit(s, ['id', 'new'])
          return s
        })
        .filter(s => s.label !== '' && s.url !== '')
    )
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
    const { loadingSubmit, redirect, answer } = this.state
    const { loading, error, ZNode } = this.props.data

    if (redirect) {
      return <Redirect to={`/q/${ZNode.question.slug}`} />
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
        <ActionMenu backLink={`/q/${ZNode.question.slug}`} />
        <Card style={{ marginTop: '0.3rem' }}>
          <CardTitle style={{ padding: '1.2rem' }}>
            <div className="grow">
              <h1>{markdown.title(ZNode.question.title)}</h1>
            </div>
            <Flags node={ZNode} withLabels={true} />
          </CardTitle>
          <CardText>
            <ReactMde
              value={this.state.answer}
              showdownFlavor="github"
              onChange={this.handleChange.bind(this)}
              commands={ReactMdeCommands.getDefaultCommands()}
            />
          </CardText>
          <CardText>
            <Sources
              sources={this.state.sources}
              handleChange={this.handleSourceChange}
            />
          </CardText>
          <CardActions>
            <Button
              label={ZNode.answer ? 'Edit' : 'Submit'}
              primary
              raised
              disabled={answer.text.length === 0}
              onClick={ZNode.answer ? this.editAnswer : this.submitAnswer}
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

export default compose(submitAnswer, editAnswer, getNode)(Answer)
