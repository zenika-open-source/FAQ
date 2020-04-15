import React from 'react'
import { AlertProvider } from 'components'

import { useIntl as intl } from './intl'

const alert = {
  push: alert => AlertProvider.pushAlert(alert),
  pushError: (message, err) =>
    alert.push({
      message,
      type: 'error',
      raw: err
    }),
  pushDefaultError: err => {
    if (err?.result) {
      alert.push({
        message: intl(alert)(err.result?.extensions?.type) || intl(alert)('unknown'),
        type: 'error',
        raw: 'error'
      })
    } else {
      alert.push({
        message: (
          <>
            <p>{err.message || intl(alert)('unknown')}</p>
            <p>{intl(alert)('try_again')}</p>
          </>
        ),
        type: 'error',
        raw: err
      })
    }
  },
  pushSuccess: message => alert.push({ message, type: 'success' })
}

alert.translations = {
  en: {
    unknown: 'An unknown error occured.',
    'unauthorized-email-domain': 'You are not authorized to register with this email.',
    try_again: 'Please, try again'
  },
  fr: {
    unknown: 'Une erreur inconnue est survenue.',
    'unauthorized-email-domain': "Vous n'êtes pas autorisé à vous enregistrer avec cet email.",
    try_again: 'Réessayez de nouveau'
  }
}

export { alert }
