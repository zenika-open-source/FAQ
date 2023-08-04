import { getIntl } from 'services'

import { Tab, Input, Icon, Radio } from 'components'

const General = ({ state, dispatch, loading }) => {
  const intl = getIntl(General)

  return (
    <Tab label={intl('tab')}>
      <h2>{intl('title.title')}</h2>
      <br />
      <div className="inline-input">
        <Icon material="home" />
        <Input
          value={state.title}
          onChange={(e) => dispatch({ type: 'change_title', data: e.target.value })}
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
          className="flex-1"
          value={state.authorizedDomains}
          onChange={(e) => dispatch({ type: 'change_domains', data: e.target.value })}
          placeholder={intl('domains.placeholder')}
          disabled={loading}
        />
      </div>
      <br />
      <hr />
      <h2>{intl('bug_reporting.title')}</h2>
      <br />
      <div className="ml-4">
        <Radio.Group
          name="bug_reporting"
          selected={state.bugReporting}
          onChange={(data) => dispatch({ type: 'change_bug_reporting', data })}
          disabled={loading}
        >
          <Radio label={intl('bug_reporting.mail')} value="MAIL" />
          <Radio label={intl('bug_reporting.github')} value="GITHUB" />
        </Radio.Group>
      </div>
    </Tab>
  )
}

General.translations = {
  en: {
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
  fr: {
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
}

export default General
