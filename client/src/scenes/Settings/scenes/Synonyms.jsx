import React from 'react'

import { Tab, PairInputList } from 'components'

import { getIntl } from 'services'

import { onListChangeActions } from 'helpers/onListChange'

const Synonyms = ({ state, dispatch, loading }) => {
  const intl = getIntl(Synonyms)

  return (
    <Tab label={intl('tab')}>
      <PairInputList
        pairs={state.synonyms}
        options={{
          icons: { line: 'loop', value: 'list' },
          labels: intl('labels')
        }}
        actions={onListChangeActions('synonyms', dispatch)}
        disabled={loading}
      />
    </Tab>
  )
}

Synonyms.translations = {
  en: {
    tab: 'Synonyms',
    labels: {
      add: 'Add a synonym',
      more: 'More synonyms',
      key: 'ID',
      value: 'Synonyms'
    }
  },
  fr: {
    tab: 'Synonymes',
    labels: {
      add: 'Ajouter un synonyme',
      more: 'Plus de synonymes',
      key: 'ID',
      value: 'Synonymes'
    }
  }
}

export default Synonyms
