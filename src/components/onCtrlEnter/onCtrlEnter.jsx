import React, { Component } from 'react'
import PropTypes from 'prop-types'

const onCtrlEnter = WrappedComponent => {
  class onCtrlEnter extends Component {
    componentDidMount() {
      if (this.ref) {
        this.ref.addEventListener('keydown', this.keydownHandler)
      }
    }

    componentWillUnmount() {
      if (this.ref) {
        this.ref.removeEventListener('keydown', this.keydownHandler)
      }
    }

    keydownHandler = e => {
      if (e.keyCode === 13 && e.ctrlKey) {
        this.props.onCtrlEnterCallback()
      }
    }

    render() {
      const { children, onCtrlEnterCallback, ...otherProps } = this.props
      return (
        <WrappedComponent {...otherProps} setRef={ref => (this.ref = ref)}>
          {children}
        </WrappedComponent>
      )
    }
  }

  onCtrlEnter.propTypes = {
    onCtrlEnterCallback: PropTypes.func.isRequired,
    children: PropTypes.node
  }

  return onCtrlEnter
}

export default onCtrlEnter
