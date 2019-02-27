import React from 'react'
import { AlertProvider } from 'components'

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
          <p>{err.message || 'An unknown error occured.'}</p>
          <p>Please, try again</p>
        </>
      ),
      type: 'error',
      raw: err
    }),
  pushSuccess: message => alert.push({ message, type: 'success' })
}

export default alert
