import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import Button from 'react-toolbox/lib/button/Button'

class NoResults extends Component {
  render () {
    const { prefill } = this.props
    return (
      <div style={{ textAlign: 'center', marginTop: '4rem' }}>
        <p className="indication" style={{ marginBottom: '2rem' }}>
          Nothing found &nbsp;<i className="material-icons">sms_failed</i>
        </p>
        <Link to={{ pathname: '/q/new', state: { question: prefill } }}>
          <Button
            icon="record_voice_over"
            label="Ask the question !"
            accent
            raised
          />
        </Link>
      </div>
    )
  }
}

NoResults.propTypes = {
  prefill: PropTypes.string.isRequired
}

export default NoResults
