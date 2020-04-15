import React from 'react'

import { useIntl, useConfiguration } from 'services'
import { Icon } from 'components'

import GithubIcon from './GithubIcon'

const BugReporting = () => {
  const intl = useIntl(BugReporting)

  const conf = useConfiguration()

  switch (conf?.bugReporting) {
    case 'GITHUB':
      return (
        <a
          href="https://github.com/zenika-open-source/FAQ/issues/new?template=bug_report.md"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GithubIcon />
          <span>{intl('report_bug')}</span>
        </a>
      )
    case 'MAIL':
      return (
        <a href={`mailto:bug@${process.env.REACT_APP_FAQ_URL}`}>
          <Icon material="mail" style={{ fontSize: '14px' }} />
          <span>{intl('report_bug')}</span>
        </a>
      )
    default:
      return null
  }
}

BugReporting.translations = {
  en: { report_bug: 'report a bug', new_question: 'New question' },
  fr: { report_bug: 'signaler un bug', new_question: 'Nouvelle question' }
}

export default BugReporting
