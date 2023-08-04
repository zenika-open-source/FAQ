import cn from 'classnames'
import { useState } from 'react'

import { getIntl } from 'services'
import HistoryActions from './HistoryActions.container'

import './History.css'

const History = () => {
  const intl = getIntl(History)
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col items-center min-h-[1.5rem]">
      <div
        className={cn(
          'group/toggler flex justify-center relative cursor-pointer border border-primary-font',
          open
            ? 'group/up border-t-primary [&_.arrow]:top-[-5px] [&_.arrow]:border-b-primary-font [&_.arrow]:border-r-primary-font'
            : 'group/down hover:border-b-primary [&_.arrow]:top-[18px] [&_.arrow]:border-t-primary-font [&_.arrow]:border-l-primary-font',
        )}
        style={{ fontVariant: 'small-caps' }}
        onClick={() => setOpen((st) => !st)}
      >
        <span>{intl('title')}</span>
        <div className="arrow absolute border border-primary w-[10px] h-[10px] rotate-45 group-hover/toggler:w-0 group-hover/toggler:h-0 group-hover/toggler:border-[5.5px] group-hover/down:top-[16px]" />
      </div>
      {open && (
        <div className="flex flex-col-reverse w-full">
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
