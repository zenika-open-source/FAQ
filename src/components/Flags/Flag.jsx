import React from 'react'
import PropTypes from 'prop-types'
import capitalize from 'lodash/capitalize'
import cn from 'classnames'

const flagMeta = {
  outdated: {
    icon: 'history',
    className: 'meta-warning-bg'
  },
  incomplete: {
    icon: 'report',
    className: 'meta-error-bg'
  },
  unanswered: {
    icon: 'help_outline',
    className: 'meta-warning-bg'
  },
  duplicate: {
    icon: 'filter_2',
    className: 'meta-error-bg'
  }
}

const Flag = ({ flag, withlabel, ...otherProps }) => (
  <div
    className={cn('flag', flagMeta[flag.type].className, {
      'with-label': withlabel
    })}
    {...otherProps}
  >
    <i className="material-icons">{flagMeta[flag.type].icon}</i>
    {withlabel && <span className="label">{capitalize(flag.type)}</span>}
  </div>
)

Flag.propTypes = {
  flag: PropTypes.object.isRequired,
  withlabel: PropTypes.bool
}

export default Flag

export { flagMeta }
