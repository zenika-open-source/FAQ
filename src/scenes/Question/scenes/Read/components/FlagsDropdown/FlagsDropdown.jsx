import React from 'react'

import { flagMeta } from 'components/Flags'
import Dropdown, { DropdownItem } from 'components/Dropdown'
import Button from 'components/Button'

import './FlagsDropdown.css'

const FlagsDropdown = ({ flags, onSelect, onRemove }) => {
  const flagTypes = ['incomplete', 'outdated', 'duplicate']

  const items = flagTypes.map(type => {
    const isSelected = flags.filter(f => f.type === type).length > 0
    return (
      <DropdownItem
        key={type}
        icon={flagMeta[type].icon}
        rightIcon={
          isSelected ? (
            <i
              className="material-icons close-icon"
              onClick={() => isSelected && onRemove(type)}
            >
              close
            </i>
          ) : null
        }
        disabled={isSelected}
        onClick={() => !isSelected && onSelect(type)}
      >
        {type}
      </DropdownItem>
    )
  })

  return (
    <Dropdown button={<Button icon="flag" label="Flag as ..." link />}>
      {items}
    </Dropdown>
  )
}

export default FlagsDropdown
