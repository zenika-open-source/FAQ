import React from 'react'
import { AlertProvider } from 'components'

import { useIntl } from './intl'

const alert = {
  push: alert => AlertProvider.pushAlert(alert),
  pushError: (message, err) =>
    alert.push({
      message,
      type: 'error',
      raw: err
    }),
  pushDefaultError: err =>
    alert.push({
      message: (
        <>
          <p>{err.message || useIntl(alert)('unknown')}</p>
          <p>{useIntl(alert)('try_again')}</p>
        </>
      ),
      type: 'error',
      raw: err
    }),
  pushSuccess: message => alert.push({ message, type: 'success' })
}

alert.translations = {
  en: { unknown: 'An unknown error occured.', try_again: 'Please, try again' },
  fr: { unknown: 'Une erreur inconnue est survenue.', try_again: 'Réessayez de nouveau' }
}

export default alert
