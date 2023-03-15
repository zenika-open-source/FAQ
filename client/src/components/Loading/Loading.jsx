import React from 'react'
import PropTypes from 'prop-types'

import { getIntl } from '@services'

import './Loading.css'

const Loading = ({ text }) => {
  const intl = getIntl(Loading)

  return (
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
        <b>{text || intl('loading')}</b>
      </p>
    </div>
  )
}

Loading.propTypes = {
  text: PropTypes.string
}

Loading.translations = {
  en: { loading: 'Loading...' },
  fr: { loading: 'Chargement...' }
}

export default Loading
