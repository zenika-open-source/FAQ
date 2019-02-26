import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

import AlertContext from './AlertContext'

import './Alert.css'

class Alert extends Component {
  static contextType = AlertContext

  componentDidMount() {
    setTimeout(() => this.context.showAlert(this.props.alert), 0)
    setTimeout(
      () => this.context.closeAlert(this.props.alert),
      this.props.alert.type === 'success' ? 5000 : 7000
    )
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
          <button className="delete" onClick={() => this.context.closeAlert(alert)} />
          <div className="alert-content">{alert.message}</div>
        </div>
      </div>
    )
  }
}

Alert.propTypes = {
  alert: PropTypes.shape({
    type: PropTypes.string.isRequired,
    message: PropTypes.node.isRequired
  }).isRequired
}

export default Alert
