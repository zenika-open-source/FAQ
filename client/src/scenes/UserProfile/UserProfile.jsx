import React, { useState, useEffect } from 'react'

import { useUser } from 'contexts'
import { alert, useMutation, useIntl } from 'services'

import { Avatar, Button, Card, Modal, Loading, Input } from 'components'

import Logs from './components/Logs'

import { updateIdentityMutation, deleteIdentityMutation } from './queries'

const UserProfile = ({ history }) => {
  const intl = useIntl(UserProfile)

  const [loading, setLoading] = useState(false)

  const user = useUser() || {}
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [picture, setPicture] = useState(user.picture)
  const [, updateIdentity] = useMutation(updateIdentityMutation)

  const [goodbye, setGoodbye] = useState('')
  const [modalActive, setModalActive] = useState(false)
  const [, deleteIdentity] = useMutation(deleteIdentityMutation)

  useEffect(() => {
    if (user && user.name) {
      setName(user.name)
      setEmail(user.email)
      setPicture(user.picture)
    }
  }, [user])

  const save = async () => {
    try {
      setLoading(true)
      await updateIdentity({
        name,
        email,
        picture
      })
      alert.pushSuccess(intl('alert.update_success'))
    } catch (err) {
      alert.pushDefaultError(err)
    } finally {
      setLoading(false)
    }
  }

  const deleteData = async () => {
    try {
      setLoading(true)
      await deleteIdentity()
      alert.pushSuccess(intl('alert.delete_success'))
      history.push('/auth/logout')
    } catch (err) {
      alert.pushDefaultError(err)
    } finally {
      setModalActive(false)
      setLoading(false)
    }
  }

  if (name === undefined) return <Loading />

  return (
    <div>
      <Card>
        <Card.Text>
          <h1 className="centered">{intl('title')}</h1>
        </Card.Text>
      </Card>
      <Card>
        <Card.Text>
          <h2>{intl('identity.title')}</h2>
          <hr />
          <div className="card-form">
            <label htmlFor="name">{intl('identity.name')}</label>
            <input
              id="name"
              className="card-input"
              value={name}
              onChange={e => setName(e.target.value)}
              autoComplete="off"
            />
            <label htmlFor="email">{intl('identity.email')}</label>
            <input
              id="email"
              className="card-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <label htmlFor="picture">{intl('identity.picture')}</label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                image={picture}
                style={{
                  width: '60px',
                  height: '60px',
                  marginRight: '20px'
                }}
              />
              <input
                id="picture"
                className="card-input"
                value={picture}
                onChange={e => setPicture(e.target.value)}
              />
            </div>
          </div>
        </Card.Text>
        <Card.Actions>
          <Button primary type="button" disabled={loading} onClick={save}>
            {intl('identity.save')}
          </Button>
        </Card.Actions>
      </Card>
      <Logs userId={user.id} />
      <Card>
        <Card.Text>
          <h2 style={{ marginBottom: '1rem' }}>{intl('gdpr.title')}</h2>
          <hr />
          <p>
            <span style={{ marginRight: '5px' }}>{intl('gdpr.contact')}</span>
            <a href="mailto:mydata@zenika.com">mydata@zenika.com</a>
          </p>
          <hr />
          <p>
            {intl('gdpr.erase.label')}
            <Button
              secondary
              disabled={loading}
              data-tooltip={intl('gdpr.erase.tooltip')}
              style={{ marginLeft: '1rem' }}
              onClick={() => setModalActive(true)}
            >
              {intl('gdpr.erase.button')}
            </Button>
          </p>
        </Card.Text>
      </Card>
      <Modal active={modalActive} setActive={setModalActive} loading={loading}>
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
    </div>
  )
}

UserProfile.translations = {
  fr: {
    alert: {
      update_success: 'Your profile was successfully updated!',
      delete_success: 'Your personal data was succesfully deleted!'
    },
    title: 'Profile',
    identity: {
      title: 'Identity',
      name: 'Name',
      email: 'Email address',
      picture: 'Picture url',
      save: 'Save'
    },
    gdpr: {
      title: 'GDPR',
      contact: 'You can contact us about any GDPR-related issue at:',
      erase: {
        label: 'Erase all your personal data:',
        tooltip: 'This will erase all your personal data from FAQ',
        button: 'Delete my data'
      }
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
    }
  },
  en: {
    alert: {
      update_success: 'Votre profil a été modifié avec succès !',
      delete_success: 'Vos données personnelles ont été supprimées avec succès !'
    },
    title: 'Profil',
    identity: {
      title: 'Identité',
      name: 'Nom',
      email: 'Adresse email',
      picture: 'Image URL',
      save: 'Enregistrer'
    },
    gdpr: {
      title: 'RGPD',
      contact:
        "Vous pouvez nous contacter pour toute question relative à la RGPD à l'adresse suivante :",
      erase: {
        label: 'Supprimez toutes vos données personnelles',
        tooltip: 'Cela va supprimer toutes vos données personnelles de la FAQ',
        button: 'Effacer mes données'
      }
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
    }
  }
}

export default UserProfile
