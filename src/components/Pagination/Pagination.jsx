import React from 'react'
import PropTypes from 'prop-types'
import clamp from 'lodash/clamp'

const filterPages = (pagesCount, current) =>
  [...Array(pagesCount)]
    .map((x, i) => i + 1)
    .reduce(
      (acc, i) =>
        i === 1 || i === pagesCount || (i >= current - 2 && i <= current + 2)
          ? [...acc, i]
          : [...acc, null],
      []
    )
    .reduce((acc, x, index, arr) => {
      if (x == null) {
        if (arr[index + 1] != null) {
          return [...acc, '...']
        }
        return acc
      }
      return [...acc, x]
    }, [])

const Pagination = ({
  nbPages,
  current,
  onPageSelected,
  renderPage,
  renderEllipsis,
  renderNav,
  ...rest
}) => {
  nbPages = Math.max(nbPages, 1)
  current = clamp(current, 1, nbPages)

  const pages = filterPages(nbPages, current).map((index, i) => {
    if (index === '...') return renderEllipsis({ key: `ellipsis-${i}` })

    const isCurrent = index === current
    return renderPage({
      index,
      isCurrent,
      onClick: () => !isCurrent && onPageSelected(index)
    })
  })

  const previous = renderNav({
    type: 'previous',
    disabled: current === 1,
    onClick: () => current > 1 && onPageSelected(current - 1)
  })

  const next = renderNav({
    type: 'next',
    disabled: current === nbPages,
    onClick: () => current < nbPages && onPageSelected(current + 1)
  })

  return (
    <div {...rest}>
      {previous}
      {pages}
      {next}
    </div>
  )
}

Pagination.propTypes = {
  nbPages: PropTypes.number,
  current: PropTypes.number,
  onPageSelected: PropTypes.func,
  renderPage: PropTypes.func,
  renderEllipsis: PropTypes.func,
  renderNav: PropTypes.func
}

export default Pagination
