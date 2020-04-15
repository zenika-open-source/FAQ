import React, { useEffect, useState, useCallback, useMemo } from 'react'

import { useIntl, alert } from 'services'
import { Tab, Input, Icon, Button } from 'components'

import {
  initState,
  prepareData,
  useConf,
  useUpdateConf,
  canSubmit as canSubmitFunc
} from './helpers'

const General = () => {
  const intl = useIntl(General)

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
  const updateGeneral = useCallback(() => {
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
    <Tab label={intl('tab')} path="general">
      <h2>{intl('title.title')}</h2>
      <br />
      <div className="inline-input">
        <Icon material="home" />
        <Input
          value={state?.title || ''}
          onChange={e => {
            const title = e.target.value
            setState(state => ({ ...state, title }))
          }}
          placeholder={intl('title.placeholder')}
          disabled={loading}
        />
      </div>
      <br />
      <hr />
      <h2>{intl('domains.title')}</h2>
      <br />
      <div className="inline-input">
        <Icon material="domain" />
        <Input
          style={{ flex: 1 }}
          value={state?.authorizedDomains || ''}
          onChange={e => {
            const authorizedDomains = e.target.value
            setState(state => ({ ...state, authorizedDomains }))
          }}
          placeholder={intl('domains.placeholder')}
          disabled={loading}
        />
      </div>
      <br />
      <hr />
      {/*
      // Disabling bugReporting editing to link it to the pricing
      <br />
      <hr />
      <h2>{intl('bug_reporting.title')}</h2>
      <br />
      <div style={{ marginLeft: '1rem' }}>
        <Radio.Group
          name="bug_reporting"
          selected={state.bugReporting}
          onChange={data => setState(state => ({ ...state, bugReporting: data }))}
          disabled={loading}
        >
          <Radio label={intl('bug_reporting.mail')} value="MAIL" />
          <Radio label={intl('bug_reporting.github')} value="GITHUB" />
        </Radio.Group>
      </div>*/}
      <div className="settings-actions">
        <Button
          primary
          label={intl('validate')}
          onClick={updateGeneral}
          loading={loading}
          disabled={!canSubmit}
        />
      </div>
    </Tab>
  )
}

General.translations = {
  en: {
    alert_success: 'The General settings were successfully edited!',
    tab: 'General',
    title: {
      title: 'Title',
      placeholder: 'Title'
    },
    domains: {
      title: 'Authorized domains',
      placeholder: 'E.g.: zenika.com, google.com, ...'
    },
    bug_reporting: {
      title: 'Bug reporting',
      mail: 'By email',
      github: 'By Github'
    },
    validate: 'Save'
  },
  fr: {
    alert_success: 'Les paramètres ont été modifiés avec succès !',
    tab: 'Général',
    title: {
      title: 'Titre',
      placeholder: 'Titre'
    },
    domains: {
      title: 'Domaines autorisés',
      placeholder: 'Ex: zenika.com, google.com, ...'
    },
    bug_reporting: {
      title: 'Signalement de bug',
      mail: 'Par email',
      github: 'Par Github'
    },
    validate: 'Enregistrer'
  }
}

export default General
