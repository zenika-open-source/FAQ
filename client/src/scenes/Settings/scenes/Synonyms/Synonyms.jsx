import React, { useState, useEffect, useCallback, useMemo } from 'react'

import { useIntl, alert } from 'services'
import { Tab, PairInputList, Button } from 'components'
import { onListChange } from 'helpers'

import {
  useConf,
  useUpdateConf,
  initState,
  prepareData,
  canSubmit as canSubmitFunc
} from './helpers'

const Synonyms = () => {
  const intl = useIntl(Synonyms)

  const [state, setState] = useState(null)
  const [loading, setLoading] = useState(true)
  const { data } = useConf()
  const [mutate] = useUpdateConf()

  // Init state
  useEffect(() => {
    if (data?.configuration) {
      setState(initState(data?.configuration))
      setLoading(false)
    }
  }, [data])

  // Update conf
  const updateSynonyms = useCallback(() => {
    setLoading(true)
    mutate({
      variables: prepareData(state)
    })
      .then(({ data }) => {
        alert.pushSuccess(intl('alert_success'))
        setState(initState(data?.updateConfiguration))
      })
      .catch(err => {
        alert.pushDefaultError(err)
      })
      .finally(() => setLoading(false))
  }, [mutate, state, intl])

  const onSynonymsChange = useMemo(
    () => onListChange(changes => setState(state => ({ ...state, ...changes(state) })), 'synonyms'),
    []
  )

  const canSubmit = useMemo(() => canSubmitFunc(state, loading), [state, loading])

  return (
    <Tab label={intl('tab')} path="synonyms">
      {state?.synonyms && (
        <PairInputList
          pairs={state.synonyms}
          options={{
            icons: { line: 'sync_alt', value: 'list' },
            labels: intl('labels')
          }}
          actions={onSynonymsChange.actions}
          disabled={loading}
        />
      )}
      <div className="settings-actions">
        <Button
          primary
          label={intl('validate')}
          onClick={updateSynonyms}
          loading={loading}
          disabled={!canSubmit}
        />
      </div>
    </Tab>
  )
}

Synonyms.translations = {
  en: {
    alert_success: 'The Synonyms settings were successfully edited!',
    tab: 'Synonyms',
    labels: {
      add: 'Add a synonym',
      more: 'More synonyms',
      key: 'ID',
      value: 'Synonyms'
    },
    validate: 'Save'
  },
  fr: {
    alert_success: 'Les paramètres de synonymes ont été modifiés avec succès !',
    tab: 'Synonymes',
    labels: {
      add: 'Ajouter un synonyme',
      more: 'Plus de synonymes',
      key: 'ID',
      value: 'Synonymes'
    },
    validate: 'Enregistrer'
  }
}

export default Synonyms
