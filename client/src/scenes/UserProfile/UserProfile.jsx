import { useMutation } from '@apollo/client'
import { Avatar, Button, Card, Input, Loading, Modal } from 'components'
import { useUser } from 'contexts'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { alert, getIntl } from 'services'

import Logs from './components/Logs'
import Specialties from './components/Specialties'
import { DELETE_IDENTITY, UPDATE_INDENTITY } from './queries'

const UserProfile = () => {
  const navigate = useNavigate()
  const intl = getIntl(UserProfile)

  const user = useUser()
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [picture, setPicture] = useState(user.picture)

  const [goodbye, setGoodbye] = useState('')
  const [modalActive, setModalActive] = useState(false)

  useEffect(() => {
    if (user && user.name) {
      setName(user.name)
      setEmail(user.email)
      setPicture(user.picture)
    }
  }, [user])

  const [save, { loading: saveLoading }] = useMutation(UPDATE_INDENTITY, {
    variables: { name, email, picture },
    onCompleted() {
      alert.pushSuccess(intl('alert.update_success'))
    },
    onError(error) {
      alert.pushDefaultError(error)
    },
  })

  const [deleteData, { loading: deleteLoading }] = useMutation(DELETE_IDENTITY, {
    onCompleted() {
      alert.pushSuccess(intl('alert.delete_success'))
      navigate('/auth/logout')
    },
    onError(error) {
      alert.pushDefaultError(error)
      setModalActive(false)
    },
  })

  if (name === undefined) return <Loading />

  return (
    <div>
      <Card>
        <Card.Text>
          <h1 className="text-center">{intl('title')}</h1>
        </Card.Text>
      </Card>
      <Card>
        <Card.Text>
          <h2 className="font-bold">{intl('identity.title')}</h2>
          <hr />
          <div className="my-4">
            <label htmlFor="name">{intl('identity.name')}</label>
            <input
              id="name"
              className="block w-full mt-1 mb-4 p-1 border outline-none border-secondary-font focus-within:border-primary"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="off"
            />
            <label htmlFor="email">{intl('identity.email')}</label>
            <input
              id="email"
              className="block w-full mt-1 mb-4 p-1 border outline-none border-secondary-font focus-within:border-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="picture">{intl('identity.picture')}</label>
            <div className="flex items-center">
              <Avatar image={picture} className="w-16 h-16 mr-5" />
              <input
                id="picture"
                className="block w-full mt-1 mb-4 p-1 border outline-none border-secondary-font focus-within:border-primary"
                value={picture}
                onChange={(e) => setPicture(e.target.value)}
              />
            </div>
          </div>
        </Card.Text>
        <Card.Actions>
          <Button
            intent={saveLoading || deleteLoading ? 'disabled' : 'primary'}
            type="button"
            size="medium"
            onClick={save}
          >
            {intl('identity.save')}
          </Button>
        </Card.Actions>
      </Card>
      <Specialties userId={user.id} />
      <Logs userId={user.id} />
      <Card>
        <Card.Text>
          <h2 className="mb-4 font-bold">{intl('gdpr.title')}</h2>
          <hr className="border border-dotted border-primary-font border-t-secondary-derk" />
          <p className="my-2">
            <span className="mr-1">{intl('gdpr.contact')}</span>
            <a href={`mailto:contact@${import.meta.env.VITE_FAQ_URL}`}>
              contact@{import.meta.env.VITE_FAQ_URL}
            </a>
          </p>
          <hr className="border border-dotted border-primary-font border-t-secondary-dark" />
          <p className="my-2">
            {intl('gdpr.erase.label')}
            <Button
              intent={saveLoading || deleteLoading ? 'disabled' : 'tertiary'}
              className="ml-4"
              size="medium"
              data-tooltip={intl('gdpr.erase.tooltip')}
              onClick={() => setModalActive(true)}
            >
              {intl('gdpr.erase.button')}
            </Button>
          </p>
        </Card.Text>
      </Card>
      <Modal active={modalActive} setActive={setModalActive} loading={saveLoading || deleteLoading}>
        <Modal.Title>
          <h2>{intl('modal.title')}</h2>
        </Modal.Title>
        <Modal.Alert>{intl('modal.alert')}</Modal.Alert>
        <Modal.Text>
          {intl('modal.text').map((text, i) => (
            <p key={i}>{text}</p>
          ))}
          <Input value={goodbye} onChange={(e) => setGoodbye(e.target.value)} />
          <br />
          <Button
            intent={goodbye !== 'goodbye' || saveLoading || deleteLoading ? 'disabled' : 'primary'}
            className="w-full"
            onClick={deleteData}
            loading={saveLoading || deleteLoading}
          >
            {intl('modal.button')}
          </Button>
        </Modal.Text>
      </Modal>
    </div>
  )
}

UserProfile.translations = {
  en: {
    alert: {
      update_success: 'Your profile was successfully updated!',
      delete_success: 'Your personal data was succesfully deleted!',
    },
    title: 'Profile',
    identity: {
      title: 'Identity',
      name: 'Name',
      email: 'Email address',
      picture: 'Picture url',
      save: 'Save',
    },
    gdpr: {
      title: 'GDPR',
      contact: 'You can contact us about any GDPR-related issue at:',
      erase: {
        label: 'Erase all your personal data:',
        tooltip: 'This will erase all your personal data from FAQ',
        button: 'Delete my data',
      },
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
        </>,
      ],
      button: 'I understand the consequences, delete my data',
    },
  },
  fr: {
    alert: {
      update_success: 'Votre profil a été modifié avec succès !',
      delete_success: 'Vos données personnelles ont été supprimées avec succès !',
    },
    title: 'Profil',
    identity: {
      title: 'Identité',
      name: 'Nom',
      email: 'Adresse email',
      picture: 'Image URL',
      save: 'Enregistrer',
    },
    gdpr: {
      title: 'RGPD',
      contact:
        "Vous pouvez nous contacter pour toute question relative à la RGPD à l'adresse suivante :",
      erase: {
        label: 'Supprimez toutes vos données personnelles',
        tooltip: 'Cela va supprimer toutes vos données personnelles de la FAQ',
        button: 'Effacer mes données',
      },
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
        <>Veuillez saisir "goodbye" pour confirmer.</>,
      ],
      button: 'Je comprends les conséquences, effacer mes données',
    },
  },
}

export default UserProfile
