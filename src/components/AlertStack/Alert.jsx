import React, { Component } from 'react'
import cn from 'classnames'

import AlertContext from './AlertContext'

import './Alert.css'

class Alert extends Component {
  static contextType = AlertContext

  componentDidMount() {
    setTimeout(() => this.context.showAlert(this.props.alert), 0)
    setTimeout(() => this.context.closeAlert(this.props.alert), 5000)
  }

  render() {
    const { alert } = this.props

    return (
      <div
        className={cn('alert-wrapper', {
          'is-shown': alert.shown,
          'is-closed': alert.closed
        })}
      >
        <div className={cn('alert', 'is-' + alert.type)}>
          <button
            className="delete"
            onClick={() => this.context.closeAlert(alert)}
          />
          <div className="alert-content">{alert.message}</div>
        </div>
      </div>
    )
  }
}

export default Alert
