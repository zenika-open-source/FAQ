import PropTypes from 'prop-types'
import capitalize from 'lodash/capitalize'
import cn from 'classnames'

import { getIntl } from 'services'
import { format } from 'date-fns'

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
  translated: {
    icon: 'translate',
    color: '#0e00cc',
  },
}

const Flag = ({ flag, withlabel, style, ...otherProps }) => {
  const intl = getIntl(Flag)

  return (
    <div
      className={cn('flag', {
        'with-label': withlabel,
      })}
      style={{ backgroundColor: flagMeta[flag.type].color, ...style }}
      {...otherProps}
    >
      <i className="material-icons">{flagMeta[flag.type].icon}</i>
      {withlabel && (
        <span className="label">
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
    translated: 'translated',
  },
  fr: {
    duplicate: 'doublon',
    outdated: 'obsolète',
    incomplete: 'incomplète',
    unanswered: 'sans réponse',
    certified: 'certifiée',
    certifiedAdd: ' le ',
    translated: 'traduit',
  },
}

export default Flag

export { flagMeta }
