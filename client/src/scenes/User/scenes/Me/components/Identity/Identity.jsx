import React, { useEffect, useState } from 'react'
import { useQuery, gql, useMutation } from '@apollo/client'

import { useIntl, alert } from 'services'
import { Card, Loading, Avatar, Button } from 'components'

const Identity = () => {
  const intl = useIntl(Identity)

  const { data } = useQuery(gql`
    query {
      me {
        id
        name
        email
        picture
      }
    }
  `)

  const [state, setState] = useState({
    name: data?.me.name || '',
    picture: data?.me.picture || ''
  })

  useEffect(() => {
    if (data) {
      const { name, picture } = data.me
      setState({ name, picture })
    }
  }, [data])

  const [updateMe, { loading }] = useMutation(gql`
    mutation($name: String!, $picture: String!) {
      updateMe(name: $name, picture: $picture) {
        id
        name
        picture
      }
    }
  `)

  const save = () => {
    updateMe({
      variables: {
        name: state.name,
        picture: state.picture
      }
    })
      .then(() => {
        alert.pushSuccess(intl('alert_success'))
      })
      .catch(err => {
        alert.pushDefaultError(err)
      })
  }

  if (!data) {
    return <Loading />
  }

  return (
    <Card>
      <Card.Text>
        <h2>{intl('title')}</h2>
        <hr />
        <div className="card-form">
          <label htmlFor="name">{intl('name')}</label>
          <input
            id="name"
            type="text"
            className="card-input"
            value={state.name}
            onChange={e => {
              const name = e.target.value
              setState(s => ({ ...s, name }))
            }}
          />
          <label htmlFor="email">{intl('email')}</label>
          <div className="card-input">{data.me.email}</div>
          <label htmlFor="picture">{intl('picture')}</label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              image={state.picture}
              style={{ width: '60px', height: '60px', marginRight: '20px' }}
            />
            <input
              id="picture"
              className="card-input"
              value={state.picture}
              onChange={e => {
                const picture = e.target.value
                setState(s => ({ ...s, picture }))
              }}
            />
          </div>
        </div>
      </Card.Text>
      <Card.Actions>
        <Button primary disabled={loading} loading={loading} onClick={save}>
          {intl('save')}
        </Button>
      </Card.Actions>
    </Card>
  )
}

Identity.translations = {
  en: {
    title: 'Identity',
    name: 'Name',
    email: 'Email address',
    picture: 'Picture url',
    save: 'Save',
    alert_success: 'Your profile was successfully updated!'
  },
  fr: {
    title: 'Identité',
    name: 'Nom',
    email: 'Adresse email',
    picture: 'Image URL',
    save: 'Enregistrer',
    alert_success: 'Votre profil a été modifié avec succès !'
  }
}

export default Identity
