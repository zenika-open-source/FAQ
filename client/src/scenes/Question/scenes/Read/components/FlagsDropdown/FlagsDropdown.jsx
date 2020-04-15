import React from 'react'
import { useMutation, gql } from '@apollo/client'

import { useIntl } from 'services'

import { Flag, flagMeta, Dropdown, Button } from 'components'

import './FlagsDropdown.css'

const FlagsDropdown = ({ nodeId, flags }) => {
  const intl = useIntl(FlagsDropdown)
  const flagIntl = useIntl(Flag)

  const [addFlag] = useMutation(gql`
    mutation($nodeId: String!, $flag: String!) {
      addFlag(nodeId: $nodeId, flag: $flag) {
        id
        flags {
          id
          type
          user {
            id
            name
          }
          createdAt
        }
      }
    }
  `)

  const [removeFlag] = useMutation(gql`
    mutation($nodeId: String!, $flag: String!) {
      removeFlag(nodeId: $nodeId, flag: $flag) {
        id
        flags {
          id
        }
      }
    }
  `)

  const flagTypes = ['incomplete', 'outdated', 'duplicate']

  const items = flagTypes.map(type => {
    const isSelected = flags.filter(f => f.type === type).length > 0
    return (
      <Dropdown.Item
        key={type}
        icon={flagMeta[type].icon}
        rightIcon={
          isSelected ? (
            <i
              className="material-icons close-icon"
              onClick={() => isSelected && removeFlag({ variables: { nodeId, flag: type } })}
            >
              close
            </i>
          ) : null
        }
        disabled={isSelected}
        onClick={() => !isSelected && addFlag({ variables: { nodeId, flag: type } })}
      >
        {flagIntl(type)}
      </Dropdown.Item>
    )
  })

  return <Dropdown button={<Button icon="flag" label={intl('button')} link />}>{items}</Dropdown>
}

FlagsDropdown.translations = {
  en: { button: 'Flag as ...' },
  fr: { button: 'Signaler ...' }
}

export default FlagsDropdown
