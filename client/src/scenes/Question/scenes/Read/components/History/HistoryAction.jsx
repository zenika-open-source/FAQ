import React from 'react'
import PropTypes from 'prop-types'

import { formatHistoryAction } from '@helpers'

import Avatar from '@components/Avatar'

import './History.css'

const HistoryAction = ({ action }) => {
  action = formatHistoryAction(action)

  return (
    <div className="history-action">
      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
        <div>
          <i className="material-icons">{action.icon}</i>
        </div>
        <div>
          <Avatar image={action.user.picture} style={{ width: '25px', minWidth: '25px' }} />
        </div>
        <div>
          {action.user.name} {action.sentence}.
        </div>
      </div>
      <div style={{ minWidth: '150px', textAlign: 'right' }}>
        <i>{action.date}</i>
      </div>
    </div>
  )
}

HistoryAction.propTypes = {
  action: PropTypes.object.isRequired
}

export default HistoryAction
