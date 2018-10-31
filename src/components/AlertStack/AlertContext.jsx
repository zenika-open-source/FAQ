import React, { Component } from 'react'
import PropTypes from 'prop-types'

const AlertContext = React.createContext()

class AlertProvider extends Component {
  constructor(props) {
    super(props)

    this.state = {
      alerts: [],
      pushAlert: this.pushAlert,
      showAlert: this.showAlert,
      closeAlert: this.closeAlert
    }

    AlertProvider.pushAlert = this.pushAlert
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
export { AlertProvider }
