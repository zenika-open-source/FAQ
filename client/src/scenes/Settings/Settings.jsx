import React, { useState, useReducer } from 'react'

import { alert, useIntl } from 'services'
import { useMutation } from 'services/apollo'

import { useConfiguration } from 'contexts'

import { Input, Checkbox, Button, PairInputList, Icon, Radio } from 'components'
import Card, { CardTitle, CardText, CardActions } from 'components/Card'

import { onListChangeActions } from 'helpers/onListChange'

import { reducer, tagsToList, listToTags, synonymsToList, listToSynonyms } from './helpers'

import { regenerateSlackCommandKeyMutation, updateConfigurationMutation } from './queries'

import './Settings.scss'

const Settings = ({ configuration: conf }) => {
  const intl = useIntl(Settings)

  const configuration = useConfiguration()

  const [loading, setLoading] = useState(false)
  const [slackHookLoading, setSlackHookLoading] = useState(false)

  const [state, dispatch] = useReducer(reducer, {
    ...conf,
    tags: tagsToList(conf.tags),
    synonyms: synonymsToList(conf.algoliaSynonyms),
    authorizedDomains: conf.authorizedDomains.join(', '),
    bugReporting: conf.bugReporting || 'GITHUB'
  })

  const [, mutateSlackCommandKey] = useMutation(regenerateSlackCommandKeyMutation)
  const [, mutate] = useMutation(updateConfigurationMutation)

  const generateSlackHook = () => {
    setSlackHookLoading(true)

    mutateSlackCommandKey()
      .then(({ data }) =>
        dispatch({
          type: 'change_slack_commandkey',
          data: data.regenerateSlackCommandKey.slackCommandKey
        })
      )
      .catch(alert.pushDefaultError)
      .finally(() => setSlackHookLoading(false))
  }

  const onSave = () => {
    setLoading(true)
    mutate({
      title: state.title,
      tags: listToTags(state.tags),
      algoliaSynonyms: listToSynonyms(state.synonyms),
      workplaceSharing: state.workplaceSharing,
      authorizedDomains: state.authorizedDomains
        .split(',')
        .map(x => x.trim())
        .filter(x => x),
      bugReporting: state.bugReporting,
      slackChannelHook: state.slackChannelHook
    })
      .then(() => {
        alert.pushSuccess(intl('alert_success'))
        configuration.reload()
      })
      .catch(error => {
        alert.pushDefaultError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div>
      <Card>
        <CardTitle>
          <h1 className="centered" style={{ width: '100%' }}>
            {intl('title')}
          </h1>
        </CardTitle>
        <CardText>
          <h2>{intl('settings.title.title')}</h2>
          <br />
          <div className="inline-input">
            <Icon material="home" />
            <Input
              value={state.title}
              onChange={e => dispatch({ type: 'change_title', data: e.target.value })}
              placeholder={intl('settings.title.placeholder')}
              disabled={loading}
            />
          </div>
          <br />
          <hr />
          <h2>{intl('settings.tags.title')}</h2>
          <br />
          <PairInputList
            pairs={state.tags}
            options={{
              icons: { line: 'local_offer', value: 'list' },
              labels: intl('settings.tags.labels')
            }}
            actions={onListChangeActions('tags', dispatch)}
            disabled={loading}
          />
          <hr />
          <h2>{intl('settings.synonyms.title')}</h2>
          <br />
          <PairInputList
            pairs={state.synonyms}
            options={{
              icons: { line: 'loop', value: 'list' },
              labels: intl('settings.synonyms.labels')
            }}
            actions={onListChangeActions('synonyms', dispatch)}
            disabled={loading}
          />
          <hr />
          <h2>{intl('settings.integrations.title')}</h2>
          <br />
          <div style={{ marginLeft: '1rem' }}>
            <Checkbox
              label={intl('settings.integrations.workplace.label')}
              checked={state.workplaceSharing}
              onChange={e =>
                dispatch({
                  type: 'toggle_workplace',
                  data: e.target.checked
                })
              }
              disabled={loading}
            />
          </div>
          <div className="inline-input" style={{ marginTop: '1em' }}>
            <i style={{ marginLeft: '1em' }}>{intl('settings.integrations.slack.channel')}</i>
            <Input
              value={state.slackChannelHook || ''}
              style={{ flex: 1, marginRight: '1rem' }}
              onChange={e => dispatch({ type: 'change_slack_channelhook', data: e.target.value })}
            />
          </div>
          <div className="inline-input" style={{ marginTop: '1em' }}>
            <i style={{ marginLeft: '1em' }}>{intl('settings.integrations.slack.command')}</i>
            <Input
              value={
                state.slackCommandKey
                  ? `https://${window.location.host}/rest/integration/slack/${
                      state.slackCommandKey
                    }`
                  : ''
              }
              disabled
              small
              style={{ flex: 1, marginLeft: '1rem', marginRight: '1rem' }}
            />
            <Button
              label={
                (state.slackCommandKey
                  ? intl('settings.integrations.slack.regenerate')
                  : intl('settings.integrations.slack.generate')) + ' URL'
              }
              link
              loading={slackHookLoading}
              onClick={generateSlackHook}
            />
          </div>
          <br />
          <hr />
          <h2>{intl('settings.domains.title')}</h2>
          <br />
          <div className="inline-input">
            <Icon material="domain" />
            <Input
              style={{ flex: 1 }}
              value={state.authorizedDomains}
              onChange={e => dispatch({ type: 'change_domains', data: e.target.value })}
              placeholder={intl('settings.domains.placeholder')}
              disabled={loading}
            />
          </div>
          <hr />
          <h2>{intl('settings.bug_reporting.title')}</h2>
          <br />
          <div style={{ marginLeft: '1rem' }}>
            <Radio.Group
              name="bug_reporting"
              selected={state.bugReporting}
              onChange={data => dispatch({ type: 'change_bug_reporting', data })}
              disabled={loading}
            >
              <Radio label={intl('settings.bug_reporting.mail')} value="MAIL" />
              <Radio label={intl('settings.bug_reporting.github')} value="GITHUB" />
            </Radio.Group>
          </div>
        </CardText>
        <CardActions>
          <Button primary label={intl('validate')} onClick={onSave} loading={loading} />
        </CardActions>
      </Card>
    </div>
  )
}

Settings.translations = {
  en: {
    alert_success: 'The settings were successfully edited!',
    title: 'Settings',
    settings: {
      title: {
        title: 'Title',
        placeholder: 'Title'
      },
      tags: {
        title: 'Tags',
        labels: {
          add: 'Add tags',
          more: 'More tags',
          key: 'Category',
          value: 'Tags'
        }
      },
      synonyms: {
        title: 'Synonyms',
        labels: {
          add: 'Add a synonym',
          more: 'More synonyms',
          key: 'ID',
          value: 'Synonyms'
        }
      },
      integrations: {
        title: 'Integrations',
        workplace: {
          label: 'Enable Workplace sharing'
        },
        slack: {
          channel: 'Slack Channel Hook:',
          command: 'Slack Command Hook:',
          generate: 'Generate',
          regenerate: 'Regenerate'
        }
      },
      domains: {
        title: 'Authorized domains',
        placeholder: 'E.g.: zenika.com, google.com, ...'
      },
      bug_reporting: {
        title: 'Bug reporting',
        mail: 'By email',
        github: 'By Github'
      }
    },
    validate: 'Save'
  },
  fr: {
    alert_success: 'Les paramètres ont été modifiés avec succès !',
    title: 'Paramètres',
    settings: {
      title: {
        title: 'Titre',
        placeholder: 'Titre'
      },
      tags: {
        title: 'Tags',
        labels: {
          add: 'Ajouter un tags',
          more: 'Plus de tags',
          key: 'Categorie',
          value: 'Tags'
        }
      },
      synonyms: {
        title: 'Synonymes',
        labels: {
          add: 'Ajouter un synonyme',
          more: 'Plus de synonymes',
          key: 'ID',
          value: 'Synonymes'
        }
      },
      integrations: {
        title: 'Intégrations',
        workplace: {
          label: 'Activer le partage par Workplace'
        },
        slack: {
          channel: 'Slack Channel Hook:',
          command: 'Slack Command Hook:',
          generate: 'Générer',
          regenerate: 'Régénérer'
        }
      },
      domains: {
        title: 'Domaines autorisés',
        placeholder: 'Ex: zenika.com, google.com, ...'
      },
      bug_reporting: {
        title: 'Signalement de bug',
        mail: 'Par email',
        github: 'Par Github'
      }
    },
    validate: 'Enregistrer'
  }
}

export default Settings
