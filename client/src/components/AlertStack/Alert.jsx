import cn from 'classnames'
import PropTypes from 'prop-types'
import { Component } from 'react'

import AlertContext from './AlertContext'

class Alert extends Component {
  static contextType = AlertContext

  componentDidMount() {
    setTimeout(() => this.context.showAlert(this.props.alert), 0)
    setTimeout(
      () => this.context.closeAlert(this.props.alert),
      this.props.alert.type === 'success' ? 5000 : 7000,
    )
  }

  render() {
    const { alert } = this.props

    const alertStyles = () => {
      if (alert.type === 'primary') {
        return 'bg-primary-light text-primary-font'
      } else if (alert.type === 'info') {
        return 'bg-info text-primary-font'
      } else if (alert.type === 'success') {
        return 'bg-success text-primary-font'
      } else if (alert.type === 'warning') {
        return 'bg-warning text-primary-font'
      } else if (alert.type === 'error') {
        return 'bg-error text-primary-font'
      }
    }

    const alertDisplay = () => {
      if (alert.shown) {
        return 'max-h-screen'
      } else if (alert.closed) {
        return 'hidden'
      }
    }

    return (
      <div
        className={cn(
          'relative mb-2 transition-max-h transition-mr duration-500 delay-500',
          alertDisplay(),
        )}
      >
        <div
          className={cn(
            'relative w-full flex items-center justify-start bg-[#f5f5f5] rounded-sm text-primary-font p-4 transition-all duration-500 delay-500',
            alertStyles(),
          )}
        >
          <p>{alert.message}</p>
          <button
            className="absolute right-1 top-1 bg-[rgba(10, 10, 10, 0.2)]"
            onClick={() => this.context.closeAlert(alert)}
          >
            <i className="material-icons text-lg">cancel</i>
          </button>
        </div>
      </div>
    )
  }
}

Alert.propTypes = {
  alert: PropTypes.shape({
    type: PropTypes.string.isRequired,
    message: PropTypes.node.isRequired,
  }).isRequired,
}

export default Alert
