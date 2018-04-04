import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import Button from 'components/Button'

const NoResults = ({ prefill }) => (
  <div style={{ textAlign: 'center', marginTop: '4rem' }}>
    <div
      className="indication"
      style={{
        marginBottom: '2rem',
        display: 'inline-flex',
        alignItems: 'center'
      }}
    >
      Nothing found &nbsp;<i className="material-icons">sms_failed</i>
    </div>
    <br />
    <Link to={{ pathname: '/q/new', state: { question: prefill } }}>
      <Button
        icon="record_voice_over"
        label="Ask the question!"
        primary
        raised
      />
    </Link>
  </div>
)

NoResults.propTypes = {
  prefill: PropTypes.string.isRequired
}

export default NoResults
