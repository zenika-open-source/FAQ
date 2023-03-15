import { useApolloClient } from '@apollo/react-hooks'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { Prompt, Redirect } from 'react-router-dom'

import { EDIT_QUESTION, SUBMIT_QUESTION } from './queries'

import { alert, getIntl } from '@services'

import Card, { CardText, CardActions, PermanentClosableCard } from '@components/Card'
import { Loading, Button, Input, CtrlEnter, TagPicker } from '@components'

import { ActionMenu } from '../../components'

import { canSubmit } from './helpers'

import Tips from './components/Tips'

import './Edit.css'

const Edit = ({ location, match, zNode }) => {
  const [state, setState] = useState(() => {
    const passedQuestionText = location.state ? location.state.question : ''
    const initialQuestion = zNode ? zNode.question.title : passedQuestionText
    const initialTags = zNode ? zNode.tags.map(tag => tag.label) : []

    return {
      nodeLoaded: false,
      initialQuestion: initialQuestion,
      isEditing: !!match.params.slug,
      question: initialQuestion,
      loadingSubmit: false,
      slug: null,
      initialTags: initialTags,
      tags: initialTags,
      showTips: PermanentClosableCard.isOpen('tips_question')
    }
  })

  const intl = getIntl(Edit)

  const apollo = useApolloClient()

  const { isEditing, loadingSubmit, slug, question, tags, showTips } = state

  const toggleTips = value => () => {
    setState(state => ({ ...state, showTips: value }))
    PermanentClosableCard.setValue('tips_question', value)
  }

  const submitQuestion = () => {
    setState(state => ({ ...state, loadingSubmit: true }))

    apollo
      .mutate({
        mutation: SUBMIT_QUESTION,
        variables: {
          title: state.question,
          tags: state.tags.map(tag => tag.id)
        }
      })
      .then(({ data }) => {
        setState(state => ({
          ...state,
          slug: data.createQuestionAndTags.slug + '-' + data.createQuestionAndTags.node.id
        }))
        alert.pushSuccess(intl('alert.submit_success'))
      })
      .catch(error => {
        alert.pushDefaultError(error)
        setState(state => ({
          ...state,
          loadingSubmit: false
        }))
      })
  }

  const editQuestion = () => {
    setState(state => ({ ...state, loadingSubmit: true }))

    apollo
      .mutate({
        mutation: EDIT_QUESTION,
        variables: {
          questionId: zNode.question.id,
          title: state.question,
          previousTitle: state.initialQuestion,
          tags: state.tags.map(tag => tag.id)
        }
      })
      .then(({ data }) => {
        setState(state => ({
          ...state,
          slug: data.updateQuestionAndTags.slug + '-' + zNode.id
        }))
        alert.pushSuccess(intl('alert.edit_success'))
      })
      .catch(error => {
        alert.pushDefaultError(error)
        setState(state => ({
          ...state,
          loadingSubmit: false
        }))
      })
  }

  const submitForm = () => {
    if (canSubmit(state)) {
      const { isEditing } = state
      isEditing ? editQuestion() : submitQuestion()
    }
  }

  const onTextChange = e => {
    const question = e.target.value
    setState(state => ({ ...state, question }))
  }
  const onTagsChange = tags => setState(state => ({ ...state, tags }))

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
      {canSubmit(state) && <Prompt message={intl('prompt_warning')} />}
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
            onClick={toggleTips(true)}
          />
        )}
      </ActionMenu>
      <Tips close={toggleTips(false)} open={showTips} />
      <Card>
        <CardText style={{ display: 'flex', paddingBottom: 0 }}>
          <CtrlEnter onCtrlEnterCallback={submitForm} style={{ width: '100%' }}>
            <Input
              autoFocus
              icon="help"
              placeholder={intl('placeholder')}
              limit={100}
              value={question}
              onChange={onTextChange}
            />
          </CtrlEnter>
        </CardText>
        <CardText style={{ paddingBottom: '0.5rem' }}>
          <TagPicker tags={tags} onChange={onTagsChange} />
        </CardText>
        <CardActions>
          <Button
            label={isEditing ? intl('validate.edit') : intl('validate.submit')}
            disabled={!canSubmit(state)}
            primary
            raised
            onClick={submitForm}
          />
        </CardActions>
      </Card>
    </div>
  )
}

Edit.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  zNode: PropTypes.object
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

export default Edit
