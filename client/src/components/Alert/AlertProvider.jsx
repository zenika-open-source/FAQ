import React, { useState, useCallback, useContext, useMemo } from 'react'

const AlertContext = React.createContext()

const useAlerts = () => useContext(AlertContext)

const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([])

  const pushAlert = useCallback(alert => {
    setAlerts(alerts => [{ ...alert, id: Math.random() }, ...alerts])
  }, [])

  // Yes, it is dirty. But it makes the alert service work, so... 🤷‍♂️
  AlertProvider.pushAlert = pushAlert

  const showAlert = useCallback(alertId => {
    setAlerts(alerts =>
      alerts.map(a => {
        if (a.id !== alertId) return a
        return { ...a, shown: true }
      })
    )
  }, [])

  const closeAlert = useCallback(alertId => {
    setAlerts(alerts =>
      alerts.map(a => {
        if (a.id !== alertId) return a
        return { ...a, closed: true }
      })
    )
  }, [])

  const value = useMemo(
    () => ({
      alerts,
      pushAlert,
      showAlert,
      closeAlert
    }),
    [alerts, pushAlert, showAlert, closeAlert]
  )

  return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>
}

export default AlertProvider
export { useAlerts }
