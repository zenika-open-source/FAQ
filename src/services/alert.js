import { AlertProvider } from 'components'

const alert = {
  push: alert => AlertProvider.pushAlert(alert),
  pushError: (message, err) =>
    alert.push({
      message,
      type: 'error',
      raw: err
    }),
  pushSuccess: message => alert.push({ message, type: 'success' })
}

export default alert
