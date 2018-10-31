import React, { Component } from 'react'

import Alert from './Alert'
import AlertContext from './AlertContext'

import './AlertStack.css'

class AlertStack extends Component {
  static contextType = AlertContext
  render() {
    return (
      <div className="alert-stack">
        {this.context.alerts.map(alert => (
          <Alert key={alert.id} alert={alert} />
        ))}
      </div>
    )
  }
}

export default AlertStack
