import React from 'react'

import { useAlerts } from './AlertProvider'
import Alert from './Alert'

import './AlertStack.scss'

const AlertStack = () => {
  const { alerts } = useAlerts()

  return (
    <div className="alert-stack">
      {alerts.map(alert => (
        <Alert key={alert.id} alert={alert} />
      ))}
    </div>
  )
}

export default AlertStack
