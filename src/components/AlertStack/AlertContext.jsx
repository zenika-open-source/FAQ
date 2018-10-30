import React, { Component } from 'react'
import PropTypes from 'prop-types'

const AlertContext = React.createContext()

const AlertStore = {}

class AlertProvider extends Component {
  constructor(props) {
    super(props)

    this.state = {
      alerts: [
        {
          id: 1,
          message: 'Primary alert',
          type: 'primary'
        },
        {
          id: 2,
          message: 'Success alert',
          type: 'success'
        },
        {
          id: 3,
          message: 'Info alert',
          type: 'info'
        },
        {
          id: 4,
          message: 'Warning alert',
          type: 'warning'
        },
        {
          id: 5,
          message: 'Error alert',
          type: 'error'
        }
      ],
      pushAlert: this.pushAlert,
      showAlert: this.showAlert,
      closeAlert: this.closeAlert
    }

    AlertStore.pushAlert = this.pushAlert
  }

  pushAlert = alert => {
    this.setState(state => ({
      alerts: [{ ...alert, id: Math.random() }, ...state.alerts]
    }))

    if (['error', 'warning'].includes(alert.type)) {
      // eslint-disable-next-line no-console
      console.error(alert)
    }
  }

  showAlert = alert =>
    this.setState(state => ({
      alerts: state.alerts.map(a => {
        if (a !== alert) return a
        return { ...alert, shown: true }
      })
    }))

  closeAlert = alert =>
    this.setState(state => ({
      alerts: state.alerts.map(a => {
        if (a !== alert) return a
        return { ...alert, closed: true }
      })
    }))

  render() {
    return (
      <AlertContext.Provider value={this.state}>
        {this.props.children}
      </AlertContext.Provider>
    )
  }
}

AlertProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export default AlertContext
export { AlertProvider, AlertStore }
