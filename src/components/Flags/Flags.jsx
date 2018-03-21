import React from 'react'
import PropTypes from 'prop-types'
import uuid from 'uuid/v4'
import _ from 'lodash'
import moment from 'moment'

import Flag from './Flag'

import './Flags.css'

const Flags = ({ node, withLabels }) => {
  let flags = _.clone(node.flags)

  if (!node.answer) {
    flags.push({ id: uuid(), type: 'unanswered' })
  }

  if (flags.length === 0) return ''

  return (
    <div className="flags">
      {flags.map(flag => {
        let tooltip

        if (withLabels && flag.user) {
          tooltip =
            'By ' +
            flag.user.name +
            ' on ' +
            moment(flag.createdAt).format('D MMM YYYY')
        } else {
          tooltip = flag.type.toUpperCase()
        }

        return (
          <Flag
            key={flag.id}
            withlabel={withLabels}
            data-tooltip={tooltip}
            flag={flag}
          />
        )
      })}
    </div>
  )
}

Flags.propTypes = {
  node: PropTypes.object.isRequired,
  withLabels: PropTypes.bool
}

export default Flags
