import capitalize from 'lodash/capitalize'
import PropTypes from 'prop-types'

import { format } from 'date-fns'
import { getIntl } from 'services'

const flagMeta = {
  duplicate: {
    icon: 'filter_2',
    color: '#AF1E3A',
  },
  outdated: {
    icon: 'history',
    color: '#586069',
  },
  incomplete: {
    icon: 'report',
    color: '#BC5820',
  },
  unanswered: {
    icon: 'help_outline',
    color: '#157B5F',
  },
  certified: {
    icon: 'verified',
    color: '#caac00',
  },
}

const Flag = ({ flag, withlabel, style, ...otherProps }) => {
  const intl = getIntl(Flag)

  return (
    <div
      className={`inline-flex items-center p-1 rounded-xl text-sm text-primary-font ${
        withlabel ? 'px-[0.3rem]' : ''
      }`}
      style={{ backgroundColor: flagMeta[flag.type].color, ...style }}
      {...otherProps}
    >
      <i className="material-icons text-base">{flagMeta[flag.type].icon}</i>
      {withlabel && (
        <span className="mr-1 uppercase pr-1">
          {capitalize(intl(flag.type))}
          {flag.type === 'certified' &&
            `
          ${intl('certifiedAdd')}
          ${format(new Date(flag.createdAt), 'P')}
          `}
        </span>
      )}
    </div>
  )
}

Flag.propTypes = {
  flag: PropTypes.object.isRequired,
  withlabel: PropTypes.bool,
  style: PropTypes.object,
}

Flag.translations = {
  en: {
    duplicate: 'duplicate',
    outdated: 'outdated',
    incomplete: 'incomplete',
    unanswered: 'unanswered',
    certified: 'certified',
    certifiedAdd: ' on ',
  },
  fr: {
    duplicate: 'doublon',
    outdated: 'obsolète',
    incomplete: 'incomplète',
    unanswered: 'sans réponse',
    certified: 'certifiée',
    certifiedAdd: ' le ',
  },
}

export default Flag

export { flagMeta }
