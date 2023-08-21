import { useMutation } from '@apollo/client'
import { useState } from 'react'

import { alert, getIntl } from 'services'

import { Button, Input, Tab } from 'components'

import { REGENERATE_SLACK_COMMAND_KEY } from '../queries'

const Integrations = ({ state, dispatch }) => {
  const intl = getIntl(Integrations)

  const [slackHookLoading, setSlackHookLoading] = useState(false)
  const [mutateSlackCommandKey] = useMutation(REGENERATE_SLACK_COMMAND_KEY)

  const generateSlackHook = () => {
    setSlackHookLoading(true)

    mutateSlackCommandKey()
      .then(({ data }) =>
        dispatch({
          type: 'change_slack_commandkey',
          data: data.regenerateSlackCommandKey.slackCommandKey,
        }),
      )
      .catch(alert.pushDefaultError)
      .finally(() => setSlackHookLoading(false))
  }

  return (
    <Tab label={intl('tab')}>
      <h2 className="mb-2">{intl('workplace.title')}</h2>
      <hr />
      <h2 className="my-2">{intl('slack.title')}</h2>
      <div className="flex items-center">
        <i className="ml-[1em] mr-2">{intl('slack.channel')}</i>
        <Input
          value={state.slackChannelHook || ''}
          className="flex-1 mr-4"
          onChange={(e) => dispatch({ type: 'change_slack_channelhook', data: e.target.value })}
        />
      </div>
      <div className="flex items-center mt-4">
        <i className="ml-[1em] mr-2">{intl('slack.command')}</i>
        <Input
          value={
            state.slackCommandKey
              ? `https://${window.location.host}/rest/integration/slack/${state.slackCommandKey}`
              : ''
          }
          intent="disabled"
          size="small"
          className="flex-1 ml-4 mr-4"
        />
        <Button
          label={
            (state.slackCommandKey ? intl('slack.regenerate') : intl('slack.generate')) + ' URL'
          }
          intent="link"
          size="medium"
          loading={slackHookLoading}
          onClick={generateSlackHook}
        />
      </div>
    </Tab>
  )
}

Integrations.translations = {
  en: {
    tab: 'Integrations',
    workplace: {
      title: 'Workplace',
      label: 'Enable Workplace sharing',
    },
    slack: {
      title: 'Slack',
      channel: 'Slack Channel Hook:',
      command: 'Slack Command Hook:',
      generate: 'Generate',
      regenerate: 'Regenerate',
    },
  },
  fr: {
    tab: 'Intégrations',
    workplace: {
      title: 'Workplace',
      label: 'Activer le partage par Workplace',
    },
    slack: {
      title: 'Slack',
      channel: 'Slack Channel Hook:',
      command: 'Slack Command Hook:',
      generate: 'Générer',
      regenerate: 'Régénérer',
    },
  },
}

export default Integrations
