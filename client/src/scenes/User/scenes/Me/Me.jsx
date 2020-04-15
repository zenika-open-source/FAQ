import React from 'react'

import { useIntl } from 'services'
import { Card } from 'components'
import { Identity, Logs, Gdpr } from './components'

const Me = () => {
  const intl = useIntl(Me)

  return (
    <div>
      <Card>
        <Card.Text>
          <h1 className="centered">{intl('title')}</h1>
        </Card.Text>
      </Card>
      <Identity />
      <Logs />
      <Gdpr />
    </div>
  )
}

Me.translations = {
  en: {
    title: 'Profile'
  },
  fr: {
    title: 'Profil'
  }
}

export default Me
