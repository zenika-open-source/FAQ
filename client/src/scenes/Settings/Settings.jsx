import React, { useEffect } from 'react'

import { Card, Tabs, Loading } from 'components'
import { useIntl } from 'services'

import { General, Tags, Synonyms, Integrations } from './scenes'
import { useFullConfiguration } from './queries'

import './Settings.scss'

const Settings = ({ match }) => {
  const intl = useIntl(Settings)

  const [query, { loading, data }] = useFullConfiguration()

  useEffect(() => {
    query()
  }, [query])

  if (loading || !data) return <Loading />

  return (
    <div>
      <Card>
        <Card.Title>
          <h1>{intl('title')}</h1>
        </Card.Title>
        <Card.Text>
          <Tabs path={match.path}>
            <General />
            <Tags />
            <Synonyms />
            <Integrations />
          </Tabs>
        </Card.Text>
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
        }
      },
      tags: {
        tab: 'Tags',
        labels: {
          add: 'Add tags',
          more: 'More tags',
          key: 'Category',
          value: 'Tags'
        }
      },
      synonyms: {
        tab: 'Synonyms',
        labels: {
          add: 'Add a synonym',
          more: 'More synonyms',
          key: 'ID',
          value: 'Synonyms'
        }
      },
      integrations: {
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
        }
      }
    },
    validate: 'Save'
  },
  fr: {
    alert_success: 'Les paramètres ont été modifiés avec succès !',
    title: 'Paramètres',
    settings: {
      general: {
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
        }
      },
      tags: {
        tab: 'Tags',
        labels: {
          add: 'Ajouter un tags',
          more: 'Plus de tags',
          key: 'Categorie',
          value: 'Tags'
        }
      },
      synonyms: {
        tab: 'Synonymes',
        labels: {
          add: 'Ajouter un synonyme',
          more: 'Plus de synonymes',
          key: 'ID',
          value: 'Synonymes'
        }
      },
      integrations: {
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
          regenerate: 'Régénérer'
        }
      }
    },
    validate: 'Enregistrer'
  }
}

export default Settings
