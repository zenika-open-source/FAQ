import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { useIntl } from 'services'

import './Loading.scss'

const Loading = ({ text, delay = 500 }) => {
  const intl = useIntl(Loading)

  const [show, setShow] = useState(delay === 0)

  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => {
        setShow(true)
      }, delay)
      return () => clearTimeout(timer)
    }
  }, [delay])

  return (
    <div
      style={{ textAlign: 'center', marginTop: '3rem', visibility: show ? 'visible' : 'hidden' }}
    >
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
