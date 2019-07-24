import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Redirect, Prompt } from 'react-router-dom'
import difference from 'lodash/difference'

import { compose } from 'react-apollo'
import { submitQuestion, editQuestion } from './queries'

import { alert, useIntl } from 'services'

import Card, { CardText, CardActions, PermanentClosableCard } from 'components/Card'
import { withLoading, Loading, Button, Input, CtrlEnter, TagPicker } from 'components'

import { ActionMenu } from '../../components'

import Tips from './components/Tips'

import './Edit.css'

class Edit extends Component {
  constructor(props) {
    super(props)

    const { location, node } = this.props

    const passedQuestionText = location.state ? location.state.question : ''
    const initialQuestion = node ? node.question.title : passedQuestionText
    const initialTags = node ? node.tags.map(x => x.label) : []

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
    const intl = useIntl(Edit)

    const { submitQuestion } = this.props

    this.setState({ loadingSubmit: true })

    submitQuestion(this.state.question, this.state.tags)
      .then(({ data }) => {
        this.setState({
          slug: data.createQuestionAndTags.slug + '-' + data.createQuestionAndTags.node.id
        })
        alert.pushSuccess(intl('alert.submit_success'))
      })
      .catch(error => {
        alert.pushDefaultError(error)
        this.setState({
          loadingSubmit: false
        })
      })
  }

  editQuestion = () => {
    const intl = useIntl(Edit)

    const { editQuestion, node } = this.props

    this.setState({ loadingSubmit: true })

    editQuestion(
      node.question.id,
      this.state.question,
      this.state.initialQuestion,
      this.state.tags,
      node.id
    )
      .then(({ data }) => {
        this.setState({
          slug: data.updateQuestionAndTags.slug + '-' + node.id
        })
        alert.pushSuccess(intl('alert.edit_success'))
      })
      .catch(error => {
        alert.pushDefaultError(error)
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
    const intl = useIntl(Edit)

    const { match, node } = this.props
    const { isEditing, loadingSubmit, slug, question, tags, showTips } = this.state

    if (slug) {
      return <Redirect to={`/q/${slug}`} />
    }

    if (loadingSubmit) {
      return <Loading />
    }

    if (isEditing && node === null) {
      return <Redirect to={'/'} />
    }

    return (
      <div className="Edit">
        {this.canSubmit() && <Prompt message={intl('prompt_warning')} />}
        <ActionMenu
          backLabel={!isEditing ? intl('home') : null}
          backLink={isEditing ? `/q/${match.params.slug}` : '/'}
          title={isEditing ? intl('title.edit') : intl('title.submit')}
        >
          {!showTips && (
            <Button
              link
              icon="lightbulb_outline"
              label={intl('show_tips')}
              onClick={this.toggleTips(true)}
            />
          )}
        </ActionMenu>
        <Tips close={this.toggleTips(false)} open={showTips} />
        <Card>
          <CardText style={{ display: 'flex', paddingBottom: 0 }}>
            <CtrlEnter onCtrlEnterCallback={this.submitForm} style={{ width: '100%' }}>
              <Input
                autoFocus
                icon="help"
                placeholder={intl('placeholder')}
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
              label={isEditing ? intl('validate.edit') : intl('validate.submit')}
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
  node: PropTypes.object
}

Edit.translations = {
  en: {
    title: {
      submit: 'Ask a new question',
      edit: 'Edit question'
    },
    alert: {
      submit_success: 'Your question was successfully submitted!',
      edit_success: 'The question was successfully edited!'
    },
    prompt_warning: 'Are you sure you want to leave this page with an unsaved question?',
    home: 'Home',
    show_tips: 'Show tips',
    placeholder: 'E.g.: How to fill an expense report?',
    validate: {
      submit: 'Submit',
      edit: 'Edit'
    }
  },
  fr: {
    title: {
      submit: 'Poser une nouvelle question',
      edit: 'Modifier une question'
    },
    alert: {
      submit_success: 'Votre question a bien été envoyée !',
      edit_success: 'La question a bien été modifiée !'
    },
    prompt_warning: 'Êtes-vous sûr de vouloir quitter cette page sans enregistrer la question ?',
    home: 'Accueil',
    show_tips: 'Voir conseils',
    placeholder: 'Ex: Comment remplir une note de frais ?',
    validate: {
      submit: 'Envoyer la question',
      edit: 'Enregistrer la question'
    }
  }
}

export default compose(
  submitQuestion,
  editQuestion,
  withLoading()
)(Edit)
