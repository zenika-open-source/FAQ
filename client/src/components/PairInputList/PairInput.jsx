import React from 'react'
import PropTypes from 'prop-types'

import { Input, Button } from 'components'

import './PairInput.css'

const PairInput = ({ pair, options, actions, disabled }) => {
  const { key, value } = pair
  return (
    <div className="pair-input">
      <i className="material-icons">{options.icons.line}</i>
      <div className="pair-input-inputs">
        <Input
          className="pair-input-key"
          icon={options.icons.key}
          placeholder={options.labels.key}
          value={key}
          onChange={e => actions.update({ ...pair, key: e.target.value })}
          disabled={disabled}
        />
        <Input
          className="pair-input-value"
          icon={options.icons.value}
          placeholder={options.labels.value}
          value={value}
          onChange={e => actions.update({ ...pair, value: e.target.value })}
          disabled={disabled}
        />
      </div>
      <Button
        style={{ padding: '0.3rem', marginLeft: '0.5rem' }}
        icon="close"
        link
        raised
        onClick={() => actions.delete(pair)}
        disabled={disabled}
      />
    </div>
  )
}

PairInput.propTypes = {
  pair: PropTypes.object.isRequired,
  options: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  disabled: PropTypes.bool
}

export default PairInput
