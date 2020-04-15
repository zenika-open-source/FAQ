import React, { useEffect } from 'react'
import cn from 'classnames'

import { useAlerts } from './AlertProvider'

import './Alert.scss'

const Alert = ({ alert }) => {
  const { showAlert, closeAlert } = useAlerts()

  useEffect(() => {
    setTimeout(() => showAlert(alert.id), 0)

    const timeout = setTimeout(() => closeAlert(alert.id), alert.type === 'success' ? 5000 : 7000)

    return () => clearTimeout(timeout)
  }, [alert.id, alert.type, showAlert, closeAlert])

  return (
    <div className={cn('alert-wrapper', { 'is-shown': alert.shown, 'is-closed': alert.closed })}>
      <div className={cn('alert', 'is-' + alert.type)}>
        <button className="delete" onClick={() => closeAlert(alert.id)} />
        <div className="alert-content">{alert.message}</div>
      </div>
    </div>
  )
}

export default Alert
