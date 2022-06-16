import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Redirect, Prompt } from 'react-router-dom'
import { useApolloClient } from '@apollo/react-hooks'

import { SUBMIT_ANSWER, EDIT_ANSWER } from './queries'

import { alert, markdown, getIntl } from 'services'
import { onListChange } from 'helpers'

import NotFound from 'scenes/NotFound'

import { Loading, Flags, Button, MarkdownEditor, CtrlEnter, PairInputList } from 'components'
import Card, { CardTitle, CardText, CardActions, PermanentClosableCard } from 'components/Card'

import { ActionMenu } from '../../components'

import { sourcesToKeyValuePairs, keyValuePairsToSources, canSubmit } from './helpers'

import Tips from './components/Tips'

const Answer = ({ zNode }) => {
  const [state, setState] = useState(() => {
    const answer = zNode && zNode.answer

    const initialText = answer ? answer.content : ''
    const initialSources = sourcesToKeyValuePairs(answer ? answer.sources : [])

    return {
      nodeLoaded: false,
      initialAnswer: initialText,
      answer: initialText,
      loading: false,
      sources: initialSources,
      initialSources: initialSources,
      slug: null,
      showTips: PermanentClosableCard.isOpen('tips_answer')
    }
  })

  const intl = getIntl(Answer)

  const apollo = useApolloClient()

  const { loadingSubmit, slug, showTips, sources } = state

  const onTextChange = value => setState(state => ({ ...state, answer: value }))
  const onSourcesChange = onListChange(
    changes => setState(state => ({ ...state, ...changes(state) })),
    'sources'
  )

  const toggleTips = value => () => {
    setState(state => ({ ...state, showTips: value }))
    PermanentClosableCard.setValue('tips_answer', value)
  }

  const submitAnswer = () => {
    setState(state => ({ ...state, loadingSubmit: true }))

    apollo
      .mutate({
        mutation: SUBMIT_ANSWER,
        variables: {
          nodeId: zNode.id,
          content: state.answer,
          sources: JSON.stringify(keyValuePairsToSources(state.sources))
        }
      })
      .then(() => {
        setState(state => ({ ...state, slug: zNode.question.slug + '-' + zNode.id }))
        alert.pushSuccess(intl('alert.submit_success'))
      })
      .catch(error => {
        alert.pushDefaultError(error)
        setState(state => ({ ...state, loadingSubmit: false }))
      })
  }

  const editAnswer = () => {
    setState(state => ({ ...state, loadingSubmit: true }))

    apollo
      .mutate({
        mutation: EDIT_ANSWER,
        variables: {
          id: zNode.answer.id,
          content: state.answer,
          previousContent: state.initialAnswer,
          sources: JSON.stringify(keyValuePairsToSources(state.sources))
        }
      })
      .then(() => {
        setState(state => ({ ...state, slug: zNode.question.slug + '-' + zNode.id }))
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
      zNode.answer ? editAnswer() : submitAnswer()
    }
  }

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
      {canSubmit(state) && <Prompt message={intl('prompt_warning')} />}
      <ActionMenu backLink={`/q/${zNode.question.slug}-${zNode.id}`}>
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
      <Card style={{ marginTop: '0.3rem' }}>
        <CardTitle style={{ padding: '1.2rem' }}>
          <div className="grow">
            <h1>{markdown.title(zNode.question.title)}</h1>
          </div>
          <Flags node={zNode} withLabels={true} />
        </CardTitle>
        <CardText>
          <CtrlEnter onCtrlEnterCallback={submitForm}>
            <MarkdownEditor content={state.answer} onChange={onTextChange} />
          </CtrlEnter>
        </CardText>
        <CardText>
          <PairInputList
            style={{ borderTop: '1px dashed var(--secondary-color)' }}
            pairs={sources}
            options={{
              title: intl('sources.title'),
              icons: { line: 'info_outline', value: 'link' },
              labels: intl('sources.labels')
            }}
            actions={onSourcesChange.actions}
          />
        </CardText>
        <CardActions>
          <Button
            label={zNode.answer ? intl('validate.edit') : intl('validate.submit')}
            primary
            raised
            disabled={!canSubmit(state)}
            onClick={submitForm}
          />
        </CardActions>
      </Card>
    </div>
  )
}

Answer.propTypes = {
  match: PropTypes.object.isRequired,
  zNode: PropTypes.object
}

Answer.translations = {
  en: {
    alert: {
      submit_success: 'Your answer was successfully submitted!',
      edit_success: 'The answer was successfully edited!'
    },
    prompt_warning: 'Are you sure you want to leave this page with an unsaved answer?',
    show_tips: 'Show tips',
    sources: {
      title: 'Sources:',
      labels: {
        add: 'Add a source link',
        more: 'More sources',
        key: 'Label',
        value: 'URL'
      }
    },
    validate: {
      submit: 'Submit answer',
      edit: 'Save answer'
    }
  },
  fr: {
    alert: {
      submit_success: 'Votre réponse a bien été envoyée !',
      edit_success: 'La réponse a bien été modifiée !'
    },
    prompt_warning: 'Êtes-vous sûr de vouloir quitter cette page sans enregistrer la réponse ?',
    show_tips: 'Voir conseils',
    sources: {
      title: 'Sources:',
      labels: {
        add: 'Ajouter une source',
        more: 'Plus de sources',
        key: 'Label',
        value: 'URL'
      }
    },
    validate: {
      submit: 'Envoyer la réponse',
      edit: 'Enregistrer la réponse'
    }
  }
}

export default Answer
