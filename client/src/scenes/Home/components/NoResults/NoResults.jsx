import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { getIntl } from 'services'
import Button from 'components/Button'

const NoResults = ({ prefill }) => {
  const intl = getIntl(NoResults)

  return (
    <div className="text-center mt-16">
      <div className="mb-8 inline-flex items-center">
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
  prefill: PropTypes.string.isRequired,
}

NoResults.translations = {
  en: { nothing: 'Nothing found', ask_question: 'Ask the question!' },
  fr: { nothing: 'Aucune question trouvée', ask_question: 'Pose la question !' },
}

export default NoResults
