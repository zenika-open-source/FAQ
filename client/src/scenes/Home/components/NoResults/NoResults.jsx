import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { useIntl } from 'services'
import Button from 'components/Button'

const NoResults = ({ prefill }) => {
  const intl = useIntl(NoResults)

  return (
    <div style={{ textAlign: 'center', marginTop: '4rem' }}>
      <div
        className="indication"
        style={{
          marginBottom: '2rem',
          display: 'inline-flex',
          alignItems: 'center'
        }}
      >
        {intl('nothing')} &nbsp;
        <i className="material-icons">sms_failed</i>
      </div>
      <br />
      <Link to={{ pathname: '/q/new', state: { question: prefill } }}>
        <Button icon="record_voice_over" label={intl('ask_question')} primary raised />
      </Link>
    </div>
  )
}

NoResults.propTypes = {
  prefill: PropTypes.string.isRequired
}

NoResults.translations = {
  en: { nothing: 'Nothing found', ask_question: 'Ask the question!' },
  fr: { nothing: 'Aucune question trouvée', ask_question: 'Pose la question !' }
}

export default NoResults
