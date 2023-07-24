import './Settings.scss'

import { useMutation } from '@apollo/client'
import { Button, Tabs } from 'components'
import Card, { CardActions, CardText, CardTitle } from 'components/Card'
import { useAuth, useConfiguration } from 'contexts'
import { useEffect, useReducer } from 'react'
import { alert, getIntl } from 'services'

import { listToSynonyms, reducer, serializeTags, synonymsToList } from './helpers'
import { UPDATE_CONFIGURATION } from './queries'
import { General, Integrations, Specialists, Synonyms, Tags } from './scenes'

const initState = (conf) => ({
  ...conf,
  synonyms: synonymsToList(conf?.algoliaSynonyms),
  authorizedDomains: conf?.authorizedDomains?.join(', '),
  bugReporting: conf?.bugReporting || 'GITHUB',
})

const Settings = ({ configuration: conf }) => {
  const intl = getIntl(Settings)

  const { isAdmin, isSpecialist } = useAuth()

  const configuration = useConfiguration()

  const [state, dispatch] = useReducer(reducer, initState(conf))

  useEffect(() => {
    dispatch({
      type: 'reset',
      data: initState(conf),
    })
  }, [conf])

  const [onSave, { loading }] = useMutation(UPDATE_CONFIGURATION, {
    variables: {
      title: state.title,
      tagCategories: serializeTags(state.tagCategories),
      algoliaSynonyms: listToSynonyms(state.synonyms),
      workplaceSharing: state.workplaceSharing,
      authorizedDomains: state.authorizedDomains
        .split(',')
        .map((x) => x.trim())
        .filter((x) => x),
      bugReporting: state.bugReporting,
      slackChannelHook: state.slackChannelHook,
    },
    onCompleted() {
      alert.pushSuccess(intl('alert_success'))
      configuration.reload()
    },
    onError(error) {
      alert.pushDefaultError(error)
    },
  })

  const onTagsChange = (tags) => dispatch({ type: 'change_tags', data: tags })

  return (
    <div>
      <Card>
        <CardTitle>
          <h1 className="centered" style={{ width: '100%' }}>
            {intl('title')}
          </h1>
        </CardTitle>
        <CardText>
          <Tabs>
            {isAdmin && (
              <>
                <General state={state} dispatch={dispatch} loading={loading} />
                <Tags state={state} onTagsChange={onTagsChange} />
                <Synonyms state={state} dispatch={dispatch} loading={loading} />
              </>
            )}
            {(isAdmin || isSpecialist) && (
              <Specialists state={state} dispatch={dispatch} loading={loading} />
            )}
            {isAdmin && <Integrations state={state} dispatch={dispatch} loading={loading} />}
          </Tabs>
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
      general: {
        tab: 'General',
        title: {
          title: 'Title',
          placeholder: 'Title',
        },
        domains: {
          title: 'Authorized domains',
          placeholder: 'E.g.: zenika.com, google.com, ...',
        },
        bug_reporting: {
          title: 'Bug reporting',
          mail: 'By email',
          github: 'By Github',
        },
      },
      tags: {
        tab: 'Tags',
        labels: {
          add: 'Add tags',
          more: 'More tags',
          key: 'Category',
          value: 'Tags',
        },
      },
      specialists: {
        tab: 'Specialists',
      },
      synonyms: {
        tab: 'Synonyms',
        labels: {
          add: 'Add a synonym',
          more: 'More synonyms',
          key: 'ID',
          value: 'Synonyms',
        },
      },
      integrations: {
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
    },
    validate: 'Save',
  },
  fr: {
    alert_success: 'Les paramètres ont été modifiés avec succès !',
    title: 'Paramètres',
    settings: {
      general: {
        tab: 'Général',
        title: {
          title: 'Titre',
          placeholder: 'Titre',
        },
        domains: {
          title: 'Domaines autorisés',
          placeholder: 'Ex: zenika.com, google.com, ...',
        },
        bug_reporting: {
          title: 'Signalement de bug',
          mail: 'Par email',
          github: 'Par Github',
        },
      },
      tags: {
        tab: 'Tags',
        labels: {
          add: 'Ajouter un tags',
          more: 'Plus de tags',
          key: 'Categorie',
          value: 'Tags',
        },
      },
      specialists: {
        tab: 'Spécialistes',
      },
      synonyms: {
        tab: 'Synonymes',
        labels: {
          add: 'Ajouter un synonyme',
          more: 'Plus de synonymes',
          key: 'ID',
          value: 'Synonymes',
        },
      },
      integrations: {
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
    },
    validate: 'Enregistrer',
  },
}

export default Settings
