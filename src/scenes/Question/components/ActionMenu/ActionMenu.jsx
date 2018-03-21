import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import Button from 'components/Button'

import './ActionMenu.css'

const ActionMenu = ({ backLabel, backLink, title, children }) => (
  <div className="action-menu">
    <div className="back-btn">
      <Link to={backLink}>
        <Button icon="chevron_left" label={backLabel || 'Back'} link raised />
      </Link>
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

export default ActionMenu
