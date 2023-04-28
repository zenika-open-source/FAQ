import { Tab } from 'components'
import React from 'react'
import { getIntl } from 'services'

const Specialists = ({ state, dispatch, loading }) => {
  const intl = getIntl(Specialists)

  return (
    <Tab label={intl('tab')}>
      <h2>{intl('title')}</h2>
    </Tab>
  )
}

Specialists.translations = {
  en: {
    tab: 'Specialists',
    title: 'Users'
  },
  fr: {
    tab: 'Spécialistes',
    title: 'Utilisateurs'
  }
}

export default Specialists
