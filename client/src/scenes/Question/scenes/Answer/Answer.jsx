import { useMutation } from '@apollo/client'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { Navigate } from 'react-router-dom'

import { EDIT_ANSWER, SUBMIT_ANSWER } from './queries'

import { Prompt, onListChange } from 'helpers'
import { alert, getIntl, markdown } from 'services'

import NotFound from 'scenes/NotFound'

import { Button, CtrlEnter, Flags, Loading, MarkdownEditor, PairInputList } from 'components'
import Card, { CardActions, CardText, CardTitle, PermanentClosableCard } from 'components/Card'

import { ActionMenu } from '../../components'

import { canSubmit, keyValuePairsToSources, sourcesToKeyValuePairs } from './helpers'

import Tips from './components/Tips'

const Answer = ({ zNode }) => {
  const answer = zNode && zNode.answer
  const [state, setState] = useState(() => {
    const initialText = answer ? answer.content : ''
    const initialSources = sourcesToKeyValuePairs(answer ? answer.sources : [])

    return {
      nodeLoaded: false,
      initialAnswer: initialText,
      answer: initialText,
      sources: initialSources,
      initialSources: initialSources,
      slug: null,
      showTips: PermanentClosableCard.isOpen('tips_answer'),
    }
  })

  const intl = getIntl(Answer)

  const { slug, showTips, sources } = state

  const onTextChange = (value) => setState({ ...state, answer: value })
  const onSourcesChange = onListChange(
    (changes) => setState((state) => ({ ...state, ...changes(state) })),
    'sources',
  )

  const toggleTips = (value) => () => {
    setState((state) => ({ ...state, showTips: value }))
    PermanentClosableCard.setValue('tips_answer', value)
  }

  const [submitAnswer, { loading: loadingSubmit }] = useMutation(SUBMIT_ANSWER, {
    variables: {
      nodeId: zNode.id,
      content: state.answer,
      sources: JSON.stringify(keyValuePairsToSources(state.sources)),
    },
    onCompleted() {
      setState((state) => ({ ...state, slug: zNode.question.slug + '-' + zNode.id }))
      alert.pushSuccess(intl('alert.submit_success'))
    },
    onError(error) {
      alert.pushDefaultError(error)
    },
  })

  const [editAnswer, { loading: loadingEdit }] = useMutation(EDIT_ANSWER, {
    variables: {
      id: zNode.answer?.id,
      content: state.answer,
      previousContent: state.initialAnswer,
      sources: JSON.stringify(keyValuePairsToSources(state.sources)),
    },
    refetchQueries: ['getNode'],
    onCompleted() {
      setState((state) => ({ ...state, slug: zNode.question.slug + '-' + zNode.id }))
      alert.pushSuccess(intl('alert.edit_success'))
    },
    onError(error) {
      alert.pushDefaultError(error)
    },
  })

  const submitForm = () => {
    if (canSubmit(state)) {
      zNode.answer ? editAnswer() : submitAnswer()
    }
  }

  if (slug) {
    return <Navigate to={`/q/${slug}`} />
  }

  if (loadingSubmit || loadingEdit) {
    return <Loading />
  }

  if (zNode === null) {
    return <NotFound />
  }

  return (
    <div>
      <Prompt message={intl('prompt_warning')} when={canSubmit(state, answer)} />
      <ActionMenu backLink={`/q/${zNode.question.slug}-${zNode.id}`}>
        {!showTips && (
          <Button
            intent="link"
            size="medium"
            icon="lightbulb_outline"
            label={intl('show_tips')}
            onClick={toggleTips(true)}
          />
        )}
      </ActionMenu>
      <Tips close={toggleTips(false)} open={showTips} />
      <Card className="mt-1">
        <CardTitle className="p-5">
          <div className="flex-grow">
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
            className="border border-primary-font border-dashed border-t-secondary pt-2"
            pairs={sources}
            options={{
              title: intl('sources.title'),
              icons: { line: 'info_outline', value: 'link' },
              labels: intl('sources.labels'),
            }}
            actions={onSourcesChange.actions}
          />
        </CardText>
        <CardActions>
          <Button
            label={zNode.answer ? intl('validate.edit') : intl('validate.submit')}
            intent={canSubmit(state) ? 'primary' : 'disabled'}
            action="raised"
            size="large"
            onClick={submitForm}
          />
        </CardActions>
      </Card>
    </div>
  )
}

Answer.propTypes = {
  zNode: PropTypes.object,
}

Answer.translations = {
  en: {
    alert: {
      submit_success: 'Your answer was successfully submitted!',
      edit_success: 'The answer was successfully edited!',
    },
    prompt_warning: 'Are you sure you want to leave this page with an unsaved answer?',
    show_tips: 'Show tips',
    sources: {
      title: 'Sources:',
      labels: {
        add: 'Add a source link',
        more: 'More sources',
        key: 'Label',
        value: 'URL',
      },
    },
    validate: {
      submit: 'Submit answer',
      edit: 'Save answer',
    },
  },
  fr: {
    alert: {
      submit_success: 'Votre réponse a bien été envoyée !',
      edit_success: 'La réponse a bien été modifiée !',
    },
    prompt_warning: 'Êtes-vous sûr de vouloir quitter cette page sans enregistrer la réponse ?',
    show_tips: 'Voir conseils',
    sources: {
      title: 'Sources:',
      labels: {
        add: 'Ajouter une source',
        more: 'Plus de sources',
        key: 'Label',
        value: 'URL',
      },
    },
    validate: {
      submit: 'Envoyer la réponse',
      edit: 'Enregistrer la réponse',
    },
  },
}

export default Answer
