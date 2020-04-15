import React, { useState, useEffect } from 'react'

import { useIntl } from 'services'

import { isSessionSeen, setSessionSeen } from './helpers'

import './Views.scss'
import { useMutation, gql } from '@apollo/client'

const Views = ({ questionId, value }) => {
  const intl = useIntl(Views)

  const [seen, setSeen] = useState(() => isSessionSeen(questionId))

  const [incrementViews] = useMutation(gql`
    mutation($questionId: String!) {
      incrementQuestionViewsCounter(questionId: $questionId) {
        id
        views
      }
    }
  `)

  useEffect(() => {
    if (!seen) {
      // Less than 5s on the question isn't enough to be considered as a view
      const timeout = setTimeout(() => {
        incrementViews({ variables: { questionId } }).then(() => {
          setSeen(true)
          setSessionSeen(questionId)
        })
      }, 5000)

      return () => clearTimeout(timeout)
    }
  }, [seen, questionId, incrementViews])

  const formattedValue =
    value >= 1000
      ? `${(value / 1000).toLocaleString(window.navigator.language, {
          maximumSignificantDigits: 2
        })}k`
      : value

  return (
    <span className="views">
      {formattedValue} {intl('views')(value)}
    </span>
  )
}

Views.translations = {
  en: {
    views: x => (x === 1 ? 'view' : 'views')
  },
  fr: {
    views: x => (x === 1 ? 'vue' : 'vues')
  }
}

export default Views
