import React, { PureComponent, memo, useEffect } from 'react'
import PropTypes from 'prop-types'

import { unserialize, addToQueryString } from 'helpers'
import { useLocation } from 'react-router'

const withPagination = (options = { push: true }) => Component => {
  const withPaginationWrapper = props => {
    const location = useLocation()
    const { history, loading, meta } = props

    const onMountOrUpdate = () => {
      const pagesCount = meta ? meta.pagesCount : 1
      const { page: currentPage } = unserialize(location.search)

      // If currentPage > pagesCount, redirect to last page
      if (!loading && pagesCount > 0 && currentPage > pagesCount) {
        addToQueryString(history, location, { page: pagesCount }, { push: options.push })
      }
    }

    useEffect(() => {
      onMountOrUpdate()
    }, [location.search])

    const count = meta ? meta.entriesCount : 0
    const pagesCount = meta ? meta.pagesCount : 1
    const { page } = unserialize(location.search)

    return (
      <Component
        {...props}
        entriesCount={count}
        pageCurrent={page}
        pagesCount={pagesCount}
        onPageSelected={page =>
          addToQueryString(history, location, { page }, { push: options.push })
        }
      />
    )
  }

  withPaginationWrapper.propTypes = {
    history: PropTypes.object,
    location: PropTypes.object,
    loading: PropTypes.bool,
    meta: PropTypes.object
  }

  return withPaginationWrapper
}

export default withPagination
