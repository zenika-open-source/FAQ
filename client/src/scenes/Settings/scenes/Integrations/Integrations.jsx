import React, { useState, useEffect, useCallback, useMemo } from 'react'

import { useIntl, alert } from 'services'
import { Tab, Button, Checkbox, Input } from 'components'

import {
  useConf,
  useUpdateConf,
  initState,
  prepareData,
  canSubmit as canSubmitFunc,
  useRegenerateSlackCommandKey
} from './helpers'

const Integrations = () => {
  const intl = useIntl(Integrations)

  const [state, setState] = useState(null)
  const [loading, setLoading] = useState(true)
  const { data } = useConf()
  const [mutate] = useUpdateConf()
  const [regenerateMutation, { loading: regenerateLoading }] = useRegenerateSlackCommandKey()

  // Init state
  useEffect(() => {
    if (data?.configuration) {
      setState(initState(data?.configuration))
      setLoading(false)
    }
  }, [data])

  // Update conf
  const updateIntegrations = useCallback(() => {
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

  const generateSlackCommandKey = () => {
    regenerateMutation()
      .then(({ data }) => {
        setState(initState(data?.regenerateSlackCommandKey))
      })
      .catch(alert.pushDefaultError)
  }

  return (
    <Tab label={intl('tab')} path="integrations">
      {state && (
        <>
          <h2>{intl('workplace.title')}</h2>
          <br />
          <div style={{ marginLeft: '1rem' }}>
            <Checkbox
              label={intl('workplace.label')}
              checked={state?.workplaceSharing}
              onChange={e => {
                const { checked } = e.target
                setState(state => ({ ...state, workplaceSharing: checked }))
              }}
              disabled={loading}
            />
          </div>
          <br />
          <hr />
          <br />
          <h2>{intl('slack.title')}</h2>
          <div className="inline-input" style={{ marginTop: '1em' }}>
            <i style={{ marginLeft: '1em' }}>{intl('slack.channel')}</i>
            <Input
              value={state.slackChannelHook || ''}
              style={{ flex: 1, marginRight: '1rem' }}
              onChange={e => {
                const hook = e.target.value
                setState(state => ({ ...state, slackChannelHook: hook }))
              }}
            />
          </div>
          <div className="inline-input" style={{ marginTop: '1em' }}>
            <i style={{ marginLeft: '1em' }}>{intl('slack.command')}</i>
            <Input
              value={
                state.slackCommandKey
                  ? `https://${window.location.host}/rest/integration/slack/${state.slackCommandKey}`
                  : ''
              }
              disabled
              small
              style={{ flex: 1, marginLeft: '1rem', marginRight: '1rem' }}
            />
            <Button
              label={
                (state.slackCommandKey ? intl('slack.regenerate') : intl('slack.generate')) + ' URL'
              }
              link
              loading={regenerateLoading}
              onClick={generateSlackCommandKey}
            />
          </div>
        </>
      )}
      <br />
      <hr />
      <div className="settings-actions">
        <Button
          primary
          label={intl('validate')}
          onClick={updateIntegrations}
          loading={loading}
          disabled={!canSubmit}
        />
      </div>
    </Tab>
  )
}

Integrations.translations = {
  en: {
    alert_success: 'The Integrations settings were successfully edited!',
    tab: 'Integrations',
    workplace: {
      title: 'Workplace',
      label: 'Enable Workplace sharing'
    },
    slack: {
      title: 'Slack',
      channel: 'Slack Channel Hook:',
      command: 'Slack Command Hook:',
      generate: 'Generate',
      regenerate: 'Regenerate'
    },
    validate: 'Save'
  },
  fr: {
    alert_success: "Les paramètres d'intégrations ont été modifiés avec succès !",
    tab: 'Intégrations',
    workplace: {
      title: 'Workplace',
      label: 'Activer le partage par Workplace'
    },
    slack: {
      title: 'Slack',
      channel: 'Slack Channel Hook:',
      command: 'Slack Command Hook:',
      generate: 'Générer',
      regenerate: 'Regénérer'
    },
    validate: 'Enregistrer'
  }
}

export default Integrations
