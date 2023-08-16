import { Component } from 'react'

import Alert from './Alert'
import AlertContext from './AlertContext'

class AlertStack extends Component {
  static contextType = AlertContext
  render() {
    return (
      <div className="fixed top-[72px] right-0 max-w-full w-[400px] min-w-[30vw]">
        {this.context.alerts.map((alert) => (
          <Alert key={alert.id} alert={alert} />
        ))}
      </div>
    )
  }
}

export default AlertStack
