import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Redirect, Prompt } from 'react-router-dom'
import omit from 'lodash/omit'

import { compose } from 'react-apollo'
import { submitAnswer, editAnswer } from './queries'
import { getNode } from 'scenes/Question/queries'

import { auth, markdown } from 'services'

import NotFound from 'scenes/NotFound'

import Loading from 'components/Loading'
import Card, {
  CardTitle,
  CardText,
  CardActions,
  PermanentClosableCard
} from 'components/Card'
import Flags from 'components/Flags'
import Button from 'components/Button'
import onCtrlEnter from 'components/onCtrlEnter'

import ActionMenu from '../../components/ActionMenu'

import Sources from './components/Sources'
import Tips from './components/Tips'

import ReactMde, { ReactMdeCommands } from 'react-mde'
import 'react-mde/lib/styles/css/react-mde-all.css'

const CtrlEnterCardText = onCtrlEnter(CardText)

class Answer extends Component {
  state = {
    nodeLoaded: false,
    answer: { text: '', selection: null },
    loading: false,
    sources: [],
    slug: null,
    showTips: PermanentClosableCard.isOpen('tips_answer')
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    const { data: { ZNode } } = nextProps
    const { nodeLoaded } = prevState

    if (!nodeLoaded && ZNode && ZNode.answer) {
      return {
        nodeLoaded: true,
        answer: { text: ZNode.answer.content },
        sources: ZNode.answer.sources
      }
    }

    return null
  }

  cleanSources () {
    const { sources } = this.state
    return sources
      .map(s => {
        if (s.new) return omit(s, ['id', 'new'])
        return s
      })
      .filter(s => s.label !== '' && s.url !== '')
  }

  handleChange (value) {
    this.setState({ answer: value })
  }

  handleSourceChange = sources => {
    this.setState({ sources: sources })
  }

  submitForm = () => {
    const { ZNode } = this.props.data
    ZNode.answer ? this.editAnswer() : this.submitAnswer()
  }

  submitAnswer = () => {
    const { submitAnswer } = this.props
    const { ZNode } = this.props.data
    const { answer } = this.state

    this.setState({ loadingSubmit: true })

    const answerObject = {
      content: answer.text,
      userId: auth.getUserNodeId(),
      sources: this.cleanSources()
    }

    submitAnswer(ZNode.id, answerObject)
      .then(() => {
        this.setState({ slug: ZNode.question.slug + '-' + ZNode.id })
      })
      .catch(error => {
        alert(error)
        // eslint-disable-next-line
        console.log(error)
      })
  }

  editAnswer = (nodeId, answerId) => {
    const { editAnswer } = this.props
    const { ZNode } = this.props.data
    const { answer } = this.state

    this.setState({ loadingSubmit: true })

    editAnswer(
      typeof nodeId === 'string' ? nodeId : ZNode.id,
      typeof answerId === 'string' ? answerId : ZNode.answer.id,
      answer.text,
      this.cleanSources()
    )
      .then(() => {
        this.setState({ slug: ZNode.question.slug + '-' + ZNode.id })
      })
      .catch(error => {
        alert(error)
        // eslint-disable-next-line
        console.log(error)
      })
  }

  openTips = () => {
    this.setState({ showTips: true })
    PermanentClosableCard.setValue('tips_answer', true)
  }

  closeTips = () => {
    this.setState({ showTips: false })
    PermanentClosableCard.setValue('tips_answer', false)
  }

  render () {
    const { loadingSubmit, slug, answer, showTips } = this.state
    const { loading, error, ZNode } = this.props.data

    if (slug) {
      return <Redirect to={`/q/${slug}`} />
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
        <Prompt message="Are you sure you want to leave this page with an unsaved answer?" />
        <ActionMenu backLink={`/q/${ZNode.question.slug}-${ZNode.id}`}>
          {!showTips && (
            <Button
              link
              icon="lightbulb_outline"
              label="Show tips"
              onClick={this.openTips}
            />
          )}
        </ActionMenu>
        <Tips close={this.closeTips} open={showTips} />
        <Card style={{ marginTop: '0.3rem' }}>
          <CardTitle style={{ padding: '1.2rem' }}>
            <div className="grow">
              <h1>{markdown.title(ZNode.question.title)}</h1>
            </div>
            <Flags node={ZNode} withLabels={true} />
          </CardTitle>
          <CtrlEnterCardText onCtrlEnterCallback={this.submitForm}>
            <ReactMde
              value={this.state.answer}
              showdownFlavor="github"
              onChange={this.handleChange.bind(this)}
              commands={ReactMdeCommands.getDefaultCommands()}
            />
          </CtrlEnterCardText>
          <CardText>
            <Sources
              sources={this.state.sources}
              handleChange={this.handleSourceChange}
            />
          </CardText>
          <CardActions>
            <Button
              label={ZNode.answer ? 'Save answer' : 'Submit answer'}
              primary
              raised
              disabled={answer.text.length === 0}
              onClick={this.submitForm}
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
