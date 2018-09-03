import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'

import Button from 'components/Button'

import './ActionMenu.css'

const ActionMenu = ({
  backLabel,
  backLink,
  goBack,
  title,
  children,
  history
}) => (
  <div className="action-menu">
    <div className="back-btn">
      {goBack && history.action === 'PUSH' ? (
        <Button
          icon="chevron_left"
          label={'Back'}
          link
          raised
          onClick={() => history.goBack()}
        />
      ) : (
        <Link to={backLink}>
          <Button icon="chevron_left" label={backLabel || 'Back'} link raised />
        </Link>
      )}
    </div>
    <div className="title">
      <h2>{title}</h2>
    </div>
    <div className="actions">{children}</div>
  </div>
)

ActionMenu.propTypes = {
  backLink: PropTypes.string.isRequired,
  backLabel: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.node
}

export default withRouter(ActionMenu)
