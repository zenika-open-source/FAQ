import { AlertStore } from 'components'

const alert = {
  push: alert => AlertStore.pushAlert(alert),
  pushError: (message, err) =>
    alert.push({
      message,
      type: 'error',
      raw: err
    }),
  pushSuccess: message => alert.push({ message, type: 'success' })
}

export default alert
