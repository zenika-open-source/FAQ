import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import { Button } from 'components'
import { useIntl } from 'services'

import './ActionMenu.scss'

const ActionMenu = ({ home, title, children }) => {
  const intl = useIntl(ActionMenu)
  const history = useHistory()
  const location = useLocation()

  const fromHome = location?.state?.from === 'home'

  return (
    <div className="action-menu">
      <div className="back-btn">
        <Button
          icon={home ? 'home' : 'chevron_left'}
          label={home ? intl('home') : intl('back')}
          link
          raised
          path={home && !fromHome ? '/' : undefined}
          onClick={home && !fromHome ? undefined : () => history.goBack()}
        />
      </div>
      {title && (
        <div className="title">
          <h2>{title}</h2>
        </div>
      )}
      <div className="actions">{children}</div>
    </div>
  )
}

ActionMenu.translations = {
  en: { home: 'Home', back: 'Back' },
  fr: { home: 'Accueil', back: 'Retour' }
}

export default ActionMenu
