import React from 'react'

import { Icon } from 'components'

import './DifferentGroup.scss'

const DifferentGroup = ({ group, action }) => (
  <div className="different-group">
    <Icon material="info" className="icon" />
    <span>
      You are currently {action} a question belonging to the group "{group.name}"
    </span>
  </div>
)

export default DifferentGroup
