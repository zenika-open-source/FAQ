import PropTypes from 'prop-types'

import Button from '../Button'

import Pagination from './Pagination'

const renderPage = ({ index, isCurrent, onClick }) => {
  return (
    <Button
      key={index}
      label={index}
      active={isCurrent}
      intent={isCurrent ? 'primary' : 'link'}
      action="raised"
      size="pagination"
      onClick={onClick}
    />
  )
}

const renderEllipsis = ({ key }) => <Button key={key} label="⋯" action="disabled" />

const renderNav = ({ type, disabled, onClick }) => {
  return (
    <Button
      key={type}
      icon={type === 'previous' ? 'chevron_left' : 'chevron_right'}
      intent="link"
      size="pagination"
      action={disabled ? 'disabled' : 'raised'}
      onClick={onClick}
    />
  )
}

const DefaultPagination = ({ nbPages, current, onPageSelected }) => (
  <Pagination
    nbPages={nbPages}
    current={current}
    onPageSelected={onPageSelected}
    renderPage={renderPage}
    renderEllipsis={renderEllipsis}
    renderNav={renderNav}
    className="flex justify-center gap-x-2"
  />
)

DefaultPagination.propTypes = {
  nbPages: PropTypes.number,
  current: PropTypes.number,
  onPageSelected: PropTypes.func,
}

renderPage.propTypes = {
  index: PropTypes.number,
  isCurrent: PropTypes.bool,
  onClick: PropTypes.func,
}

renderEllipsis.propTypes = {
  key: PropTypes.string,
}

renderNav.propTypes = {
  type: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
}

export default DefaultPagination
