import React, { Component } from 'react'
import PropTypes from 'prop-types'

class CtrlEnter extends Component {
  constructor(props) {
    super(props)

    this.ref = React.createRef()
  }

  componentDidMount() {
    if (this.ref.current) {
      this.ref.current.addEventListener('keydown', this.keydownHandler)
    }
  }

  componentWillUnmount() {
    if (this.ref.current) {
      this.ref.current.removeEventListener('keydown', this.keydownHandler)
    }
  }

  keydownHandler = (e) => {
    if (e.keyCode === 13 && e.ctrlKey) {
      this.props.onCtrlEnterCallback()
    }
  }

  render() {
    const { children, onCtrlEnterCallback, ...rest } = this.props
    return (
      <div ref={this.ref} {...rest}>
        {this.props.children}
      </div>
    )
  }
}

CtrlEnter.propTypes = {
  onCtrlEnterCallback: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
}

export default CtrlEnter
