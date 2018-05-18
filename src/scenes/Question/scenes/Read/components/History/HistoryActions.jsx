import React, { Component } from 'react'
import PropTypes from 'prop-types'

import HistoryAction from './HistoryAction'

class HistoryActions extends Component {
  render () {
    const { actions } = this.props

    return actions.map(action => (
      <HistoryAction key={action.id} action={action} />
    ))
  }
}

HistoryActions.propTypes = {
  actions: PropTypes.array.isRequired
}

export default HistoryActions
