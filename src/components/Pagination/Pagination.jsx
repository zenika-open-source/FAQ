import React from 'react'
import PropTypes from 'prop-types'

import Button from '../Button'

import './Pagination.css'

const Pagination = ({ pages, current, onPageSelected }) => {
  const buttons = [...Array(pages)].map((x, i) => {
    const isCurrent = i + 1 === current
    return (
      <Button
        key={i}
        label={i + 1 + ''}
        link={!isCurrent}
        primary={isCurrent}
        active={isCurrent}
        raised
        onClick={() => !isCurrent && onPageSelected(i + 1)}
      />
    )
  })

  return (
    <div className="pagination">
      <Button
        icon="chevron_left"
        disabled={current === 1}
        raised
        link
        onClick={() => onPageSelected(current - 1)}
      />
      {buttons}
      <Button
        icon="chevron_right"
        disabled={current === pages}
        raised
        link
        onClick={() => onPageSelected(current + 1)}
      />
    </div>
  )
}

Pagination.propTypes = {
  pages: PropTypes.number.isRequired,
  current: PropTypes.number.isRequired,
  onPageSelected: PropTypes.func.isRequired
}

export default Pagination
