import merge from 'lodash/merge'
import PropTypes from 'prop-types'

import { getIntl } from 'services'

import { Button } from 'components'

import PairInput from './PairInput'

const noop = () => {}

const PairInputList = ({ pairs, options, actions, disabled, className, ...rest }) => {
  const intl = getIntl(PairInputList)

  const defaultOptions = {
    labels: intl('labels'),
    icons: {
      more: 'add',
      line: 'info_outline',
      key: 'label_outline',
      value: 'link',
    },
  }

  const defaultActions = {
    create: noop,
    update: noop,
    delete: noop,
  }

  options = merge(defaultOptions, options)
  actions = merge(defaultActions, actions)

  const isEmpty = pairs.length === 0

  return (
    <div className={className} {...rest}>
      {options.title && !isEmpty ? <h3 className="text-primary m-3">{options.title}</h3> : null}
      {pairs.map((pair) => (
        <PairInput
          key={pair.id}
          pair={pair}
          options={options}
          actions={actions}
          disabled={disabled}
        />
      ))}
      <div className={isEmpty ? 'text-left' : 'text-center'}>
        {
          <Button
            icon={isEmpty ? options.icons.add || options.icons.more : options.icons.more}
            label={isEmpty ? options.labels.add || options.labels.more : options.labels.more}
            intent={disabled ? 'disabled' : 'link'}
            action="raised"
            size="medium"
            onClick={actions.create}
          />
        }
      </div>
    </div>
  )
}

PairInputList.propTypes = {
  pairs: PropTypes.array.isRequired,
  options: PropTypes.object,
  actions: PropTypes.object,
  disabled: PropTypes.bool,
  className: PropTypes.string,
}

PairInputList.translations = {
  en: {
    labels: {
      more: 'More pairs',
      key: 'Key',
      value: 'Value',
    },
  },
  fr: {
    labels: {
      more: 'Plus de paires',
      key: 'Clef',
      value: 'Valeur',
    },
  },
}

export default PairInputList
