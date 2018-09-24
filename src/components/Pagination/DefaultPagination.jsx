import React from 'react'
import PropTypes from 'prop-types'

import Button from '../Button'

import Pagination from './Pagination'

import './Pagination.css'

const renderPage = ({ index, isCurrent, onClick }) => (
  <Button
    key={index}
    label={index}
    link={!isCurrent}
    primary={isCurrent}
    active={isCurrent}
    raised
    onClick={onClick}
  />
)

const renderEllipsis = ({ key }) => <Button key={key} label="⋯" disabled />

const renderNav = ({ type, disabled, onClick }) => (
  <Button
    key={type}
    icon={type === 'previous' ? 'chevron_left' : 'chevron_right'}
    disabled={disabled}
    raised
    link
    onClick={onClick}
  />
)

const DefaultPagination = ({ nbPages, current, onPageSelected }) => (
  <Pagination
    nbPages={nbPages}
    current={current}
    onPageSelected={onPageSelected}
    renderPage={renderPage}
    renderEllipsis={renderEllipsis}
    renderNav={renderNav}
    className="pagination"
  />
)

DefaultPagination.propTypes = {
  nbPages: PropTypes.number,
  current: PropTypes.number,
  onPageSelected: PropTypes.func
}

renderPage.propTypes = {
  index: PropTypes.number,
  isCurrent: PropTypes.bool,
  onClick: PropTypes.func
}

renderEllipsis.propTypes = {
  key: PropTypes.string
}

renderNav.propTypes = {
  type: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func
}

export default DefaultPagination
