import React from 'react'
import PropTypes from 'prop-types'
import clone from 'lodash/clone'
import find from 'lodash/find'
import map from 'lodash/map'
import format from 'date-fns/format'

import Flag, { flagMeta } from './Flag'

import './Flags.css'

const Flags = ({ node, withLabels }) => {
  let flags = clone(node.flags)

  if (flags.length === 0) return ''

  return (
    <div className="flags">
      {map(flagMeta, (meta, type) => {
        let flag = find(flags, { type })

        if (!flag) return null

        let tooltip

        if (withLabels && flag.user) {
          tooltip =
            'By ' +
            flag.user.name +
            ' on ' +
            format(flag.createdAt, 'D MMM YYYY')
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
