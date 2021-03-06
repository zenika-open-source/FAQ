import React, { useState } from 'react'
import cn from 'classnames'

import { useIntl } from 'services'
import HistoryActions from './HistoryActions.container'

import './History.css'

const History = () => {
  const intl = useIntl(History)
  const [open, setOpen] = useState(false)

  return (
    <div className="history">
      <div className={cn('toggler', open ? 'up' : 'down')} onClick={() => setOpen(st => !st)}>
        <span>{intl('title')}</span>
        <div className="arrow" />
      </div>
      {open && (
        <div className="actions">
          <HistoryActions />
        </div>
      )}
    </div>
  )
}

History.translations = {
  en: { title: 'history' },
  fr: { title: 'historique' }
}

export default History
