import React, { useState } from 'react'
import cn from 'classnames'

import { useAuth } from 'contexts'

import { Icon } from 'components'

import { useClickOutside } from 'helpers'

import './GroupSwitcher.scss'

const GroupSwitcher = props => {
  const [active, setActive] = useState(false)
  const { ref } = useClickOutside(() => setActive(false))

  const auth = useAuth()

  const groupName = auth.user && auth.user.currentGroup && auth.user.currentGroup.name

  return (
    <div {...props} ref={ref}>
      <span
        className="tooltip-bottom"
        data-tooltip="Change group"
        onClick={() => setActive(state => !state)}
      >
        {groupName || ''}
        <Icon material="autorenew" />
      </span>
      <div className={cn('group-switcher', { active })}>
        {['my group', 'another group', 'third group'].map(g => (
          <div key={g} className={cn('group-item', { active: g === groupName })}>
            <Icon material={g === groupName ? 'check' : 'arrow_forward'} />
            {g}
          </div>
        ))}
      </div>
    </div>
  )
}

export default GroupSwitcher
