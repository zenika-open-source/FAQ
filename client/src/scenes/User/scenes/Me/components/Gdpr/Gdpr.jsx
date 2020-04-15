import React, { useState } from 'react'
import { useMutation, gql } from '@apollo/client'

import { useIntl, alert, signOut } from 'services'
import { Card, Button, Modal, Input } from 'components'

const Gdpr = () => {
  const intl = useIntl(Gdpr)

  const [opened, setOpened] = useState(false)
  const [goodbye, setGoodbye] = useState('')

  const [deleteMe, { loading }] = useMutation(gql`
    mutation {
      deleteMe {
        id
      }
    }
  `)

  const deleteData = () => {
    deleteMe()
      .then(() => {
        alert.pushSuccess(intl('alert_success'))
        signOut()
      })
      .catch(err => {
        alert.pushDefaultError(err)
        setOpened(false)
      })
  }

  return (
    <>
      <Card>
        <Card.Text>
          <h2 style={{ marginBottom: '1rem' }}>{intl('title')}</h2>
          <hr />
          <p>
            <span style={{ marginRight: '5px' }}>{intl('contact')}</span>
            <a href={`mailto:contact@${process.env.REACT_APP_FAQ_URL}`}>
              contact@{process.env.REACT_APP_FAQ_URL}
            </a>
          </p>
          <hr />
          <p>
            {intl('erase.label')}
            <Button
              secondary
              disabled={loading}
              loading={loading}
              data-tooltip={intl('erase.tooltip')}
              style={{ marginLeft: '1rem' }}
              onClick={() => setOpened(true)}
            >
              {intl('erase.button')}
            </Button>
          </p>
        </Card.Text>
      </Card>
      <Modal active={opened} setActive={setOpened} loading={loading}>
        <Modal.Title>
          <h2>{intl('modal.title')}</h2>
        </Modal.Title>
        <Modal.Alert>{intl('modal.alert')}</Modal.Alert>
        <Modal.Text>
          {intl('modal.text').map((text, i) => (
            <p key={i}>{text}</p>
          ))}
          <Input value={goodbye} onChange={e => setGoodbye(e.target.value)} />
          <br />
          <Button
            primary
            style={{ width: '100%' }}
            disabled={goodbye !== 'goodbye' || loading}
            onClick={deleteData}
            loading={loading}
          >
            {intl('modal.button')}
          </Button>
        </Modal.Text>
      </Modal>
    </>
  )
}

Gdpr.translations = {
  en: {
    title: 'GDPR',
    contact: 'You can contact us about any GDPR-related issue at:',
    erase: {
      label: 'Erase all your personal data:',
      tooltip: 'This will erase all your personal data from FAQ',
      button: 'Delete my data'
    },
    modal: {
      title: 'Are you absolutely sure?',
      alert: 'Unexpected bad things will happen if you don’t read this!',
      text: [
        <>
          This action cannot be undone. This will <b>permanently delete</b> all your personal data.
        </>,
        'Your personal data will be erased, which means your actions will become anonymous. The content you have written and edited will remain.',
        <>
          Please type in <b>"goodbye"</b> to confirm.
        </>
      ],
      button: 'I understand the consequences, delete my data'
    },
    alert_success: 'Your personal data was succesfully deleted!'
  },
  fr: {
    title: 'RGPD',
    contact:
      "Vous pouvez nous contacter pour toute question relative à la RGPD à l'adresse suivante :",
    erase: {
      label: 'Supprimez toutes vos données personnelles',
      tooltip: 'Cela va supprimer toutes vos données personnelles de la FAQ',
      button: 'Effacer mes données'
    },
    modal: {
      title: 'En êtes-vous absolument sûr ?',
      alert: 'De mauvaises choses imprévisibles se produiront si vous ne lisez pas ceci !',
      text: [
        <>
          Cette action ne peut être annulée. Cela <b>effacera définitivement</b> toutes vos données
          personnelles.
        </>,
        'Vos données personnelles seront effacées, ce qui signifie que vos actions deviendront anonymes. Le contenu que vous avez écrit et édité sera conservé.',
        <>Veuillez saisir "goodbye" pour confirmer.</>
      ],
      button: 'Je comprends les conséquences, effacer mes données'
    },
    alert_success: 'Vos données personnelles ont été supprimées avec succès !'
  }
}

export default Gdpr
