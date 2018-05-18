import React from 'react'
import PropTypes from 'prop-types'

import HistoryAction from './HistoryAction'

const HistoryActions = ({ actions }) =>
  actions.map(action => <HistoryAction key={action.id} action={action} />)

HistoryActions.propTypes = {
  actions: PropTypes.array.isRequired
}

export default HistoryActions
