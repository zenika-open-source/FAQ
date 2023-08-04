import PropTypes from 'prop-types'

import { Input, Button } from 'components'

import './PairInput.css'

const PairInput = ({ pair, options, actions, disabled }) => {
  const { key, value } = pair
  return (
    <div className="group/pair-input flex items-center mb-2">
      <i className="material-icons group-focus-within/pair-input:text-primary">
        {options.icons.line}
      </i>
      <div className="flex items-center flex-1 ml-2">
        <Input
          className="w-2/5 mr-2 [&_input]:h-7 [&_input]:min-w-0 [&_input]:leading-7"
          icon={options.icons.key}
          placeholder={options.labels.key}
          value={key}
          onChange={(e) => actions.update({ ...pair, key: e.target.value })}
          disabled={disabled}
        />
        <Input
          className="flex-1 [&_input]:h-7 [&_input]:min-w-0 [&_input]:leading-7"
          icon={options.icons.value}
          placeholder={options.labels.value}
          value={value}
          onChange={(e) => actions.update({ ...pair, value: e.target.value })}
          disabled={disabled}
        />
      </div>
      <Button
        className="p-[0.3rem] ml-2"
        icon="close"
        intent={disabled ? 'disabled' : 'link'}
        action="raised"
        onClick={() => actions.delete(pair)}
      />
    </div>
  )
}

PairInput.propTypes = {
  pair: PropTypes.object.isRequired,
  options: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
}

export default PairInput
