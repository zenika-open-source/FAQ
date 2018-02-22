import React, { Component } from 'react'
import PropTypes from 'prop-types'

import ProgressBar from 'react-toolbox/lib/progress_bar/ProgressBar'

class Loading extends Component {
  render () {
    const { text } = this.props
    return (
      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <ProgressBar type="circular" mode="indeterminate" multicolor />
        <p>
          <b>{text || 'Loading...'}</b>
        </p>
      </div>
    )
  }
}

Loading.propTypes = {
  text: PropTypes.string
}

export default Loading
