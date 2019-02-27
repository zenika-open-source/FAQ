import React, { useState, useEffect } from 'react'

import { useUser } from 'contexts'
import { alert, useMutation } from 'services'

import { Avatar, Button, Card, Modal, Loading, Input } from 'components'

import Logs from './components/Logs'

import { updateIdentityMutation, deleteIdentityMutation } from './queries'

const UserProfile = ({ history }) => {
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
      alert.pushSuccess('Your profile was successfully updated!')
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
      alert.pushSuccess('Your personal data was succesfully deleted!')
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
          <h1 className="centered">Profile</h1>
        </Card.Text>
      </Card>
      <Card>
        <Card.Text>
          <h2>Identity</h2>
          <hr />
          <div className="card-form">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              className="card-input"
              value={name}
              onChange={e => setName(e.target.value)}
              autoComplete="off"
            />
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              className="card-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <label htmlFor="picture">Picture url</label>
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
            Save
          </Button>
        </Card.Actions>
      </Card>
      <Logs userId={user.id} />
      <Card>
        <Card.Text>
          <h2 style={{ marginBottom: '1rem' }}>GDPR</h2>
          <hr />
          <p>
            <span style={{ marginRight: '5px' }}>
              You can contact us about any GDPR-related issue at:
            </span>
            <a href="mailto:mydata@zenika.com">mydata@zenika.com</a>
          </p>
          <hr />
          <p>
            Erase all your personal data:
            <Button
              secondary
              disabled={loading}
              data-tooltip="This will erase all your personal data from FAQ"
              style={{ marginLeft: '1rem' }}
              onClick={() => setModalActive(true)}
            >
              Delete your data
            </Button>
          </p>
        </Card.Text>
      </Card>
      <Modal active={modalActive} setActive={setModalActive} loading={loading}>
        <Modal.Title>
          <h2>Are you absolutely sure?</h2>
        </Modal.Title>
        <Modal.Alert>Unexpected bad things will happen if you don’t read this!</Modal.Alert>
        <Modal.Text>
          <p>
            This action cannot be undone. This will <b>permanently delete</b> all your personal
            data.
          </p>
          <p>
            Your personal data will be erased, which means your actions will become anonymous. The
            content you have written and edited will remain.
          </p>
          <p>
            Please type in <b>"goodbye"</b> to confirm.
          </p>
          <Input value={goodbye} onChange={e => setGoodbye(e.target.value)} />
          <br />
          <Button
            primary
            style={{ width: '100%' }}
            disabled={goodbye !== 'goodbye' || loading}
            onClick={deleteData}
            loading={loading}
          >
            I understand the consequences, delete my data
          </Button>
        </Modal.Text>
      </Modal>
    </div>
  )
}

export default UserProfile
