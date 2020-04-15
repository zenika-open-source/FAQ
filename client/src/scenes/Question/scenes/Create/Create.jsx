import React, { useState, useCallback } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { useMutation, gql } from '@apollo/client'

import { Card, CtrlEnter, Input, Button, TagPicker, PermanentClosableCard } from 'components'
import { useIntl, alert } from 'services'
import { unserialize } from 'helpers'

import { ActionMenu, EditTips } from '../../components'

const Create = () => {
  const intl = useIntl(Create)
  const location = useLocation()
  const history = useHistory()
  const [title, setTitle] = useState(unserialize(location.search).q)
  const [tags, setTags] = useState(unserialize(location.search).tags)
  const [loading, setLoading] = useState(false)
  const [showTips, setShowTips] = useState(() => PermanentClosableCard.isOpened('tips_edit'))

  const [createMutation] = useMutation(gql`
    mutation($title: String!, $tags: [String!]!) {
      createQuestion(title: $title, tags: $tags) {
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
        answer {
          id
        }
        tags {
          id
          label {
            id
            name
          }
          user {
            id
          }
        }
      }
    }
  `)

  const submitCreate = useCallback(() => {
    setLoading(true)
    createMutation({
      variables: {
        title,
        tags: tags.map(t => t.id)
      }
    })
      .then(
        ({
          data: {
            createQuestion: {
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
  }, [intl, title, tags, history, createMutation])

  const toggleTips = value => () => {
    setShowTips(value)
    PermanentClosableCard.setOpened('tips_edit', value)
  }

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
          <CtrlEnter onCtrlEnter={submitCreate} style={{ width: '100%' }}>
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
            onClick={submitCreate}
            loading={loading}
            disabled={!title || loading}
          />
        </Card.Actions>
      </Card>
    </div>
  )
}

Create.translations = {
  en: {
    title: 'Ask a new question',
    alert: {
      success: 'Your question was successfully submitted!'
    },
    prompt_warning: 'Are you sure you want to leave this page with an unsaved question?',
    home: 'Home',
    show_tips: 'Show tips',
    placeholder: 'E.g.: How to fill an expense report?',
    validate: 'Submit'
  },
  fr: {
    title: 'Poser une nouvelle question',
    alert: {
      success: 'Votre question a bien été envoyée !'
    },
    prompt_warning: 'Êtes-vous sûr de vouloir quitter cette page sans enregistrer la question ?',
    home: 'Accueil',
    show_tips: 'Voir conseils',
    placeholder: 'Ex: Comment remplir une note de frais ?',
    validate: 'Envoyer la question'
  }
}

export default Create
