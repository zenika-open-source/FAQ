import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { capitalize } from 'lodash'

import Chip from 'react-toolbox/lib/chip/Chip'
import Avatar from 'react-toolbox/lib/avatar/Avatar'
import Tooltip from 'react-toolbox/lib/tooltip/Tooltip'

const TooltipChip = Tooltip()(Chip)

class Flag extends Component {
  render () {
    const { caption, icon, color, tooltip } = this.props

    return (
      <TooltipChip tooltip={tooltip} tooltipPosition="top">
        <Avatar
          style={{
            backgroundColor: color || 'Crimson'
          }}
          icon={icon || 'report'}
        />
        {capitalize(caption)}
      </TooltipChip>
    )
  }
}

Flag.propTypes = {
  caption: PropTypes.string.isRequired,
  icon: PropTypes.string,
  color: PropTypes.string,
  tooltip: PropTypes.string
}

export default Flag
