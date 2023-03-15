import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'

import { getIntl } from '@services'
import Button from '@components/Button'

import './ActionMenu.css'

const ActionMenu = ({ backLabel, backLink, goBack, title, children, history, location }) => {
  const intl = getIntl(ActionMenu)

  return (
    <div className="action-menu">
      <div className="back-btn">
        {goBack && location.state && location.state.from === 'home' ? (
          <Button
            icon="chevron_left"
            label={backLabel || intl('back')}
            link
            raised
            onClick={() => history.goBack()}
          />
        ) : (
          <Link to={backLink}>
            <Button icon="chevron_left" label={backLabel || intl('back')} link raised />
          </Link>
        )}
      </div>
      <div className="title">
        <h2>{title}</h2>
      </div>
      <div className="actions">{children}</div>
    </div>
  )
}

ActionMenu.propTypes = {
  backLink: PropTypes.string.isRequired,
  backLabel: PropTypes.string,
  goBack: PropTypes.bool,
  title: PropTypes.string,
  children: PropTypes.node,
  history: PropTypes.object,
  location: PropTypes.object
}

ActionMenu.translations = {
  en: { back: 'Back' },
  fr: { back: 'Retour' }
}

export default withRouter(ActionMenu)
