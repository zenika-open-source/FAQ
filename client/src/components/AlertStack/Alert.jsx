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
        return 'max-h-screen mr-2'
      } else if (alert.closed) {
        return 'hidden'
      }
    }

    return (
      <div
        className={cn(
          'relative mr-0 mb-2 transition-max-h transition-mr duration-500 delay-500',
          alertDisplay(),
        )}
      >
        <div
          className={cn(
            'absolute top-0 bg-[#f5f5f5] rounded-sm text-secondary-font-dark -right-[100%] transition-all duration-500 delay-500',
            alertStyles(),
          )}
        >
          <button
            className="absolute right-2 top-2 bg-[rgba(10, 10, 10, 0.2)]"
            onClick={() => this.context.closeAlert(alert)}
          />
          <div className="py-4 pl-5 pr-9 [&_p]:m-0 rounded-full cursor-pointer pointer-events-auto inline-block flex-grow-0 flex-shrink-0 h-5 w-5 max-h-5 max-w-[1.25rem] align-top before:h-[2px] before:w-[50%] before:bg-primary-font before:content-[''] before:block before:l-[50%] before:absolute before:top-[50%] before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-45 before:origin-center after:h-[50px] after:w-[2px] after:bg-primary-font after:content-[''] after:block after:l-[50%] after:absolute after:top-[50%] after:-translate-x-1/2 after:-translate-y-1/2 after:rotate-45 after:origin-center">
            {alert.message}
          </div>
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
