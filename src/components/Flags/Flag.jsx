import React from 'react'
import PropTypes from 'prop-types'
import capitalize from 'lodash/capitalize'
import cn from 'classnames'

const flagMeta = {
  duplicate: {
    icon: 'filter_2',
    color: '#BC5820'
  },
  outdated: {
    icon: 'history',
    color: '#586069'
  },
  incomplete: {
    icon: 'report',
    color: '#AF1E3A'
  },
  unanswered: {
    icon: 'help_outline',
    color: '#157B5F'
  }
}

const Flag = ({ flag, withlabel, style, ...otherProps }) => (
  <div
    className={cn('flag', {
      'with-label': withlabel
    })}
    style={{ backgroundColor: flagMeta[flag.type].color, ...style }}
    {...otherProps}
  >
    <i className="material-icons">{flagMeta[flag.type].icon}</i>
    {withlabel && <span className="label">{capitalize(flag.type)}</span>}
  </div>
)

Flag.propTypes = {
  flag: PropTypes.object.isRequired,
  withlabel: PropTypes.bool,
  style: PropTypes.object
}

export default Flag

export { flagMeta }
