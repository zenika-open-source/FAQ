import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Redirect, Prompt } from 'react-router-dom'
import difference from 'lodash/difference'

import { compose } from 'react-apollo'
import { submitQuestion, editQuestion } from './queries'

import { alert } from 'services'

import Card, {
  CardText,
  CardActions,
  PermanentClosableCard
} from 'components/Card'
import { Loading, Button, Input, CtrlEnter, TagPicker } from 'components'

import ActionMenu from '../../components/ActionMenu'

import Tips from './components/Tips'

import './Edit.css'

class Edit extends Component {
  constructor(props) {
    super(props)

    const { location, zNode } = this.props

    const passedQuestionText = location.state ? location.state.question : ''
    const initialQuestion = zNode ? zNode.question.titleTranslations[0].text : passedQuestionText
    const initialTags = zNode ? zNode.tags.map(x => x.label) : []

    this.state = {
      nodeLoaded: false,
      initialQuestion: initialQuestion,
      isEditing: !!this.props.match.params.slug,
      question: initialQuestion,
      loadingSubmit: false,
      slug: null,
      initialTags: initialTags,
      tags: initialTags,
      showTips: PermanentClosableCard.isOpen('tips_question')
    }
  }

  onTextChange = e => {
    this.setState({ question: e.target.value })
  }

  submitForm = () => {
    if (this.canSubmit()) {
      const { isEditing } = this.state
      isEditing ? this.editQuestion() : this.submitQuestion()
    }
  }

  submitQuestion = () => {
    const { submitQuestion } = this.props

    this.setState({ loadingSubmit: true })

    submitQuestion(this.state.question, this.state.tags)
      .then(({ data }) => {
        this.setState({
          slug:
            data.createQuestionAndTags.slug +
            '-' +
            data.createQuestionAndTags.node.id
        })
        alert.pushSuccess('Your question was successfully submitted!')
      })
      .catch(error => {
        alert.pushError(
          <>
            <p>{error.message || 'An unknown error occured.'}</p>
            <p>Please, try again</p>
          </>,
          error
        )
        this.setState({
          loadingSubmit: false
        })
      })
  }

  editQuestion = () => {
    const { editQuestion, zNode } = this.props

    this.setState({ loadingSubmit: true })

    editQuestion(
      zNode.question.id,
      this.state.question,
      this.state.tags,
      zNode.id
    )
      .then(({ data }) => {
        this.setState({
          slug: data.updateQuestionAndTags.slug + '-' + zNode.id
        })
        alert.pushSuccess('The question was successfully edited!')
      })
      .catch(error => {
        alert.pushError(
          <>
            <p>{error.message || 'An unknown error occured.'}</p>
            <p>Please, try again</p>
          </>,
          error
        )
        this.setState({
          loadingSubmit: false
        })
      })
  }

  toggleTips = value => () => {
    this.setState({ showTips: value })
    PermanentClosableCard.setValue('tips_question', value)
  }

  onTagsChange = tags => this.setState({ tags })

  canSubmit() {
    const { question, initialQuestion, tags, initialTags } = this.state

    return !(
      question.length === 0 ||
      (question === initialQuestion &&
        difference(tags, initialTags).length === 0 &&
        difference(initialTags, tags).length === 0)
    )
  }

  render() {
    const { match, zNode } = this.props
    const {
      isEditing,
      loadingSubmit,
      slug,
      question,
      tags,
      showTips
    } = this.state

    if (slug) {
      return <Redirect to={`/q/${slug}`} />
    }

    if (loadingSubmit) {
      return <Loading />
    }

    if (isEditing && zNode === null) {
      return <Redirect to={'/'} />
    }

    return (
      <div className="Edit">
        {this.canSubmit() && (
          <Prompt message="Are you sure you want to leave this page with an unsaved question?" />
        )}
        <ActionMenu
          backLabel={isEditing ? 'Back' : 'Home'}
          backLink={isEditing ? `/q/${match.params.slug}` : '/'}
          title={isEditing ? 'Edit question' : 'Ask a new question'}
        >
          {!showTips && (
            <Button
              link
              icon="lightbulb_outline"
              label="Show tips"
              onClick={this.toggleTips(true)}
            />
          )}
        </ActionMenu>
        <Tips close={this.toggleTips(false)} open={showTips} />
        <Card>
          <CardText style={{ display: 'flex', paddingBottom: 0 }}>
            <CtrlEnter
              onCtrlEnterCallback={this.submitForm}
              style={{ width: '100%' }}
            >
              <Input
                autoFocus
                icon="help"
                placeholder="Ex: Comment remplir une note de frais ?"
                limit={100}
                value={question}
                onChange={this.onTextChange}
              />
            </CtrlEnter>
          </CardText>
          <CardText style={{ paddingBottom: '0.5rem' }}>
            <TagPicker tags={tags} onChange={this.onTagsChange} />
          </CardText>
          <CardActions>
            <Button
              label={isEditing ? 'Edit' : 'Submit'}
              disabled={!this.canSubmit()}
              primary
              raised
              onClick={this.submitForm}
            />
          </CardActions>
        </Card>
      </div>
    )
  }
}

Edit.propTypes = {
  match: PropTypes.object.isRequired,
  submitQuestion: PropTypes.func.isRequired,
  editQuestion: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  zNode: PropTypes.object
}

export default compose(
  submitQuestion,
  editQuestion
)(Edit)
