import React, { useState, useEffect } from 'react'
import { useMutation, gql } from '@apollo/client'

import {
  Card,
  CtrlEnter,
  Button,
  Loading,
  PairInputList,
  PermanentClosableCard,
  MarkdownEditor,
  Flags
} from 'components'
import { markdown, useIntl, alert } from 'services'
import { onListChange } from 'helpers'
import NotFound from 'scenes/NotFound'

import { useNode } from '../../queries'
import { ActionMenu, AnswerTips } from '../../components'

import { sourcesToKeyValuePairs, keyValuePairsToSources, canSubmit } from './helpers'

const Answer = ({ match, history }) => {
  const intl = useIntl(Answer)
  const [loading, setLoading] = useState(false)
  const [answer, setAnswer] = useState('')
  const [sources, setSources] = useState([])
  const [showTips, setShowTips] = useState(() => PermanentClosableCard.isOpened('tips_answer'))

  const { loading: nodeLoading, data } = useNode(match.params.slugid)
  const node = data?.node

  useEffect(() => {
    if (node) {
      setAnswer(node.answer?.content || '')
      setSources(sourcesToKeyValuePairs(node.answer?.sources || []))
    }
  }, [node])

  const [submitAnswer] = useMutation(gql`
    mutation($content: String!, $sources: String!, $nodeId: String!) {
      createAnswerAndSources(content: $content, sources: $sources, nodeId: $nodeId) {
        id
        content
        sources {
          label
          url
        }
        node {
          id
          answer {
            id
          }
        }
        user {
          id
        }
        createdAt
      }
    }
  `)

  const [editAnswer] = useMutation(gql`
    mutation(
      $id: String!
      $content: String!
      $previousContent: String!
      $sources: String!
      $previousSources: String!
    ) {
      updateAnswerAndSources(
        id: $id
        content: $content
        previousContent: $previousContent
        sources: $sources
        previousSources: $previousSources
      ) {
        id
        content
        sources {
          label
          url
        }
      }
    }
  `)

  const toggleTips = value => () => {
    setShowTips(value)
    PermanentClosableCard.setOpened('tips_answer', value)
  }

  const submitForm = () => {
    const nextSources = JSON.stringify(keyValuePairsToSources(sources))

    setLoading(true)
    let mutation

    if (!node.answer) {
      mutation = submitAnswer({
        variables: {
          nodeId: node.id,
          content: answer,
          sources: nextSources
        }
      })
    } else {
      mutation = editAnswer({
        variables: {
          id: node.answer.id,
          content: answer,
          previousContent: node.answer.content,
          sources: nextSources,
          previousSources: JSON.stringify(node.answer.sources)
        }
      })
    }

    mutation
      .then(() => {
        history.push(`/q/${node.question.slug}-${node.id}`)
        alert.pushSuccess(intl(node.answer ? 'alert.edit_success' : 'alert.submit_success'))
      })
      .catch(error => {
        alert.pushDefaultError(error)
        setLoading(false)
      })
  }

  const onSourcesChange = onListChange(
    changes => setSources(sources => changes({ sources }).sources),
    'sources'
  )

  if (nodeLoading && !node) return <Loading />

  if (!node) return <NotFound />

  return (
    <div className="answer">
      <ActionMenu>
        <Button
          link
          icon="lightbulb_outline"
          label={intl('show-tips')}
          onClick={toggleTips(!showTips)}
        />
      </ActionMenu>
      <AnswerTips opened={showTips} onClose={toggleTips(false)} />
      <Card>
        <Card.Title>
          <div className="grow">
            <h1>{markdown.title(node.question.title)}</h1>
          </div>
          <Flags node={node} withLabels={true} />
        </Card.Title>
        <Card.Text>
          <CtrlEnter onCtrlEnter={submitForm}>
            <MarkdownEditor content={answer} onChange={setAnswer} />
          </CtrlEnter>
        </Card.Text>
        <Card.Text>
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
        </Card.Text>
        <Card.Actions>
          <Button
            label={node.answer ? intl('validate.edit') : intl('validate.submit')}
            primary
            raised
            disabled={
              !canSubmit(node, {
                answer,
                sources: JSON.stringify(keyValuePairsToSources(sources))
              }) || loading
            }
            loading={loading}
            onClick={submitForm}
          />
        </Card.Actions>
      </Card>
    </div>
  )
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
