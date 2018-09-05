import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Redirect, Prompt } from 'react-router-dom'
import omit from 'lodash/omit'
import differenceWith from 'lodash/differenceWith'
import isEqual from 'lodash/isEqual'

import { compose } from 'react-apollo'
import { submitAnswer, editAnswer } from './queries'

import { markdown } from 'services'

import NotFound from 'scenes/NotFound'

import { Loading, Flags, Button, MarkdownEditor, CtrlEnter } from 'components'
import Card, {
  CardTitle,
  CardText,
  CardActions,
  PermanentClosableCard
} from 'components/Card'

import ActionMenu from '../../components/ActionMenu'

import Sources from './components/Sources'
import Tips from './components/Tips'

class Answer extends Component {
  constructor(props) {
    super(props)

    const answer = props.zNode && props.zNode.answer

    const initialText = answer ? answer.content : ''
    const initialSources = answer ? answer.sources : []

    this.state = {
      nodeLoaded: false,
      initialAnswer: initialText,
      answer: { text: initialText, selection: null },
      loading: false,
      sources: initialSources,
      initialSources: initialSources,
      slug: null,
      showTips: PermanentClosableCard.isOpen('tips_answer')
    }
  }

  cleanSources() {
    const { sources } = this.state
    return sources
      .map(s => {
        if (s.new) return omit(s, ['id', 'new'])
        return s
      })
      .filter(s => s.label !== '' && s.url !== '')
  }

  onTextChange = value => this.setState({ answer: value })

  onSourceChange = sources => this.setState({ sources: sources })

  submitForm = () => {
    if (this.canSubmit()) {
      const { zNode } = this.props
      zNode.answer ? this.editAnswer() : this.submitAnswer()
    }
  }

  submitAnswer = () => {
    const { submitAnswer } = this.props
    const { zNode } = this.props
    const { answer } = this.state

    this.setState({ loadingSubmit: true })

    const content = answer.text
    const sources = this.cleanSources()

    submitAnswer(content, sources, zNode.id)
      .then(() => {
        this.setState({ slug: zNode.question.slug + '-' + zNode.id })
      })
      .catch(error => {
        alert(error)
        // eslint-disable-next-line
        console.log(error)
      })
  }

  editAnswer = (nodeId, answerId) => {
    const { editAnswer, zNode } = this.props
    const { answer } = this.state

    this.setState({ loadingSubmit: true })

    editAnswer(
      typeof answerId === 'string' ? answerId : zNode.answer.id,
      answer.text,
      this.cleanSources()
    )
      .then(() => {
        this.setState({ slug: zNode.question.slug + '-' + zNode.id })
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

  canSubmit() {
    const { answer, initialAnswer, sources, initialSources } = this.state
    return !(
      answer.text.length === 0 ||
      (answer.text === initialAnswer &&
        differenceWith(sources, initialSources, isEqual).length === 0 &&
        differenceWith(initialSources, sources, isEqual).length === 0)
    )
  }

  render() {
    const { loadingSubmit, slug, showTips } = this.state
    const { zNode } = this.props

    if (slug) {
      return <Redirect to={`/q/${slug}`} />
    }

    if (loadingSubmit) {
      return <Loading />
    }

    if (zNode === null) {
      return <NotFound />
    }

    return (
      <div>
        {this.canSubmit() && (
          <Prompt message="Are you sure you want to leave this page with an unsaved answer?" />
        )}
        <ActionMenu backLink={`/q/${zNode.question.slug}-${zNode.id}`}>
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
              <h1>{markdown.title(zNode.question.title)}</h1>
            </div>
            <Flags node={zNode} withLabels={true} />
          </CardTitle>
          <CardText>
            <CtrlEnter onCtrlEnterCallback={this.submitForm}>
              <MarkdownEditor
                content={this.state.answer}
                onChange={this.onTextChange}
              />
            </CtrlEnter>
          </CardText>
          <CardText>
            <Sources
              sources={this.state.sources}
              onChange={this.onSourceChange}
            />
          </CardText>
          <CardActions>
            <Button
              label={zNode.answer ? 'Save answer' : 'Submit answer'}
              primary
              raised
              disabled={!this.canSubmit()}
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
  zNode: PropTypes.object
}

export default compose(
  submitAnswer,
  editAnswer
)(Answer)
