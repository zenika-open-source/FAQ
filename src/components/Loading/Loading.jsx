import React from 'react'
import PropTypes from 'prop-types'

import './Loading.css'

const Loading = ({ text }) => (
  <div style={{ textAlign: 'center', marginTop: '3rem' }}>
    <div className="loader">
      <svg className="circular" viewBox="25 25 50 50">
        <circle
          className="path"
          cx="50"
          cy="50"
          r="20"
          fill="none"
          strokeWidth="2"
          strokeMiterlimit="10"
        />
      </svg>
    </div>
    <p>
      <b>{text || 'Loading...'}</b>
    </p>
  </div>
)

Loading.propTypes = {
  text: PropTypes.string
}

export default Loading
