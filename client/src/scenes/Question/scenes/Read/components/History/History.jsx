import cn from 'classnames'
import { useState } from 'react'

import { getIntl } from 'services'
import HistoryActions from './HistoryActions.container'

import './History.css'

const History = () => {
  const intl = getIntl(History)
  const [open, setOpen] = useState(false)

  return (
    <div className="history">
      <div className={cn('toggler', open ? 'up' : 'down')} onClick={() => setOpen((st) => !st)}>
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
  fr: { title: 'historique' },
}

export default History
