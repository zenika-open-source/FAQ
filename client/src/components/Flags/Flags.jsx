import React from 'react'
import PropTypes from 'prop-types'
//import clone from 'lodash/clone'
import find from 'lodash/find'
import map from 'lodash/map'
import format from 'date-fns/format'

import { useIntl } from 'services'

import Flag, { flagMeta } from './Flag'

import './Flags.css'

const Flags = ({ node, withLabels }) => {
  const intl = useIntl(Flags)
  const flagIntl = useIntl(Flag)

  const flags = node?.flags || [] //clone(node.flags)

  if (flags.length === 0) return ''

  return (
    <div className="flags">
      {map(flagMeta, (meta, type) => {
        let flag = find(flags, { type })

        if (!flag) return null

        let tooltip

        if (withLabels && flag.user) {
          tooltip = intl('tooltip')(flag.user.name, format(flag.createdAt, 'D MMM YYYY'))
        } else {
          tooltip = flagIntl(flag.type).toUpperCase()
        }

        return <Flag key={flag.id} withlabel={withLabels} data-tooltip={tooltip} flag={flag} />
      })}
    </div>
  )
}

Flags.propTypes = {
  node: PropTypes.object.isRequired,
  withLabels: PropTypes.bool
}

Flags.translations = {
  en: { tooltip: (name, date) => `By ${name} on ${date}` },
  fr: { tooltip: (name, date) => `Par ${name} le ${date}` }
}

export default Flags
