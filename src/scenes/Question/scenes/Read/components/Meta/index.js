import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'
import { DateTime } from 'luxon'

import IconMenu from 'react-toolbox/lib/menu/IconMenu'
import MenuItem from 'react-toolbox/lib/menu/MenuItem'

import Flag from '../Flag'

class Meta extends Component {
  render () {
    const { node, createFlag } = this.props

    const flagIcons = {
      outdated: 'history',
      incomplete: 'report'
    }

    const flags = node.flags.map(flag => {
      return (
        <Flag
          key={flag.id}
          caption={flag.type}
          icon={flagIcons[flag.type]}
          tooltip={
            'By ' +
            flag.user.name +
            ' on ' +
            DateTime.fromISO(flag.createdAt).toFormat('dd LLL yyyy')
          }
        />
      )
    })

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <b>
          Answered by {node.answer.user.name} on{' '}
          {DateTime.fromISO(node.answer.updatedAt).toFormat('dd LLL yyyy')}:
        </b>
        <div
          style={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {flags}
          <IconMenu icon="flag">
            {map(flagIcons, (icon, type) => {
              return (
                <MenuItem
                  key={type}
                  icon={icon}
                  caption={'Flag as ' + type}
                  disabled={node.flags.filter(f => f.type === type).length > 0}
                  onClick={() => createFlag(type)}
                />
              )
            })}
          </IconMenu>
        </div>
      </div>
    )
  }
}

Meta.propTypes = {
  node: PropTypes.object.isRequired,
  createFlag: PropTypes.func.isRequired
}

export default Meta
