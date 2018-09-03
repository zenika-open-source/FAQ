import React from 'react'
import PropTypes from 'prop-types'

import HistoryAction from './HistoryAction'

const HistoryActions = ({ historyActions }) =>
  historyActions.map(action => (
    <HistoryAction key={action.id} action={action} />
  ))

HistoryActions.propTypes = {
  historyActions: PropTypes.array.isRequired
}

export default HistoryActions
