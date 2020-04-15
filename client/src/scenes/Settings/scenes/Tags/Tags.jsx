import React, { useEffect, useCallback, useState, useMemo } from 'react'

import { useIntl, alert } from 'services'
import { Tab, Button } from 'components'

import TagsEditor from './TagsEditor'
import {
  useUpdateConf,
  useConf,
  prepareData,
  initState,
  canSubmit as canSubmitFunc
} from './helpers'

import './Tags.scss'

const Tags = () => {
  const intl = useIntl(Tags)

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
  const updateTags = useCallback(() => {
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

  const canSubmit = useMemo(() => canSubmitFunc(state, loading), [state, loading])

  return (
    <Tab label={intl('tab')} path="tags">
      {state?.categories && (
        <TagsEditor
          categories={state.categories}
          onChange={categories => setState(state => ({ ...state, categories }))}
        />
      )}
      <div className="settings-actions">
        <Button
          primary
          label={intl('validate')}
          onClick={updateTags}
          loading={loading}
          disabled={!canSubmit}
        />
      </div>
    </Tab>
  )
}

Tags.translations = {
  en: {
    alert_success: 'The Tags settings were successfully edited!',
    tab: 'Tags',
    validate: 'Save'
  },
  fr: {
    alert_success: 'Les paramètres de tags ont été modifiés avec succès !',
    tab: 'Tags',
    validate: 'Enregistrer'
  }
}

export default Tags
