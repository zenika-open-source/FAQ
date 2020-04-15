import React, { useState, useCallback, useEffect } from 'react'
import { useMutation, gql } from '@apollo/client'

import {
  Card,
  CtrlEnter,
  Input,
  Button,
  Loading,
  TagPicker,
  PermanentClosableCard
} from 'components'
import { useIntl, alert } from 'services'
import NotFound from 'scenes/NotFound'

import { useNode } from '../../queries'
import { ActionMenu, EditTips } from '../../components'

const Update = ({ match, history }) => {
  const intl = useIntl(Update)
  const [title, setTitle] = useState('')
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(false)
  const [showTips, setShowTips] = useState(() => PermanentClosableCard.isOpened('tips_edit'))

  const { loading: nodeLoading, data } = useNode(match.params.slugid)
  const node = data?.node

  useEffect(() => {
    if (node) {
      setTitle(node.question.title)
      setTags(node.tags.map(tag => tag.label))
    }
  }, [node])

  const [updateMutation] = useMutation(gql`
    mutation($id: String!, $title: String!, $previousTitle: String!, $tags: [String!]!) {
      updateQuestion(id: $id, title: $title, previousTitle: $previousTitle, tags: $tags) {
        id
        question {
          id
          title
          slug
          user {
            id
          }
          createdAt
        }
      }
    }
  `)

  const submitUpdate = useCallback(() => {
    setLoading(true)
    updateMutation({
      variables: {
        id: node.id,
        title,
        previousTitle: node.question.title,
        tags: tags.map(t => t.id)
      }
    })
      .then(
        ({
          data: {
            updateQuestion: {
              id,
              question: { slug }
            }
          }
        }) => {
          alert.pushSuccess(intl('alert.success'))
          history.push(`/q/${slug}-${id}`)
        }
      )
      .catch(err => {
        alert.pushDefaultError(err)
        setLoading(false)
      })
  }, [intl, node, title, tags, history, updateMutation])

  const toggleTips = value => () => {
    setShowTips(value)
    PermanentClosableCard.setOpened('tips_edit', value)
  }

  if (nodeLoading && !node) return <Loading />

  if (!node) return <NotFound />

  return (
    <div className="edit">
      <ActionMenu>
        <Button
          link
          icon="lightbulb_outline"
          label={intl('show_tips')}
          onClick={toggleTips(!showTips)}
        />
      </ActionMenu>
      <EditTips opened={showTips} onClose={toggleTips(false)} />
      <Card>
        <Card.Text style={{ display: 'flex', paddingBottom: 0 }}>
          <CtrlEnter onCtrlEnter={submitUpdate} style={{ width: '100%' }}>
            <Input
              autoFocus
              icon="help"
              placeholder={intl('placeholder')}
              limit={100}
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </CtrlEnter>
        </Card.Text>
        <Card.Text style={{ paddingBottom: '0.5rem' }}>
          <TagPicker tags={tags} onChange={setTags} />
        </Card.Text>
        <Card.Actions>
          <Button
            label={intl('validate')}
            primary
            raised
            onClick={submitUpdate}
            disabled={!title || loading}
            loading={loading}
          />
        </Card.Actions>
      </Card>
    </div>
  )
}

Update.translations = {
  en: {
    title: 'Edit question',
    alert: {
      success: 'The question was successfully edited!'
    },
    prompt_warning: 'Are you sure you want to leave this page with an unsaved question?',
    home: 'Home',
    show_tips: 'Show tips',
    placeholder: 'E.g.: How to fill an expense report?',
    validate: 'Edit'
  },
  fr: {
    title: {
      submit: 'Poser une nouvelle question',
      edit: 'Modifier une question'
    },
    alert: {
      success: 'La question a bien été modifiée !'
    },
    prompt_warning: 'Êtes-vous sûr de vouloir quitter cette page sans enregistrer la question ?',
    home: 'Accueil',
    show_tips: 'Voir conseils',
    placeholder: 'Ex: Comment remplir une note de frais ?',
    validate: 'Enregistrer la question'
  }
}

export default Update
