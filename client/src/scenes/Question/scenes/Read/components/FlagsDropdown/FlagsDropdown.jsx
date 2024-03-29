import PropTypes from 'prop-types'

import { getIntl } from 'services'

import { Flag, flagMeta } from 'components/Flags'
import Dropdown, { DropdownItem } from 'components/Dropdown'
import Button from 'components/Button'

import { answerCanBeCertified } from 'helpers'
import { useUser } from 'contexts'

const FlagsDropdown = ({ zNode, onSelect, onRemove }) => {
  const intl = getIntl(FlagsDropdown)
  const flagIntl = getIntl(Flag)

  const { flags, tags, answer } = zNode
  const { specialties } = useUser()

  const flagTypes = ['incomplete', 'outdated', 'duplicate']

  answerCanBeCertified(specialties, tags, answer, flagTypes)

  const items = flagTypes.map((type) => {
    const isSelected = flags.filter((f) => f.type === type).length > 0
    return (
      <DropdownItem
        key={type}
        icon={flagMeta[type].icon}
        rightIcon={
          isSelected ? (
            <i
              className="material-icons cursor-pointer hover:text-red-500"
              onClick={() => isSelected && onRemove(type)}
            >
              close
            </i>
          ) : null
        }
        disabled={isSelected}
        onClick={() => !isSelected && onSelect(type)}
      >
        {flagIntl(type)}
      </DropdownItem>
    )
  })

  return (
    <Dropdown
      className="capitalize"
      button={<Button icon="flag" label={intl('button')} intent="link" size="medium" />}
    >
      {items}
    </Dropdown>
  )
}

FlagsDropdown.propTypes = {
  zNode: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
}

FlagsDropdown.translations = {
  en: { button: 'Flag as ...' },
  fr: { button: 'Signaler ...' },
}

export default FlagsDropdown
